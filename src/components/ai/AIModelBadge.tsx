'use client';

import { Sparkles } from 'lucide-react';

export default function AIModelBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-accent-blue/70 bg-accent-blue/5 rounded-md border border-accent-blue/10">
      <Sparkles className="w-2.5 h-2.5" />
      Nexus AI
    </span>
  );
}
