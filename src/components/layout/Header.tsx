'use client';

import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';
import SearchBar from '@/components/search/SearchBar';
import ModeSelector from '@/components/search/ModeSelector';

export default function Header() {
  const router = useRouter();
  const { mode } = useSearchStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle" style={{ background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 shrink-0 group"
          >
            <span
              className="text-2xl font-extrabold tracking-tighter"
              style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-2px' }}
            >
              <span className="text-accent-blue">N</span>
              <span className="text-text-primary group-hover:text-text-secondary transition-colors">exus</span>
            </span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar compact />
          </div>
        </div>

        {/* Mode tabs */}
        <div className="mt-2 -mb-1">
          <ModeSelector compact />
        </div>
      </div>
    </header>
  );
}
