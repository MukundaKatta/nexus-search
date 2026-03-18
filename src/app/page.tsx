'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/layout/ParticleBackground';
import SearchBar from '@/components/search/SearchBar';
import ModeSelector from '@/components/search/ModeSelector';
import TrendingTopics from '@/components/sidebar/TrendingTopics';
import VoiceSearch from '@/components/search/VoiceSearch';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Sparkles, label: 'AI-Powered', desc: 'Claude intelligence' },
  { icon: Zap, label: 'Real-time', desc: 'Streaming answers' },
  { icon: Shield, label: 'Private', desc: 'No tracking' },
  { icon: Globe, label: 'Web-wide', desc: 'Brave Search' },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <ParticleBackground />
      <VoiceSearch />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Orb Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full orb flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, rgba(118, 228, 247, 0.3), rgba(99, 179, 237, 0.25) 30%, rgba(183, 148, 244, 0.15) 60%, rgba(6, 10, 20, 0.9))',
              }}
            >
              <span
                className="text-4xl font-black gradient-text-blue select-none"
                style={{
                  fontFamily: 'var(--font-outfit)',
                  letterSpacing: '-3px',
                }}
              >
                N
              </span>
            </div>
            {/* Outer glow ring */}
            <div
              className="absolute -inset-4 rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(99, 179, 237, 0.15), transparent 70%)',
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-4"
        >
          <h1
            className="text-6xl sm:text-7xl font-black tracking-tighter"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            <span className="gradient-text-blue">N</span>
            <span className="text-text-primary">exus</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-text-muted text-base sm:text-lg mb-3 font-light tracking-wide"
        >
          AI-Powered Intelligence Engine
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-3 mb-10"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-text-muted border border-border-subtle bg-bg-secondary/40"
            >
              <f.icon className="w-3 h-3 text-accent-blue" />
              <span className="text-text-secondary font-medium">{f.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-8"
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-full"
        >
          <TrendingTopics />
        </motion.div>

        {/* Bottom fade text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-[11px] text-text-muted/40 mt-16 text-center"
        >
          Powered by Claude AI &middot; Brave Search &middot; Built with Next.js
        </motion.p>
      </div>
    </main>
  );
}
