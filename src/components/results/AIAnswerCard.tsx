'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Bookmark, MessageSquare, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import GlassCard from '@/components/ui/GlassCard';
import SourceCitations from '@/components/ai/SourceCitations';
import AIModelBadge from '@/components/ai/AIModelBadge';

export default function AIAnswerCard() {
  const { aiAnswer, isAILoading, results, setShowAIChat } = useSearchStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!aiAnswer && !isAILoading) return null;

  return (
    <GlassCard className="p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-green live-dot" />
          <span className="text-xs font-medium text-accent-green">AI Answer</span>
          <AIModelBadge />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-white/5 transition-colors"
            title="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowAIChat(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-accent-blue hover:bg-accent-blue/10 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Follow-up</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`text-sm text-text-secondary leading-relaxed prose prose-invert prose-sm max-w-none ${
          isAILoading && !aiAnswer ? '' : ''
        }`}
      >
        {isAILoading && !aiAnswer ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
            <span className="text-text-muted">Analyzing results...</span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={isAILoading ? 'ai-cursor' : ''}
              dangerouslySetInnerHTML={{
                __html: formatAIContent(aiAnswer),
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Source Citations */}
      {results.length > 0 && aiAnswer && (
        <SourceCitations results={results} />
      )}
    </GlassCard>
  );
}

function formatAIContent(content: string): string {
  return content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-white/5 text-accent-blue text-xs font-mono">$1</code>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="p-3 rounded-lg bg-black/30 overflow-x-auto my-3"><code class="text-xs font-mono text-accent-green">$2</code></pre>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-text-primary mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-text-primary mt-4 mb-2">$1</h2>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-text-secondary">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-text-secondary">$1</li>')
    // Citation refs
    .replace(/\[(\d+)\]/g, '<sup class="text-accent-blue cursor-pointer hover:underline">[$1]</sup>')
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
