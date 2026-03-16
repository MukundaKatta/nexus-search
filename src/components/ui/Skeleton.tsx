'use client';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export default function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg animate-pulse"
          style={{
            background: 'linear-gradient(90deg, rgba(99,179,237,0.05) 0%, rgba(99,179,237,0.1) 50%, rgba(99,179,237,0.05) 100%)',
            width: i === lines - 1 && lines > 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="glass p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-accent-blue/10 animate-pulse" />
            <div className="h-3 w-40 rounded bg-accent-blue/10 animate-pulse" />
          </div>
          <div className="h-5 w-3/4 rounded bg-accent-blue/10 animate-pulse" />
          <Skeleton lines={2} />
        </div>
      ))}
    </div>
  );
}
