'use client';

import { useState } from 'react';
import { FileText, Link2, Bookmark, Share2, ExternalLink, ChevronRight } from 'lucide-react';
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
    if (summary) { setShowSummary(!showSummary); return; }
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
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try { const text = JSON.parse(line.slice(2)); fullText += text; } catch { /* skip */ }
            }
          }
        }
      }
      setSummary(result.id, fullText || 'Unable to generate summary.');
    } catch { setSummary(result.id, 'Failed to summarize this page.'); }
    finally { setLoadingSummary(result.id, false); }
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-5 group"
    >
      {/* Source & URL row */}
      <div className="flex items-center gap-2.5 mb-2.5">
        {result.favicon ? (
          <img src={result.favicon} alt="" className="w-4 h-4 rounded-sm" />
        ) : (
          <div className="w-4 h-4 rounded-sm" style={{ background: `${sourceColor}20` }}>
            <div className="w-full h-full rounded-sm flex items-center justify-center text-[8px] font-bold" style={{ color: sourceColor }}>
              {result.source[0]?.toUpperCase()}
            </div>
          </div>
        )}
        <Badge color={sourceColor}>{result.source}</Badge>
        <span className="text-[11px] text-text-muted/60 truncate font-mono" style={{ fontFamily: 'var(--font-jetbrains)' }}>
          {result.url}
        </span>
        {result.timeAgo && (
          <span className="text-[11px] text-text-muted/40 ml-auto shrink-0 tabular-nums">
            {result.timeAgo}
          </span>
        )}
      </div>

      {/* Title */}
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent-blue hover:text-accent-cyan text-[15px] font-semibold leading-snug inline-flex items-center gap-1 group/link transition-all duration-200"
      >
        <span className="group-hover/link:underline decoration-accent-blue/30 underline-offset-2">
          {result.title}
        </span>
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-60 transition-all -translate-x-1 group-hover/link:translate-x-0" />
      </a>

      {/* Snippet */}
      <p className="text-[13px] text-text-secondary/80 mt-2 leading-[1.7] font-light">
        {result.snippet}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-0.5 mt-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <ActionButton onClick={handleSummarize} icon={FileText} label="Summarize" hoverColor="accent-blue" />
        <ActionButton icon={Link2} label="Related" hoverColor="accent-purple" />
        <ActionButton icon={Bookmark} label="Save" hoverColor="accent-orange" />
        <ActionButton onClick={handleShare} icon={Share2} label="Share" hoverColor="accent-green" />
      </div>

      {/* AI Summary expandable */}
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <div className="p-4 rounded-xl border border-accent-blue/10 gradient-bg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-accent-blue/10 flex items-center justify-center">
                <FileText className="w-3 h-3 text-accent-blue" />
              </div>
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">AI Summary</span>
            </div>
            {isSummarizing ? (
              <div className="flex items-center gap-2.5 text-xs text-text-muted py-1">
                <div className="w-3.5 h-3.5 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
                Analyzing page content...
              </div>
            ) : (
              <p className="text-[13px] text-text-secondary/90 leading-[1.7] font-light">
                {summary}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  hoverColor,
}: {
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hoverColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-text-muted rounded-lg transition-all duration-200 click-scale hover:text-${hoverColor} hover:bg-${hoverColor}/8`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}
