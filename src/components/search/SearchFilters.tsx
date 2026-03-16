'use client';

import { useState } from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function SearchFilters() {
  const [showFilters, setShowFilters] = useState(false);
  const [timeRange, setTimeRange] = useState('any');
  const [region, setRegion] = useState('any');

  const timeOptions = [
    { value: 'any', label: 'Any time' },
    { value: 'day', label: 'Past 24 hours' },
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-muted hover:text-text-secondary rounded-lg hover:bg-white/5 transition-colors"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Filters</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 glass p-4 min-w-[240px] z-40 space-y-3">
          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Time Range</label>
            <div className="flex flex-wrap gap-1.5">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimeRange(opt.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    timeRange === opt.value
                      ? 'bg-accent-blue/15 text-accent-blue'
                      : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted mb-1.5 block">Region</label>
            <div className="flex flex-wrap gap-1.5">
              {regionOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setRegion(opt.value)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    region === opt.value
                      ? 'bg-accent-blue/15 text-accent-blue'
                      : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
