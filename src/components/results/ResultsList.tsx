'use client';

import { useSearchStore } from '@/store/searchStore';
import { formatNumber } from '@/lib/utils';
import ResultItem from './ResultItem';
import ImageResults from './ImageResults';
import { ResultSkeleton } from '@/components/ui/Skeleton';
import SearchFilters from '@/components/search/SearchFilters';

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
      <div className="text-center py-12">
        <p className="text-text-muted text-lg">No results found</p>
        <p className="text-text-muted text-sm mt-1">Try a different query or search mode</p>
      </div>
    );
  }

  return (
    <div>
      {/* Results info bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-text-muted">
          About {formatNumber(totalCount)} results ({queryTime} seconds)
        </p>
        <SearchFilters />
      </div>

      {/* Results list */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <ResultItem key={result.id} result={result} index={index} />
        ))}
      </div>

      {/* Load more */}
      {results.length > 0 && results.length < totalCount && (
        <div className="mt-8 text-center">
          <button className="px-6 py-2.5 glass text-sm text-accent-blue hover:bg-accent-blue/10 transition-colors rounded-xl">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}
