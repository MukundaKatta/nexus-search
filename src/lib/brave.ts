import { SearchResult, SearchResponse, ImageResult, InfoBox } from '@/types';
import { generateId, extractDomain, timeAgo } from './utils';

const BRAVE_API_BASE = 'https://api.search.brave.com/res/v1';

interface BraveWebResult {
  title: string;
  url: string;
  description: string;
  page_age?: string;
  meta_url?: { favicon?: string };
  thumbnail?: { src?: string };
}

interface BraveSearchResponse {
  web?: { results: BraveWebResult[]; totalEstimatedMatches?: number };
  query?: { altered?: string };
  infobox?: { results?: Array<{
    title: string;
    description: string;
    long_desc?: string;
    thumbnail?: { src?: string };
    url?: string;
    attributes?: Array<{ label: string; value: string }>;
  }> };
  mixed?: { main?: Array<{ type: string }> };
}

export async function searchBrave(
  query: string,
  page: number = 1,
  count: number = 10
): Promise<SearchResponse> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('BRAVE_SEARCH_API_KEY is not configured');
  }

  const offset = (page - 1) * count;
  const params = new URLSearchParams({
    q: query,
    count: count.toString(),
    offset: offset.toString(),
  });

  const startTime = performance.now();

  const response = await fetch(`${BRAVE_API_BASE}/web/search?${params}`, {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave API error: ${response.status} ${response.statusText}`);
  }

  const data: BraveSearchResponse = await response.json();
  const queryTime = (performance.now() - startTime) / 1000;

  const results: SearchResult[] = (data.web?.results || []).map((r) => ({
    id: generateId(),
    title: r.title,
    url: r.url,
    snippet: r.description,
    source: extractDomain(r.url),
    favicon: r.meta_url?.favicon,
    publishedDate: r.page_age,
    timeAgo: r.page_age ? timeAgo(r.page_age) : undefined,
    thumbnail: r.thumbnail?.src,
  }));

  let infobox: InfoBox | undefined;
  if (data.infobox?.results?.[0]) {
    const ib = data.infobox.results[0];
    infobox = {
      title: ib.title,
      description: ib.long_desc || ib.description,
      imageUrl: ib.thumbnail?.src,
      url: ib.url,
      attributes: ib.attributes?.reduce(
        (acc, attr) => ({ ...acc, [attr.label]: attr.value }),
        {} as Record<string, string>
      ),
    };
  }

  return {
    results,
    totalCount: data.web?.totalEstimatedMatches || results.length,
    queryTime: Math.round(queryTime * 100) / 100,
    relatedSearches: [],
    infobox,
  };
}

export async function searchBraveImages(
  query: string,
  count: number = 20
): Promise<ImageResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error('BRAVE_SEARCH_API_KEY is not configured');

  const params = new URLSearchParams({ q: query, count: count.toString() });

  const response = await fetch(`${BRAVE_API_BASE}/images/search?${params}`, {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Images API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.results || []).map(
    (r: { title: string; url: string; thumbnail?: { src: string }; source?: string; properties?: { url: string }; width?: number; height?: number }) => ({
      id: generateId(),
      title: r.title,
      url: r.properties?.url || r.url,
      thumbnailUrl: r.thumbnail?.src || r.url,
      sourceUrl: r.url,
      source: extractDomain(r.source || r.url),
      width: r.width || 300,
      height: r.height || 200,
    })
  );
}
