'use client';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({
  children,
  color = '#63b3ed',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider ${className}`}
      style={{
        color,
        backgroundColor: `${color}0a`,
        border: `1px solid ${color}20`,
      }}
    >
      {children}
    </span>
  );
}
