'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { generateId } from '@/lib/utils';
import AIModelBadge from './AIModelBadge';

export default function AIChat() {
  const {
    showAIChat,
    setShowAIChat,
    aiMessages,
    addAIMessage,
    query,
    aiAnswer,
    results,
    mode,
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

    // Build context-aware messages
    const contextMessages = [
      {
        role: 'user' as const,
        content: `Context: User searched for "${query}". AI summary: ${aiAnswer?.slice(0, 500)}. Top results: ${results
          .slice(0, 3)
          .map((r) => r.title)
          .join(', ')}`,
      },
      {
        role: 'assistant' as const,
        content:
          'I have the context of your search. How can I help further?',
      },
      ...aiMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user' as const, content: text },
    ];

    setIsStreaming(true);
    const assistantId = generateId();
    addAIMessage({ id: assistantId, role: 'assistant', content: '' });

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          mode,
          messages: contextMessages,
        }),
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
                const text = JSON.parse(line.slice(2));
                fullText += text;
                // Update last message
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
    } catch (err) {
      useSearchStore.setState((state) => {
        const msgs = [...state.aiMessages];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
          msgs[lastIdx] = {
            ...msgs[lastIdx],
            content: 'Sorry, I encountered an error. Please try again.',
          };
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
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col border-l border-border-glow"
          style={{
            background: 'rgba(10, 14, 26, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium text-text-primary">
                Follow-up Chat
              </span>
              <AIModelBadge />
            </div>
            <button
              onClick={() => setShowAIChat(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-8 h-8 text-accent-blue/30 mx-auto mb-3" />
                <p className="text-sm text-text-muted">
                  Ask a follow-up question about your search
                </p>
              </div>
            )}

            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-accent-blue" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-accent-blue text-white rounded-br-md'
                      : 'glass-subtle text-text-secondary rounded-bl-md'
                  }`}
                >
                  {msg.content || (
                    <span className="flex items-center gap-2 text-text-muted">
                      <span className="w-3 h-3 border-2 border-accent-blue/30 border-t-accent-blue rounded-full animate-spin" />
                      Thinking...
                    </span>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-accent-green" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border-subtle">
            <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a follow-up..."
                className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder-text-muted"
                disabled={isStreaming}
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className="p-1.5 rounded-lg bg-accent-blue text-bg-primary disabled:opacity-30 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
