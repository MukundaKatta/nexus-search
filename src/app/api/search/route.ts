import { NextRequest, NextResponse } from 'next/server';
import { searchBrave, searchBraveImages } from '@/lib/brave';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get('q');
  const mode = searchParams.get('mode') || 'search';
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    if (mode === 'images') {
      const images = await searchBraveImages(query);
      return NextResponse.json({ images });
    }

    const data = await searchBrave(query, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}
