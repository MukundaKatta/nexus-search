'use client';

import { useSearchStore } from '@/store/searchStore';
import { formatNumber } from '@/lib/utils';
import ResultItem from './ResultItem';
import ImageResults from './ImageResults';
import { ResultSkeleton } from '@/components/ui/Skeleton';
import SearchFilters from '@/components/search/SearchFilters';
import { Search } from 'lucide-react';

export default function ResultsList() {
  const { results, imageResults, totalCount, queryTime, isSearching, mode } =
    useSearchStore();

  if (isSearching) {
    return <ResultSkeleton />;
  }

  if (mode === 'images' && imageResults.length > 0) {
    return <ImageResults />;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/3 border border-border-subtle flex items-center justify-center">
          <Search className="w-7 h-7 text-text-muted/30" />
        </div>
        <p className="text-text-secondary text-lg font-light">No results found</p>
        <p className="text-text-muted/60 text-sm mt-1.5">Try a different query or search mode</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results info bar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[11px] text-text-muted/50 font-mono tabular-nums" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          About {formatNumber(totalCount)} results ({queryTime}s)
        </p>
        <SearchFilters />
      </div>

      {/* Results list */}
      <div className="space-y-3.5">
        {results.map((result, index) => (
          <ResultItem key={result.id} result={result} index={index} />
        ))}
      </div>

      {/* Load more */}
      {results.length > 0 && results.length < totalCount && (
        <div className="mt-10 text-center">
          <button className="px-8 py-3 glass-card text-sm text-accent-blue hover:text-accent-cyan font-medium transition-all click-scale">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}
