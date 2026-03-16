'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Mic, X, ArrowRight } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync from store
  useEffect(() => {
    if (query && query !== localQuery) {
      setLocalQuery(query);
    }
  }, [query]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    }
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
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

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

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center gap-3 glass transition-all duration-300 ${
          compact ? 'px-4 py-2.5 rounded-xl' : 'px-6 py-4 rounded-2xl'
        }`}
        style={{
          boxShadow: showSuggestions
            ? '0 0 30px rgba(99, 179, 237, 0.15)'
            : '0 0 15px rgba(99, 179, 237, 0.05)',
        }}
      >
        <Search
          className={`text-accent-blue shrink-0 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`}
        />

        <input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search anything..."
          className={`flex-1 bg-transparent outline-none text-text-primary placeholder-text-muted ${
            compact ? 'text-sm' : 'text-lg'
          }`}
          style={{ fontFamily: 'var(--font-outfit)' }}
        />

        {localQuery && (
          <button
            onClick={() => {
              setLocalQuery('');
              inputRef.current?.focus();
            }}
            className="text-text-muted hover:text-text-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice search */}
        <button
          onClick={startVoiceSearch}
          className="relative text-text-muted hover:text-accent-blue transition-colors"
        >
          <Mic className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-accent-blue/30 voice-pulse" />
          )}
        </button>

        {!compact && (
          <button
            onClick={() => handleSubmit()}
            className="bg-accent-blue hover:bg-accent-blue-dark text-bg-primary p-2 rounded-xl transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
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
