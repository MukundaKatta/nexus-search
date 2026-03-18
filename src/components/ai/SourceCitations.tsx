'use client';

import { ExternalLink } from 'lucide-react';
import { SearchResult } from '@/types';
import { getSourceColor } from '@/lib/utils';

interface SourceCitationsProps {
  results: SearchResult[];
}

export default function SourceCitations({ results }: SourceCitationsProps) {
  const citations = results.slice(0, 5);

  return (
    <div className="pt-4 border-t border-border-subtle">
      <p className="text-[10px] text-text-muted/50 mb-2.5 uppercase tracking-wider font-semibold">Sources</p>
      <div className="flex flex-wrap gap-2">
        {citations.map((result, index) => {
          const color = getSourceColor(result.source);
          return (
            <a
              key={result.id}
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] glass-subtle hover:border-border-active transition-all click-scale group"
            >
              <span className="font-semibold" style={{ color }}>[{index + 1}]</span>
              <span className="text-text-secondary/70 group-hover:text-text-secondary truncate max-w-[120px] font-light">
                {result.source}
              </span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0 text-text-muted/0 group-hover:text-text-muted/40 transition-all" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
