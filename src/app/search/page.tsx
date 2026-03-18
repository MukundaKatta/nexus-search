'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { useSearch } from '@/hooks/useSearch';
import { SearchMode } from '@/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIAnswerCard from '@/components/results/AIAnswerCard';
import ResultsList from '@/components/results/ResultsList';
import Pagination from '@/components/results/Pagination';
import QuickInsights from '@/components/sidebar/QuickInsights';
import RelatedSearches from '@/components/sidebar/RelatedSearches';
import KnowledgePanel from '@/components/sidebar/KnowledgePanel';
import SearchHistory from '@/components/sidebar/SearchHistory';
import TrendingTopics from '@/components/sidebar/TrendingTopics';
import AIChat from '@/components/ai/AIChat';
import VoiceSearch from '@/components/search/VoiceSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';

function SearchContent() {
  const searchParams = useSearchParams();
  const { setQuery, setMode } = useSearchStore();
  const { performSearch } = useSearch();

  useSearchHistory();

  const queryParam = searchParams?.get('q') || '';
  const modeParam = (searchParams?.get('mode') as SearchMode) || 'search';

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      setMode(modeParam);
      performSearch(queryParam, modeParam);
    }
  }, [queryParam, modeParam]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <VoiceSearch />
      <Suspense>
        <Header />
      </Suspense>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <AIAnswerCard />
            <ResultsList />
            <Pagination />
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            className="w-full lg:w-80 shrink-0 space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <KnowledgePanel />
            <QuickInsights />
            <RelatedSearches />
            <SearchHistory />
            <TrendingTopics showAsList />
          </motion.aside>
        </div>
      </main>

      <Footer />
      <AIChat />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
