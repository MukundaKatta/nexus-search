'use client';

import { useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { SearchMode } from '@/types';

export function useSearch() {
  const {
    setResults,
    setImageResults,
    setIsSearching,
    setAIAnswer,
    setIsAILoading,
    cache,
    setCacheEntry,
    mode,
  } = useSearchStore();

  const performSearch = useCallback(
    async (query: string, searchMode?: SearchMode, page: number = 1) => {
      const activeMode = searchMode || mode;
      const cacheKey = `${query}:${activeMode}:${page}`;

      // Check cache
      if (cache[cacheKey]) {
        setResults({
          results: cache[cacheKey].results,
          totalCount: cache[cacheKey].totalCount,
          queryTime: cache[cacheKey].queryTime,
          relatedSearches: [],
        });
        return;
      }

      setIsSearching(true);

      try {
        // Fetch search results
        const searchRes = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&mode=${activeMode}&page=${page}`
        );
        const searchData = await searchRes.json();

        if (activeMode === 'images') {
          setImageResults(searchData.images || []);
        } else {
          setResults({
            results: searchData.results || [],
            totalCount: searchData.totalCount || 0,
            queryTime: searchData.queryTime || 0,
            relatedSearches: searchData.relatedSearches || [],
            infobox: searchData.infobox,
          });

          // Cache results
          setCacheEntry(cacheKey, {
            results: searchData.results || [],
            totalCount: searchData.totalCount || 0,
            queryTime: searchData.queryTime || 0,
          });

          // Save to history
          fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query,
              mode: activeMode,
              results_count: searchData.results?.length || 0,
            }),
          }).catch(() => {});

          // Trigger AI answer for non-image modes
          if (searchData.results?.length > 0) {
            fetchAIAnswer(query, searchData.results.slice(0, 5), activeMode);
          }
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults({
          results: [],
          totalCount: 0,
          queryTime: 0,
          relatedSearches: [],
        });
      } finally {
        setIsSearching(false);
      }
    },
    [mode, cache, setResults, setImageResults, setIsSearching, setCacheEntry]
  );

  const fetchAIAnswer = async (
    query: string,
    searchResults: { title: string; snippet: string; url: string }[],
    searchMode: SearchMode
  ) => {
    setIsAILoading(true);
    setAIAnswer('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          searchResults: searchResults.map((r) => ({
            title: r.title,
            snippet: r.snippet,
            url: r.url,
          })),
          mode: searchMode,
        }),
      });

      if (!res.ok) throw new Error('AI request failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                fullText += text;
                setAIAnswer(fullText);
              } catch { /* skip parse errors */ }
            }
          }
        }
      }
    } catch (error) {
      console.error('AI answer error:', error);
    } finally {
      setIsAILoading(false);
    }
  };

  return { performSearch };
}
