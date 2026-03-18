'use client';

import { ExternalLink, BookOpen } from 'lucide-react';
import { useSearchStore } from '@/store/searchStore';

export default function KnowledgePanel() {
  const { infobox } = useSearchStore();

  if (!infobox) return null;

  return (
    <div className="glass-card overflow-hidden">
      {infobox.imageUrl && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={infobox.imageUrl}
            alt={infobox.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-accent-cyan" />
          </div>
          <h3 className="text-sm font-semibold text-text-primary">{infobox.title}</h3>
        </div>

        <p className="text-xs text-text-secondary/80 leading-[1.7] font-light mb-4">
          {infobox.description.length > 300
            ? infobox.description.slice(0, 300) + '...'
            : infobox.description}
        </p>

        {infobox.attributes && Object.keys(infobox.attributes).length > 0 && (
          <div className="space-y-2 mb-4 p-3 rounded-xl bg-white/2 border border-border-subtle">
            {Object.entries(infobox.attributes).slice(0, 6).map(([key, value]) => (
              <div key={key} className="flex text-[11px]">
                <span className="text-text-muted w-24 shrink-0 font-medium">{key}</span>
                <span className="text-text-secondary font-light">{value}</span>
              </div>
            ))}
          </div>
        )}

        {infobox.url && (
          <a
            href={infobox.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:text-accent-cyan transition-colors font-medium"
          >
            Learn more <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
