'use client';

import GlassCard from '@/components/ui/GlassCard';
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

    // Credibility: percentage from high-authority domains
    const authoritative = results.filter((r) =>
      Array.from(HIGH_AUTHORITY_DOMAINS).some((d) => r.source.includes(d))
    );
    const credibility = Math.round((authoritative.length / results.length) * 100);

    // Freshness: percentage with dates within last 30 days
    const recent = results.filter((r) => {
      if (!r.publishedDate) return false;
      const diff = Date.now() - new Date(r.publishedDate).getTime();
      return diff < 30 * 24 * 60 * 60 * 1000;
    });
    const freshness = results.some((r) => r.publishedDate)
      ? Math.round((recent.length / results.filter((r) => r.publishedDate).length) * 100)
      : 50;

    // Sentiment from snippets
    const allText = results.map((r) => r.snippet.toLowerCase()).join(' ');
    const posCount = POSITIVE_KEYWORDS.filter((w) => allText.includes(w)).length;
    const negCount = NEGATIVE_KEYWORDS.filter((w) => allText.includes(w)).length;
    const total = posCount + negCount || 1;
    const sentiment = Math.round(((posCount + 1) / (total + 2)) * 100);

    return { credibility, freshness, sentiment };
  }, [results]);

  if (!insights) return null;

  return (
    <GlassCard className="p-4">
      <h3 className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wider">
        Quick Insights
      </h3>
      <div className="space-y-3">
        <AnimatedBar
          label="Sentiment"
          value={insights.sentiment}
          color="#48bb78"
        />
        <AnimatedBar
          label="Freshness"
          value={insights.freshness}
          color="#63b3ed"
        />
        <AnimatedBar
          label="Credibility"
          value={insights.credibility}
          color="#ed8936"
        />
      </div>
    </GlassCard>
  );
}
