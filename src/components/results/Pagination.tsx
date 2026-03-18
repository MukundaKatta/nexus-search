'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';

export default function Pagination() {
  const { page, setPage, totalCount, results } = useSearchStore();
  const totalPages = Math.ceil(totalCount / 10);

  if (totalPages <= 1 || results.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-2.5 rounded-xl glass-card text-text-muted hover:text-text-primary disabled:opacity-20 transition-all click-scale"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`relative w-10 h-10 rounded-xl text-sm font-medium transition-all click-scale ${
              page === pageNum
                ? 'text-white'
                : 'glass-card text-text-muted hover:text-text-primary'
            }`}
          >
            {page === pageNum && (
              <motion.div
                layoutId="page-indicator"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-blue to-accent-blue-dark shadow-lg shadow-accent-blue/20"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{pageNum}</span>
          </button>
        );
      })}

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className="p-2.5 rounded-xl glass-card text-text-muted hover:text-text-primary disabled:opacity-20 transition-all click-scale"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
