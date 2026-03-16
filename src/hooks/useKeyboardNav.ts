'use client';

import { useState, useCallback } from 'react';

export function useKeyboardNav(itemCount: number) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, itemCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Escape':
          setSelectedIndex(-1);
          break;
      }
    },
    [itemCount]
  );

  const reset = useCallback(() => setSelectedIndex(-1), []);

  return { selectedIndex, handleKeyDown, setSelectedIndex, reset };
}
