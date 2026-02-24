import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-white/10 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableSkeleton({ rows = 4 }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
      <Skeleton className="h-6 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}
