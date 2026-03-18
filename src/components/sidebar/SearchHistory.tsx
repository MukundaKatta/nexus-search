'use client';

import { Clock, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';

export default function SearchHistory() {
  const { history, setQuery, mode } = useSearchStore();
  const router = useRouter();

  const recentHistory = history.slice(0, 5);
  if (recentHistory.length === 0) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-accent-green/10 flex items-center justify-center">
          <History className="w-3.5 h-3.5 text-accent-green" />
        </div>
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Recent Searches
        </h3>
      </div>
      <div className="space-y-0.5">
        {recentHistory.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setQuery(item.query);
              router.push(`/search?q=${encodeURIComponent(item.query)}&mode=${item.mode || mode}`);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/3 rounded-lg transition-all text-left click-scale"
          >
            <Clock className="w-3 h-3 text-text-muted/30 shrink-0" />
            <span className="truncate font-light">{item.query}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
