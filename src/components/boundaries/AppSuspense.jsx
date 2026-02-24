import React, { Suspense } from 'react';
import { TableSkeleton } from '../ui/Skeleton';

export function AppSuspense({ children }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <TableSkeleton rows={5} />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default AppSuspense;
