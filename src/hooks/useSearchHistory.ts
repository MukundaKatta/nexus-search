'use client';

import { useEffect, useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { SearchHistoryItem } from '@/types';

export function useSearchHistory() {
  const { history, setHistory } = useSearchStore();

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory((data.history || []) as SearchHistoryItem[]);
    } catch {
      // silently fail
    }
  }, [setHistory]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, refreshHistory: fetchHistory };
}
