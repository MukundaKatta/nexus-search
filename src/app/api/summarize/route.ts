import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { anthropic, AI_MODEL } from '@/lib/claude';
import { buildSummarizePrompt } from '@/lib/prompts';
import * as cheerio from 'cheerio';

async function fetchPageContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NexusBot/1.0)',
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, nav, footer
    $('script, style, nav, footer, header, iframe, noscript').remove();

    // Get main content
    const mainContent =
      $('article').text() ||
      $('main').text() ||
      $('[role="main"]').text() ||
      $('body').text();

    return mainContent.replace(/\s+/g, ' ').trim();
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, title } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const content = await fetchPageContent(url);

    if (!content || content.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from this page' },
        { status: 422 }
      );
    }

    const prompt = buildSummarizePrompt(content, title || 'Untitled');

    const result = streamText({
      model: anthropic(AI_MODEL),
      messages: [{ role: 'user', content: prompt }],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Summarize API error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize. The page may be inaccessible.' },
      { status: 500 }
    );
  }
}
