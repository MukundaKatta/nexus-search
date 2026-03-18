'use client';

import { Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';

export default function VoiceSearch() {
  const { isListening } = useSearchStore();

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(6, 10, 20, 0.85)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle, rgba(99, 179, 237, 0.15), rgba(99, 179, 237, 0.05))',
                  border: '1px solid rgba(99, 179, 237, 0.2)',
                }}
              >
                <Mic className="w-10 h-10 text-accent-blue" />
              </motion.div>
              <span className="absolute inset-0 rounded-full bg-accent-blue/15 voice-pulse" />
              <span className="absolute inset-0 rounded-full bg-accent-blue/10 voice-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="absolute inset-0 rounded-full bg-accent-purple/5 voice-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <div className="text-center">
              <p className="text-text-secondary text-lg font-light">Listening...</p>
              <p className="text-text-muted/40 text-xs mt-1">Speak your search query</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
