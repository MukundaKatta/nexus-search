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
          className="h-4 rounded-lg skeleton"
          style={{
            width: i === lines - 1 && lines > 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats bar skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-3 w-48 skeleton rounded" />
        <div className="h-3 w-16 skeleton rounded" />
      </div>

      {/* AI answer skeleton */}
      <div className="glass-heavy p-6 space-y-4 gradient-border">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full skeleton" />
          <div className="h-3 w-20 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded-md" />
        </div>
        <div className="space-y-3 mt-4">
          <div className="h-3.5 w-full skeleton rounded" />
          <div className="h-3.5 w-11/12 skeleton rounded" />
          <div className="h-3.5 w-4/5 skeleton rounded" />
          <div className="h-3.5 w-9/12 skeleton rounded" />
        </div>
      </div>

      {/* Result skeletons */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-sm skeleton" />
            <div className="h-3 w-20 skeleton rounded-full" />
            <div className="h-3 w-48 skeleton rounded" />
          </div>
          <div className="h-4.5 w-3/4 skeleton rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full skeleton rounded" />
            <div className="h-3 w-5/6 skeleton rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
