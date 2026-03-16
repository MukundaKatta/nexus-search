import { NextRequest, NextResponse } from 'next/server';
import { addSearchHistory, getSearchHistory } from '@/lib/db';

export async function GET() {
  try {
    const history = getSearchHistory(50);
    return NextResponse.json({ history });
  } catch (error) {
    console.error('History GET error:', error);
    return NextResponse.json({ history: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, mode, results_count } = await request.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    addSearchHistory(query, mode || 'search', results_count || 0);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History POST error:', error);
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 });
  }
}
