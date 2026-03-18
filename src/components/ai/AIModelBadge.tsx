'use client';

import { Sparkles } from 'lucide-react';

export default function AIModelBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md font-medium"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 179, 237, 0.08), rgba(183, 148, 244, 0.06))',
        color: 'rgba(99, 179, 237, 0.7)',
        border: '1px solid rgba(99, 179, 237, 0.1)',
      }}
    >
      <Sparkles className="w-2.5 h-2.5" />
      Nexus AI
    </span>
  );
}
