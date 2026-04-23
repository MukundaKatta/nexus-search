import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { anthropic, AI_MODEL } from '@/lib/claude';
import { getSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import { SearchMode } from '@/types';

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimiter.get(ip);

  if (!entry || now > entry.resetAt) {
    // Evict all expired entries when creating a new one to prevent unbounded growth.
    for (const [key, val] of rateLimiter) {
      if (now > val.resetAt) rateLimiter.delete(key);
    }
    rateLimiter.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';

  if (!checkRateLimit(ip)) {
    return new Response('Rate limit exceeded. Please wait a moment.', { status: 429 });
  }

  try {
    const { query, searchResults, mode, messages } = await request.json();

    const systemPrompt = getSystemPrompt((mode as SearchMode) || 'search');

    // If messages are provided, it's a follow-up chat
    if (messages && messages.length > 0) {
      const result = streamText({
        model: anthropic(AI_MODEL),
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      });

      return result.toTextStreamResponse();
    }

    // Initial AI answer based on search results
    const userPrompt = buildUserPrompt(
      query,
      searchResults?.slice(0, 5) || []
    );

    const result = streamText({
      model: anthropic(AI_MODEL),
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI API error:', error);
    return new Response('AI processing failed. Please try again.', {
      status: 500,
    });
  }
}
