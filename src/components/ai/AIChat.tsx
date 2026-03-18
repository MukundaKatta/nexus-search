'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { generateId } from '@/lib/utils';
import AIModelBadge from './AIModelBadge';

export default function AIChat() {
  const {
    showAIChat, setShowAIChat, aiMessages, addAIMessage,
    query, aiAnswer, results, mode,
  } = useSearchStore();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    setInput('');
    addAIMessage({ id: generateId(), role: 'user', content: text });

    const contextMessages = [
      { role: 'user' as const, content: `Context: User searched for "${query}". AI summary: ${aiAnswer?.slice(0, 500)}. Top results: ${results.slice(0, 3).map((r) => r.title).join(', ')}` },
      { role: 'assistant' as const, content: 'I have the context of your search. How can I help further?' },
      ...aiMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    setIsStreaming(true);
    addAIMessage({ id: generateId(), role: 'assistant', content: '' });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, mode, messages: contextMessages }),
      });
      if (!res.ok) throw new Error('AI request failed');

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
              try {
                const parsed = JSON.parse(line.slice(2));
                fullText += parsed;
                useSearchStore.setState((state) => {
                  const msgs = [...state.aiMessages];
                  const lastIdx = msgs.length - 1;
                  if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
                    msgs[lastIdx] = { ...msgs[lastIdx], content: fullText };
                  }
                  return { aiMessages: msgs };
                });
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch {
      useSearchStore.setState((state) => {
        const msgs = [...state.aiMessages];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
          msgs[lastIdx] = { ...msgs[lastIdx], content: 'Sorry, I encountered an error. Please try again.' };
        }
        return { aiMessages: msgs };
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <AnimatePresence>
      {showAIChat && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setShowAIChat(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col"
            style={{
              background: 'rgba(6, 10, 20, 0.95)',
              backdropFilter: 'blur(32px) saturate(180%)',
              borderLeft: '1px solid rgba(99, 179, 237, 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/10 flex items-center justify-center border border-accent-blue/15">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-text-primary block">Follow-up Chat</span>
                  <AIModelBadge />
                </div>
              </div>
              <button
                onClick={() => setShowAIChat(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {aiMessages.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-accent-blue/30" />
                  </div>
                  <p className="text-sm text-text-secondary font-light">Ask a follow-up question</p>
                  <p className="text-[11px] text-text-muted/40 mt-1">Context from your search is included</p>
                </div>
              )}

              {aiMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl bg-accent-blue/10 border border-accent-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-accent-blue" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-[1.7] font-light ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-accent-blue to-accent-blue-dark text-white rounded-br-lg shadow-lg shadow-accent-blue/10'
                        : 'glass-subtle text-text-secondary rounded-bl-lg'
                    }`}
                  >
                    {msg.content || (
                      <span className="flex items-center gap-2 text-text-muted">
                        <span className="w-3.5 h-3.5 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
                        Thinking...
                      </span>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-accent-green/10 border border-accent-green/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-accent-green" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border-subtle">
              <div className="flex items-center gap-2 glass-heavy rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a follow-up..."
                  className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder-text-muted/40 font-light"
                  disabled={isStreaming}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-accent-blue to-accent-blue-dark text-white disabled:opacity-20 transition-opacity shadow-lg shadow-accent-blue/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
