'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';

export default function Pagination() {
  const { page, setPage, totalCount, results } = useSearchStore();
  const totalPages = Math.ceil(totalCount / 10);

  if (totalPages <= 1 || results.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2 rounded-lg glass text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              page === pageNum
                ? 'bg-accent-blue text-bg-primary'
                : 'glass text-text-muted hover:text-text-primary'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2 rounded-lg glass text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
