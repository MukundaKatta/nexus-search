'use client';

import { create } from 'zustand';
import {
  SearchMode,
  SearchResult,
  ImageResult,
  AIMessage,
  SearchHistoryItem,
  InfoBox,
} from '@/types';

interface SearchState {
  // Query
  query: string;
  setQuery: (query: string) => void;

  // Mode
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;

  // Results
  results: SearchResult[];
  imageResults: ImageResult[];
  totalCount: number;
  queryTime: number;
  relatedSearches: string[];
  infobox: InfoBox | null;
  setResults: (data: {
    results: SearchResult[];
    totalCount: number;
    queryTime: number;
    relatedSearches: string[];
    infobox?: InfoBox | null;
  }) => void;
  setImageResults: (results: ImageResult[]) => void;

  // Loading
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;
  isAILoading: boolean;
  setIsAILoading: (v: boolean) => void;

  // AI
  aiAnswer: string;
  setAIAnswer: (answer: string) => void;
  aiMessages: AIMessage[];
  addAIMessage: (msg: AIMessage) => void;
  clearAIMessages: () => void;
  showAIChat: boolean;
  setShowAIChat: (v: boolean) => void;

  // Summaries
  summaries: Record<string, string>;
  setSummary: (resultId: string, summary: string) => void;
  loadingSummaries: Record<string, boolean>;
  setLoadingSummary: (resultId: string, loading: boolean) => void;

  // History
  history: SearchHistoryItem[];
  setHistory: (items: SearchHistoryItem[]) => void;

  // Cache
  cache: Record<string, { results: SearchResult[]; totalCount: number; queryTime: number }>;
  setCacheEntry: (key: string, data: { results: SearchResult[]; totalCount: number; queryTime: number }) => void;

  // Page
  page: number;
  setPage: (page: number) => void;

  // Voice
  isListening: boolean;
  setIsListening: (v: boolean) => void;

  // Reset
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),

  mode: 'search',
  setMode: (mode) => set({ mode }),

  results: [],
  imageResults: [],
  totalCount: 0,
  queryTime: 0,
  relatedSearches: [],
  infobox: null,
  setResults: (data) =>
    set({
      results: data.results,
      totalCount: data.totalCount,
      queryTime: data.queryTime,
      relatedSearches: data.relatedSearches,
      infobox: data.infobox || null,
    }),
  setImageResults: (imageResults) => set({ imageResults }),

  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),
  isAILoading: false,
  setIsAILoading: (isAILoading) => set({ isAILoading }),

  aiAnswer: '',
  setAIAnswer: (aiAnswer) => set({ aiAnswer }),
  aiMessages: [],
  addAIMessage: (msg) =>
    set((state) => ({ aiMessages: [...state.aiMessages, msg] })),
  clearAIMessages: () => set({ aiMessages: [] }),
  showAIChat: false,
  setShowAIChat: (showAIChat) => set({ showAIChat }),

  summaries: {},
  setSummary: (resultId, summary) =>
    set((state) => ({ summaries: { ...state.summaries, [resultId]: summary } })),
  loadingSummaries: {},
  setLoadingSummary: (resultId, loading) =>
    set((state) => ({
      loadingSummaries: { ...state.loadingSummaries, [resultId]: loading },
    })),

  history: [],
  setHistory: (history) => set({ history }),

  cache: {},
  setCacheEntry: (key, data) =>
    set((state) => ({ cache: { ...state.cache, [key]: data } })),

  page: 1,
  setPage: (page) => set({ page }),

  isListening: false,
  setIsListening: (isListening) => set({ isListening }),

  reset: () =>
    set({
      results: [],
      imageResults: [],
      totalCount: 0,
      queryTime: 0,
      relatedSearches: [],
      infobox: null,
      aiAnswer: '',
      aiMessages: [],
      summaries: {},
      loadingSummaries: {},
      page: 1,
      showAIChat: false,
    }),
}));
