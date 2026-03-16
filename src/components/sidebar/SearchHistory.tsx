'use client';

import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import GlassCard from '@/components/ui/GlassCard';

export default function SearchHistory() {
  const { history, setQuery, mode } = useSearchStore();
  const router = useRouter();

  const recentHistory = history.slice(0, 5);

  if (recentHistory.length === 0) return null;

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
        Recent Searches
      </h3>
      <div className="space-y-1">
        {recentHistory.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setQuery(item.query);
              router.push(
                `/search?q=${encodeURIComponent(item.query)}&mode=${item.mode || mode}`
              );
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors text-left"
          >
            <Clock className="w-3 h-3 text-text-muted shrink-0" />
            <span className="truncate">{item.query}</span>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}
