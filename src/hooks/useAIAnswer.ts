'use client';

import { useSearchStore } from '@/store/searchStore';

export function useAIAnswer() {
  const { aiAnswer, isAILoading, setShowAIChat } = useSearchStore();

  return {
    aiAnswer,
    isAILoading,
    openChat: () => setShowAIChat(true),
  };
}
