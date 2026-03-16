import { NextRequest, NextResponse } from 'next/server';
import { searchHistoryByQuery } from '@/lib/db';

const POPULAR_QUERIES = [
  'latest AI news',
  'best programming languages 2025',
  'climate change solutions',
  'quantum computing explained',
  'healthy meal prep ideas',
  'machine learning tutorial',
  'space exploration updates',
  'cybersecurity best practices',
  'renewable energy trends',
  'remote work productivity tips',
  'web development frameworks',
  'cryptocurrency market analysis',
  'mental health resources',
  'data science career path',
  'electric vehicles comparison',
];

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    // Get matching history
    const historyResults = searchHistoryByQuery(query, 5);
    const historySuggestions = historyResults.map((h) => ({
      text: h.query,
      type: 'history' as const,
    }));

    // Get matching popular queries
    const lowerQuery = query.toLowerCase();
    const popularSuggestions = POPULAR_QUERIES
      .filter((q) => q.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .map((text) => ({ text, type: 'suggestion' as const }));

    // Merge, deduplicate by text
    const seen = new Set<string>();
    const suggestions = [...historySuggestions, ...popularSuggestions].filter(
      (s) => {
        const key = s.text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }
    );

    return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error('Suggest API error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}
