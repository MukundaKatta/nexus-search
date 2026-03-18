'use client';

import { useSearchStore } from '@/store/searchStore';
import { SearchMode, ModeOption } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const MODES: ModeOption[] = [
  { id: 'search', label: 'Search', icon: '🔍', description: 'Web results' },
  { id: 'ai', label: 'AI Answer', icon: '✨', description: 'Smart summary' },
  { id: 'creative', label: 'Creative', icon: '🎨', description: 'Generate ideas' },
  { id: 'code', label: 'Code', icon: '💻', description: 'Programming help' },
  { id: 'images', label: 'Images', icon: '🖼️', description: 'Visual search' },
  { id: 'scholar', label: 'Scholar', icon: '📚', description: 'Academic papers' },
];

interface ModeSelectorProps {
  compact?: boolean;
}

export default function ModeSelector({ compact = false }: ModeSelectorProps) {
  const { mode, setMode, query } = useSearchStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    const q = query || searchParams?.get('q');
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}&mode=${newMode}`);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs rounded-xl whitespace-nowrap transition-all duration-300 click-scale ${
              mode === m.id
                ? 'text-accent-blue font-medium'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {mode === m.id && (
              <motion.div
                layoutId="mode-indicator-compact"
                className="absolute inset-0 bg-accent-blue/8 border border-accent-blue/20 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{m.icon}</span>
            <span className="relative z-10">{m.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {MODES.map((m, i) => (
        <motion.button
          key={m.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.05 }}
          onClick={() => handleModeChange(m.id)}
          className={`relative flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm transition-all duration-300 click-scale ${
            mode === m.id
              ? 'text-accent-blue font-medium'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {mode === m.id && (
            <motion.div
              layoutId="mode-indicator"
              className="absolute inset-0 glass-card border-accent-blue/25 rounded-2xl"
              style={{ boxShadow: '0 0 25px rgba(99, 179, 237, 0.06)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 text-lg">{m.icon}</span>
          <div className="relative z-10 text-left">
            <div className="leading-tight">{m.label}</div>
            <div className={`text-[10px] hidden sm:block ${
              mode === m.id ? 'text-accent-blue/50' : 'text-text-muted/60'
            }`}>{m.description}</div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
