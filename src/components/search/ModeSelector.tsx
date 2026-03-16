'use client';

import { useSearchStore } from '@/store/searchStore';
import { SearchMode, ModeOption } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';

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
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all ${
              mode === m.id
                ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
            }`}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => handleModeChange(m.id)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === m.id
              ? 'glass text-accent-blue border-accent-blue/30'
              : 'text-text-muted hover:text-text-secondary hover:bg-white/5 border border-transparent'
          }`}
          style={
            mode === m.id
              ? { boxShadow: '0 0 20px rgba(99, 179, 237, 0.1)' }
              : undefined
          }
        >
          <span className="text-lg">{m.icon}</span>
          <div className="text-left">
            <div>{m.label}</div>
            <div className="text-[10px] text-text-muted hidden sm:block">{m.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
