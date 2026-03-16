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
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
