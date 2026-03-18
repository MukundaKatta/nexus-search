'use client';

import { motion } from 'framer-motion';

interface AnimatedBarProps {
  value: number; // 0-100
  color: string;
  label: string;
  className?: string;
}

export default function AnimatedBar({
  value,
  color,
  label,
  className = '',
}: AnimatedBarProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between text-[11px]">
        <span className="text-text-secondary/70 font-light">{label}</span>
        <span className="font-mono tabular-nums font-medium" style={{ color, fontFamily: 'var(--font-jetbrains)' }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            boxShadow: `0 0 8px ${color}30`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
