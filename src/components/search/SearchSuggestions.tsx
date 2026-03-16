'use client';

import { Clock, Search } from 'lucide-react';
import { SuggestionItem } from '@/types';

interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelect: (text: string) => void;
}

export default function SearchSuggestions({
  suggestions,
  selectedIndex,
  onSelect,
}: SearchSuggestionsProps) {
  return (
    <div className="glass overflow-hidden">
      {suggestions.map((item, index) => (
        <button
          key={`${item.text}-${index}`}
          onClick={() => onSelect(item.text)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
            index === selectedIndex
              ? 'bg-accent-blue/10 text-text-primary'
              : 'text-text-secondary hover:bg-white/5'
          }`}
        >
          {item.type === 'history' ? (
            <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
          ) : (
            <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
          )}
          <span className="truncate">{item.text}</span>
        </button>
      ))}
    </div>
  );
}
