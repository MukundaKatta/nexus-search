'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('any');
  const [region, setRegion] = useState('any');

  const timeOptions = [
    { value: 'any', label: 'Any time' },
    { value: 'day', label: 'Past 24h' },
    { value: 'week', label: 'Past week' },
    { value: 'month', label: 'Past month' },
    { value: 'year', label: 'Past year' },
  ];

  const regionOptions = [
    { value: 'any', label: 'All regions' },
    { value: 'us', label: 'United States' },
    { value: 'gb', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-xl transition-all click-scale ${
          showFilters
            ? 'text-accent-blue bg-accent-blue/8 border border-accent-blue/20'
            : 'text-text-muted/50 hover:text-text-secondary border border-transparent hover:bg-white/3'
        }`}
      >
        <SlidersHorizontal className="w-3 h-3" />
        <span className="font-medium">Filters</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-2 glass-heavy p-5 min-w-[260px] z-40 space-y-4"
          >
            <div>
              <label className="text-[10px] text-text-muted/50 mb-2 block uppercase tracking-wider font-semibold">Time Range</label>
              <div className="flex flex-wrap gap-1.5">
                {timeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeRange(opt.value)}
                    className={`px-2.5 py-1.5 text-[11px] rounded-lg transition-all click-scale ${
                      timeRange === opt.value
                        ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-medium'
                        : 'text-text-secondary/60 hover:bg-white/3 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-text-muted/50 mb-2 block uppercase tracking-wider font-semibold">Region</label>
              <div className="flex flex-wrap gap-1.5">
                {regionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRegion(opt.value)}
                    className={`px-2.5 py-1.5 text-[11px] rounded-lg transition-all click-scale ${
                      region === opt.value
                        ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-medium'
                        : 'text-text-secondary/60 hover:bg-white/3 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
