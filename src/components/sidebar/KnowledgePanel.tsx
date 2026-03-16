'use client';

import { ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { useSearchStore } from '@/store/searchStore';

export default function KnowledgePanel() {
  const { infobox } = useSearchStore();

  if (!infobox) return null;

  return (
    <GlassCard className="p-4 overflow-hidden">
      {infobox.imageUrl && (
        <img
          src={infobox.imageUrl}
          alt={infobox.title}
          className="w-full h-40 object-cover rounded-xl mb-3 -mt-1 -mx-0"
        />
      )}

      <h3 className="text-sm font-semibold text-text-primary mb-1">
        {infobox.title}
      </h3>

      <p className="text-xs text-text-secondary leading-relaxed mb-3">
        {infobox.description.length > 300
          ? infobox.description.slice(0, 300) + '...'
          : infobox.description}
      </p>

      {infobox.attributes && Object.keys(infobox.attributes).length > 0 && (
        <div className="space-y-1.5 mb-3">
          {Object.entries(infobox.attributes)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="flex text-xs">
                <span className="text-text-muted w-24 shrink-0">{key}</span>
                <span className="text-text-secondary">{value}</span>
              </div>
            ))}
        </div>
      )}

      {infobox.url && (
        <a
          href={infobox.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent-blue hover:underline"
        >
          Learn more <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </GlassCard>
  );
}
