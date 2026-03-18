'use client';

import { TrendingUp, Flame, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import { motion } from 'framer-motion';

const TRENDING = [
  { topic: 'AI Agents', category: 'Technology', color: '#63b3ed' },
  { topic: 'Quantum Computing Breakthrough', category: 'Science', color: '#b794f4' },
  { topic: 'SpaceX Starship Launch', category: 'Space', color: '#f6ad55' },
  { topic: 'Rust Programming', category: 'Dev', color: '#68d391' },
  { topic: 'Climate Tech Startups', category: 'Environment', color: '#76e4f7' },
  { topic: 'Neural Interface Research', category: 'Biotech', color: '#f687b3' },
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
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg bg-accent-orange/10 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-accent-orange" />
          </div>
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
            Trending Now
          </h3>
        </div>
        <div className="space-y-0.5">
          {TRENDING.map((item, i) => (
            <button
              key={item.topic}
              onClick={() => handleClick(item.topic)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/3 transition-all group click-scale"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-text-muted/30 font-mono text-[10px] w-4 tabular-nums">{i + 1}</span>
                <span className="font-medium">{item.topic}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ color: item.color, background: `${item.color}10` }}>
                  {item.category}
                </span>
                <ArrowUpRight className="w-3 h-3 text-text-muted/0 group-hover:text-text-muted/50 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-14">
      <div className="flex items-center gap-2.5 mb-5">
        <Flame className="w-4 h-4 text-accent-orange" />
        <h2 className="text-sm font-semibold text-text-secondary tracking-wide">Trending Now</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TRENDING.map((item, i) => (
          <motion.button
            key={item.topic}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.06 }}
            onClick={() => handleClick(item.topic)}
            className="glass-card p-4 text-left group click-scale"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm text-text-primary/90 group-hover:text-accent-blue transition-colors font-medium leading-snug">
                {item.topic}
              </p>
              <ArrowUpRight className="w-3.5 h-3.5 text-text-muted/0 group-hover:text-accent-blue/50 transition-all shrink-0 mt-0.5" />
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ color: item.color, background: `${item.color}10` }}>
                {item.category}
              </span>
              <TrendingUp className="w-3 h-3" style={{ color: item.color, opacity: 0.5 }} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
