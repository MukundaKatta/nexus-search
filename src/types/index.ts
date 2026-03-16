export type SearchMode = 'search' | 'ai' | 'creative' | 'code' | 'images' | 'scholar';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: string;
  favicon?: string;
  publishedDate?: string;
  timeAgo?: string;
  thumbnail?: string;
}

export interface ImageResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  sourceUrl: string;
  source: string;
  width: number;
  height: number;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount: number;
  queryTime: number;
  relatedSearches: string[];
  infobox?: InfoBox;
}

export interface InfoBox {
  title: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string>;
  url?: string;
}

export interface SearchHistoryItem {
  id: number;
  query: string;
  mode: SearchMode;
  results_count: number;
  ai_summary?: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  snippet?: string;
  source?: string;
  created_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface QuickInsight {
  label: string;
  value: number;
  color: string;
}

export interface SuggestionItem {
  text: string;
  type: 'history' | 'suggestion';
}

export interface ModeOption {
  id: SearchMode;
  label: string;
  icon: string;
  description: string;
}
