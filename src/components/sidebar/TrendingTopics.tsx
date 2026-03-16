'use client';

import { TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import GlassCard from '@/components/ui/GlassCard';

const TRENDING = [
  { topic: 'AI Agents', category: 'Technology' },
  { topic: 'Quantum Computing Breakthrough', category: 'Science' },
  { topic: 'SpaceX Starship Launch', category: 'Space' },
  { topic: 'Rust Programming', category: 'Dev' },
  { topic: 'Climate Tech Startups', category: 'Environment' },
  { topic: 'Neural Interface Research', category: 'Biotech' },
];

interface TrendingTopicsProps {
  showAsList?: boolean;
}

export default function TrendingTopics({ showAsList = false }: TrendingTopicsProps) {
  const { setQuery, mode } = useSearchStore();
  const router = useRouter();

  const handleClick = (topic: string) => {
    setQuery(topic);
    router.push(`/search?q=${encodeURIComponent(topic)}&mode=${mode}`);
  };

  if (showAsList) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-accent-orange" />
          Trending Now
        </h3>
        <div className="space-y-1">
          {TRENDING.map((item) => (
            <button
              key={item.topic}
              onClick={() => handleClick(item.topic)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-lg transition-colors"
            >
              <span>{item.topic}</span>
              <span className="text-text-muted text-[10px]">{item.category}</span>
            </button>
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent-orange">🔥</span>
        <h2 className="text-sm font-semibold text-text-secondary">Trending Now</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRENDING.map((item) => (
          <button
            key={item.topic}
            onClick={() => handleClick(item.topic)}
            className="glass p-3 text-left hover:border-accent-blue/30 transition-all group"
          >
            <p className="text-sm text-text-primary group-hover:text-accent-blue transition-colors">
              {item.topic}
            </p>
            <p className="text-[10px] text-text-muted mt-1">{item.category}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
