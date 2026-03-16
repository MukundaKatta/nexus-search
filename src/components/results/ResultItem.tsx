'use client';

import { useState } from 'react';
import { FileText, Link2, Bookmark, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchResult } from '@/types';
import { getSourceColor } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { useSearchStore } from '@/store/searchStore';

interface ResultItemProps {
  result: SearchResult;
  index: number;
}

export default function ResultItem({ result, index }: ResultItemProps) {
  const { summaries, setSummary, loadingSummaries, setLoadingSummary } = useSearchStore();
  const [showSummary, setShowSummary] = useState(false);
  const sourceColor = getSourceColor(result.source);
  const summary = summaries[result.id];
  const isSummarizing = loadingSummaries[result.id];

  const handleSummarize = async () => {
    if (summary) {
      setShowSummary(!showSummary);
      return;
    }

    setLoadingSummary(result.id, true);
    setShowSummary(true);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.url, title: result.title }),
      });

      if (!res.ok) throw new Error('Summarize failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          // Parse SSE data
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2));
                fullText += text;
              } catch { /* skip parse errors */ }
            }
          }
        }
      }

      setSummary(result.id, fullText || 'Unable to generate summary.');
    } catch {
      setSummary(result.id, 'Failed to summarize this page.');
    } finally {
      setLoadingSummary(result.id, false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: result.title, url: result.url });
    } else {
      await navigator.clipboard.writeText(result.url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      className="glass p-5 hover:border-accent-blue/30 transition-all group"
    >
      {/* Source & URL */}
      <div className="flex items-center gap-2 mb-2">
        {result.favicon && (
          <img src={result.favicon} alt="" className="w-4 h-4 rounded-sm" />
        )}
        <Badge color={sourceColor}>{result.source}</Badge>
        <span
          className="text-xs text-text-muted truncate font-mono"
          style={{ fontFamily: 'var(--font-jetbrains)' }}
        >
          {result.url}
        </span>
        {result.timeAgo && (
          <span className="text-xs text-text-muted ml-auto shrink-0">
            {result.timeAgo}
          </span>
        )}
      </div>

      {/* Title */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue hover:text-accent-blue-dark text-base font-semibold leading-snug inline-flex items-center gap-1 group/link transition-colors"
      >
        {result.title}
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
      </a>

      {/* Snippet */}
      <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
        {result.snippet}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleSummarize}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-muted hover:text-accent-blue hover:bg-accent-blue/10 rounded-lg transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Summarize</span>
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-muted hover:text-accent-purple hover:bg-accent-purple/10 rounded-lg transition-colors">
          <Link2 className="w-3.5 h-3.5" />
          <span>Related</span>
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-muted hover:text-accent-orange hover:bg-accent-orange/10 rounded-lg transition-colors">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-muted hover:text-accent-green hover:bg-accent-green/10 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Summary */}
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-3 p-3 rounded-lg bg-accent-blue/5 border border-accent-blue/10"
        >
          {isSummarizing ? (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="w-3.5 h-3.5 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
              Summarizing...
            </div>
          ) : (
            <p className="text-xs text-text-secondary leading-relaxed">
              {summary}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
