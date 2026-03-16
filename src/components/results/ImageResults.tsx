'use client';

import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/searchStore';
import { ImageResult } from '@/types';

export default function ImageResults() {
  const { imageResults } = useSearchStore();
  const [selected, setSelected] = useState<ImageResult | null>(null);

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {imageResults.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setSelected(img)}
          >
            <div className="glass overflow-hidden p-0">
              <img
                src={img.thumbnailUrl}
                alt={img.title}
                className="w-full h-auto rounded-t-2xl"
                loading="lazy"
              />
              <div className="p-2.5">
                <p className="text-xs text-text-secondary truncate">{img.title}</p>
                <p className="text-[10px] text-text-muted font-mono">{img.source}</p>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[80vh] glass p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.url}
                alt={selected.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
              <div className="flex items-center justify-between mt-3 px-2">
                <div>
                  <p className="text-sm text-text-primary">{selected.title}</p>
                  <p className="text-xs text-text-muted">{selected.source}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={selected.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setSelected(null)}
                    className="p-2 rounded-lg hover:bg-white/5 text-text-muted"
                  >
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
