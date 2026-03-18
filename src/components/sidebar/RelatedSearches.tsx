'use client';

import { Search, Compass, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';

export default function RelatedSearches() {
  const { relatedSearches, query, mode, setQuery } = useSearchStore();
  const router = useRouter();

  const searches = relatedSearches.length > 0
    ? relatedSearches
    : generateRelatedSearches(query);

  if (searches.length === 0) return null;

  const handleClick = (search: string) => {
    setQuery(search);
    router.push(`/search?q=${encodeURIComponent(search)}&mode=${mode}`);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-accent-blue/10 flex items-center justify-center">
          <Compass className="w-3.5 h-3.5 text-accent-blue" />
        </div>
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Related Searches
        </h3>
      </div>
      <div className="space-y-1">
        {searches.slice(0, 8).map((search) => (
          <button
            key={search}
            onClick={() => handleClick(search)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-accent-blue rounded-lg hover:bg-accent-blue/5 transition-all group click-scale"
          >
            <Search className="w-3 h-3 text-text-muted/40 group-hover:text-accent-blue/50" />
            <span className="flex-1 text-left font-light">{search}</span>
            <ArrowRight className="w-3 h-3 text-text-muted/0 group-hover:text-accent-blue/40 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}

function generateRelatedSearches(query: string): string[] {
  if (!query) return [];
  return [
    `${query} tutorial`,
    `${query} examples`,
    `${query} vs alternatives`,
    `best ${query}`,
    `${query} guide`,
    `how does ${query} work`,
  ].slice(0, 6);
}
