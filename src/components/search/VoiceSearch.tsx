'use client';

import { Mic } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';

export default function VoiceSearch() {
  const { isListening } = useSearchStore();

  if (!isListening) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-accent-blue/20 flex items-center justify-center">
            <Mic className="w-10 h-10 text-accent-blue" />
          </div>
          <span className="absolute inset-0 rounded-full bg-accent-blue/20 voice-pulse" />
          <span
            className="absolute inset-0 rounded-full bg-accent-blue/10 voice-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </div>
        <p className="text-text-secondary text-lg">Listening...</p>
      </div>
    </div>
  );
}
