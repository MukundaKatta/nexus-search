'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${className}`}
      whileHover={hover ? { scale: 1.02, borderColor: 'rgba(99, 179, 237, 0.4)' } : undefined}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
