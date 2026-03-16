'use client';

import { FileText, Link2, Bookmark, Share2 } from 'lucide-react';

interface ResultActionsProps {
  onSummarize: () => void;
  onShare: () => void;
}

export default function ResultActions({ onSummarize, onShare }: ResultActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onSummarize}
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
        onClick={onShare}
        className="flex items-center gap-1 px-2.5 py-1 text-xs text-text-muted hover:text-accent-green hover:bg-accent-green/10 rounded-lg transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>
    </div>
  );
}
