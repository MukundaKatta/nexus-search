'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SearchBar from '@/components/search/SearchBar';
import ModeSelector from '@/components/search/ModeSelector';

export default function Header() {
  const router = useRouter();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 border-b border-border-subtle"
      style={{
        background: 'rgba(6, 10, 20, 0.8)',
        backdropFilter: 'blur(32px) saturate(180%)',
        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-5">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 shrink-0 group click-scale"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mr-0.5"
              style={{
                background: 'linear-gradient(135deg, rgba(99, 179, 237, 0.15), rgba(183, 148, 244, 0.1))',
                border: '1px solid rgba(99, 179, 237, 0.15)',
              }}
            >
              <span className="text-sm font-black gradient-text-blue">N</span>
            </div>
            <span
              className="text-xl font-extrabold tracking-tighter hidden sm:inline"
              style={{ fontFamily: 'var(--font-outfit)', letterSpacing: '-1.5px' }}
            >
              <span className="gradient-text-blue">N</span>
              <span className="text-text-primary/80 group-hover:text-text-primary transition-colors">exus</span>
            </span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar compact />
          </div>
        </div>

        {/* Mode tabs */}
        <div className="mt-2.5 -mb-0.5">
          <ModeSelector compact />
        </div>
      </div>
    </motion.header>
  );
}
