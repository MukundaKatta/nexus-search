'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  gradient = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`${gradient ? 'glass-card' : 'glass-heavy'} ${className}`}
      whileHover={hover ? {
        y: -2,
        borderColor: 'rgba(99, 179, 237, 0.3)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 179, 237, 0.06)',
      } : undefined}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
