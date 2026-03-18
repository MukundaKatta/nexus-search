'use client';

import { useState } from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { ImageResult } from '@/types';

export default function ImageResults() {
  const { imageResults } = useSearchStore();
  const [selected, setSelected] = useState<ImageResult | null>(null);

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3.5 space-y-3.5">
        {imageResults.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setSelected(img)}
          >
            <div className="glass-card overflow-hidden p-0 hover:border-border-active">
              <div className="overflow-hidden">
                <img
                  src={img.thumbnailUrl}
                  alt={img.title}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-text-secondary truncate font-light">{img.title}</p>
                <p className="text-[10px] text-text-muted/40 font-mono mt-0.5">{img.source}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: 'rgba(6, 10, 20, 0.9)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl max-h-[80vh] glass-heavy p-3"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.url}
                alt={selected.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
              <div className="flex items-center justify-between mt-4 px-1">
                <div>
                  <p className="text-sm text-text-primary font-medium">{selected.title}</p>
                  <p className="text-[11px] text-text-muted/50 font-mono">{selected.source}</p>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-white/5 text-text-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
