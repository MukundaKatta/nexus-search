'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import GlassCard from '@/components/ui/GlassCard';

export default function RelatedSearches() {
  const { relatedSearches, query, mode, setQuery } = useSearchStore();
  const router = useRouter();

  // Generate related searches from the query if API doesn't provide them
  const searches = relatedSearches.length > 0
    ? relatedSearches
    : generateRelatedSearches(query);

  if (searches.length === 0) return null;

  const handleClick = (search: string) => {
    setQuery(search);
    router.push(`/search?q=${encodeURIComponent(search)}&mode=${mode}`);
  };

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
        Related Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {searches.slice(0, 8).map((search) => (
          <button
            key={search}
            onClick={() => handleClick(search)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-accent-blue glass-subtle hover:border-accent-blue/20 transition-all"
          >
            <Search className="w-3 h-3" />
            {search}
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

function generateRelatedSearches(query: string): string[] {
  if (!query) return [];
  const words = query.split(' ').filter(Boolean);
  const suggestions = [
    `${query} tutorial`,
    `${query} examples`,
    `${query} vs alternatives`,
    `best ${query}`,
    `${query} guide`,
    `how does ${query} work`,
  ];
  return suggestions.slice(0, 6);
}
