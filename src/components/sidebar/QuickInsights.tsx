'use client';

import { BarChart3 } from 'lucide-react';
import AnimatedBar from '@/components/ui/AnimatedBar';
import { useSearchStore } from '@/store/searchStore';
import { useMemo } from 'react';

const HIGH_AUTHORITY_DOMAINS = new Set([
  'wikipedia.org', 'github.com', 'stackoverflow.com', 'arxiv.org',
  'nature.com', 'science.org', 'nytimes.com', 'bbc.com', 'reuters.com',
  'gov', 'edu', 'mit.edu', 'stanford.edu', 'harvard.edu',
]);

const POSITIVE_KEYWORDS = ['best', 'great', 'excellent', 'top', 'recommended', 'success', 'innovative', 'breakthrough'];
const NEGATIVE_KEYWORDS = ['worst', 'bad', 'fail', 'problem', 'issue', 'broken', 'warning', 'risk'];

export default function QuickInsights() {
  const { results } = useSearchStore();

  const insights = useMemo(() => {
    if (results.length === 0) return null;

    const authoritative = results.filter((r) =>
      Array.from(HIGH_AUTHORITY_DOMAINS).some((d) => r.source.includes(d))
    );
    const credibility = Math.round((authoritative.length / results.length) * 100);

    const recent = results.filter((r) => {
      if (!r.publishedDate) return false;
      const diff = Date.now() - new Date(r.publishedDate).getTime();
      return diff < 30 * 24 * 60 * 60 * 1000;
    });
    const freshness = results.some((r) => r.publishedDate)
      ? Math.round((recent.length / results.filter((r) => r.publishedDate).length) * 100)
      : 50;

    const allText = results.map((r) => r.snippet.toLowerCase()).join(' ');
    const posCount = POSITIVE_KEYWORDS.filter((w) => allText.includes(w)).length;
    const negCount = NEGATIVE_KEYWORDS.filter((w) => allText.includes(w)).length;
    const total = posCount + negCount || 1;
    const sentiment = Math.round(((posCount + 1) / (total + 2)) * 100);

    return { credibility, freshness, sentiment };
  }, [results]);

  if (!insights) return null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-accent-purple/10 flex items-center justify-center">
          <BarChart3 className="w-3.5 h-3.5 text-accent-purple" />
        </div>
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Quick Insights
        </h3>
      </div>
      <div className="space-y-4">
        <AnimatedBar label="Sentiment" value={insights.sentiment} color="#68d391" />
        <AnimatedBar label="Freshness" value={insights.freshness} color="#63b3ed" />
        <AnimatedBar label="Credibility" value={insights.credibility} color="#f6ad55" />
      </div>
    </div>
  );
}
