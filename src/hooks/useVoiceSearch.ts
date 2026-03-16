'use client';

import { useCallback } from 'react';
import { useSearchStore } from '@/store/searchStore';

export function useVoiceSearch() {
  const { isListening, setIsListening, setQuery } = useSearchStore();

  const startListening = useCallback(
    (onResult: (transcript: string) => void) => {
      if (
        !('webkitSpeechRecognition' in window) &&
        !('SpeechRecognition' in window)
      ) {
        console.warn('Speech recognition not supported');
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        onResult(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    },
    [setIsListening, setQuery]
  );

  return { isListening, startListening };
}
