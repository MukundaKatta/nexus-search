'use client';

import { Clock, Search, ArrowUpRight } from 'lucide-react';
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
    <div className="glass-heavy overflow-hidden py-1.5">
      {suggestions.map((item, index) => (
        <button
          key={`${item.text}-${index}`}
          onClick={() => onSelect(item.text)}
          className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm transition-all duration-150 group ${
            index === selectedIndex
              ? 'bg-accent-blue/8 text-text-primary'
              : 'text-text-secondary hover:bg-white/3 hover:text-text-primary'
          }`}
        >
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
            index === selectedIndex ? 'bg-accent-blue/15' : 'bg-white/3'
          }`}>
            {item.type === 'history' ? (
              <Clock className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <Search className="w-3.5 h-3.5 text-text-muted" />
            )}
          </div>
          <span className="truncate flex-1 font-light">{item.text}</span>
          <ArrowUpRight className={`w-3.5 h-3.5 text-text-muted/0 group-hover:text-text-muted/60 transition-all ${
            index === selectedIndex ? '!text-accent-blue/60' : ''
          }`} />
        </button>
      ))}
    </div>
  );
}
