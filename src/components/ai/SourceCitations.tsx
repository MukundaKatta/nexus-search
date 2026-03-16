'use client';

import { ExternalLink } from 'lucide-react';
import { SearchResult } from '@/types';

interface SourceCitationsProps {
  results: SearchResult[];
}

export default function SourceCitations({ results }: SourceCitationsProps) {
  const citations = results.slice(0, 5);

  return (
    <div className="mt-4 pt-3 border-t border-border-subtle">
      <p className="text-xs text-text-muted mb-2">Sources</p>
      <div className="flex flex-wrap gap-2">
        {citations.map((result, index) => (
          <a
            key={result.id}
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs glass-subtle text-text-secondary hover:text-accent-blue hover:border-accent-blue/20 transition-all"
          >
            <span className="text-accent-blue font-medium">[{index + 1}]</span>
            <span className="truncate max-w-[120px]">{result.source}</span>
            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-50" />
          </a>
        ))}
      </div>
    </div>
  );
}
