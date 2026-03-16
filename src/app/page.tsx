'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/layout/ParticleBackground';
import SearchBar from '@/components/search/SearchBar';
import ModeSelector from '@/components/search/ModeSelector';
import TrendingTopics from '@/components/sidebar/TrendingTopics';
import VoiceSearch from '@/components/search/VoiceSearch';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <ParticleBackground />
      <VoiceSearch />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Orb Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <div
            className="w-20 h-20 rounded-full orb flex items-center justify-center"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(99, 179, 237, 0.4), rgba(49, 130, 206, 0.2), rgba(10, 14, 26, 0.8))',
            }}
          >
            <span
              className="text-3xl font-extrabold text-accent-blue"
              style={{
                fontFamily: 'var(--font-outfit)',
                letterSpacing: '-2px',
              }}
            >
              N
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl sm:text-6xl font-extrabold mb-2"
          style={{
            fontFamily: 'var(--font-outfit)',
            letterSpacing: '-2px',
          }}
        >
          <span className="text-accent-blue">N</span>
          <span className="text-text-primary">exus</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-text-muted text-lg mb-10"
        >
          AI-Powered Intelligence Engine
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full mb-6"
        >
          <Suspense>
            <SearchBar />
          </Suspense>
        </motion.div>

        {/* Mode Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Suspense>
            <ModeSelector />
          </Suspense>
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full"
        >
          <TrendingTopics />
        </motion.div>
      </div>
    </main>
  );
}
