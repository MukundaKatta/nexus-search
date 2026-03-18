'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Mic, X, ArrowRight, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import SearchSuggestions from './SearchSuggestions';
import { SuggestionItem } from '@/types';

interface SearchBarProps {
  compact?: boolean;
}

export default function SearchBar({ compact = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { query, setQuery, mode, isListening, setIsListening } = useSearchStore();
  const [localQuery, setLocalQuery] = useState(query || searchParams?.get('q') || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (query && query !== localQuery) {
      setLocalQuery(query);
    }
  }, [query]);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch { setSuggestions([]); }
  }, []);

  const handleChange = (value: string) => {
    setLocalQuery(value);
    setSelectedIndex(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSubmit = (searchQuery?: string) => {
    const q = (searchQuery || localQuery).trim();
    if (!q) return;
    setQuery(q);
    setShowSuggestions(false);
    router.push(`/search?q=${encodeURIComponent(q)}&mode=${mode}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex].text);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const startVoiceSearch = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLocalQuery(transcript);
      setIsListening(false);
      handleSubmit(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-full">
      {/* Outer glow container */}
      <div
        className={`relative transition-all duration-500 ${
          compact ? '' : isFocused ? 'search-glow-active' : 'search-glow'
        }`}
        style={{ borderRadius: compact ? '16px' : '24px' }}
      >
        <div
          className={`relative flex items-center gap-3 glass-heavy transition-all duration-300 ${
            compact
              ? 'px-4 py-2.5 rounded-2xl'
              : 'px-6 py-4.5 rounded-3xl'
          } ${isFocused ? 'border-border-active' : ''}`}
        >
          {/* Animated search icon */}
          <motion.div
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Search className={`text-accent-blue shrink-0 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything..."
            className={`flex-1 bg-transparent outline-none text-text-primary placeholder-text-muted/50 ${
              compact ? 'text-sm' : 'text-lg font-light tracking-wide'
            }`}
            style={{ fontFamily: 'var(--font-outfit)' }}
          />

          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => { setLocalQuery(''); inputRef.current?.focus(); }}
              className="text-text-muted hover:text-text-secondary transition-colors p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}

          {/* Voice search */}
          <button
            onClick={startVoiceSearch}
            className="relative text-text-muted/60 hover:text-accent-blue transition-all p-1.5 rounded-lg hover:bg-accent-blue/5"
          >
            <Mic className={`${compact ? 'w-4 h-4' : 'w-[18px] h-[18px]'}`} />
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-accent-blue/30 voice-pulse" />
            )}
          </button>

          {/* Keyboard shortcut hint */}
          {!compact && !localQuery && (
            <div className="hidden sm:flex items-center gap-0.5 text-text-muted/30 text-[11px]">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          )}

          {!compact && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSubmit()}
              className="bg-gradient-to-r from-accent-blue to-accent-blue-dark text-white p-2.5 rounded-2xl transition-all shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/30"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-3 z-50"
          >
            <SearchSuggestions
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              onSelect={(text) => handleSubmit(text)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
