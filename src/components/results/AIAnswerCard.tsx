'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Bookmark, MessageSquare, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-6 relative overflow-hidden"
    >
      {/* Gradient border effect */}
      <div className="gradient-border glass-heavy p-0">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="w-2 h-2 rounded-full bg-accent-green block live-dot" />
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                <span className="text-xs font-semibold text-text-primary tracking-wide uppercase">AI Answer</span>
              </div>
            </div>
            <AIModelBadge />
          </div>

          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              title="Copy"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              title="Regenerate"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-2 rounded-xl text-text-muted hover:text-text-secondary hover:bg-white/5 transition-all"
              title="Bookmark"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowAIChat(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 ml-1 rounded-xl text-xs font-medium text-accent-blue hover:bg-accent-blue/8 border border-accent-blue/15 hover:border-accent-blue/30 transition-all click-scale"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Follow-up</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {isAILoading && !aiAnswer ? (
            <div className="flex items-center gap-3 py-4">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
                <div className="absolute inset-0 w-6 h-6 border-2 border-accent-purple/10 border-b-accent-purple/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <div>
                <span className="text-sm text-text-secondary">Analyzing results and generating answer...</span>
                <div className="w-48 h-1 mt-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="w-12 h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple progress-bar" />
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-text-secondary leading-[1.8] tracking-wide"
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
          <div className="px-6 pb-5">
            <SourceCitations results={results} />
          </div>
        )}

        {/* Bottom shimmer while loading */}
        {isAILoading && aiAnswer && (
          <div className="h-0.5 w-full ai-shimmer" />
        )}
      </div>
    </motion.div>
  );
}

function formatAIContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded-md bg-accent-blue/5 text-accent-cyan text-xs font-mono border border-accent-blue/10">$1</code>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="p-4 rounded-xl bg-black/40 border border-border-subtle overflow-x-auto my-4"><code class="text-xs font-mono text-accent-green leading-relaxed">$2</code></pre>')
    .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-text-primary mt-5 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-text-primary mt-5 mb-2">$1</h2>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc text-text-secondary leading-relaxed">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal text-text-secondary leading-relaxed">$1</li>')
    .replace(/\[(\d+)\]/g, '<sup class="text-accent-blue cursor-pointer hover:text-accent-cyan transition-colors font-medium text-[10px] ml-0.5">[$1]</sup>')
    .replace(/\n\n/g, '<div class="h-3"></div>')
    .replace(/\n/g, '<br/>');
}
