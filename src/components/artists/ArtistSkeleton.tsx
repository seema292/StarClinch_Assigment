import React from 'react';
import { ViewMode } from '../../types';

interface ArtistSkeletonProps {
  count?: number;
  viewMode: ViewMode;
}

export const ArtistSkeleton: React.FC<ArtistSkeletonProps> = ({
  count = 9,
  viewMode,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'list') {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading artists">
        {items.map((item) => (
          <div
            key={item}
            className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 gap-5 animate-pulse"
          >
            <div className="h-48 sm:h-40 sm:w-60 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="flex gap-2 pt-2">
                <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="pt-4 flex justify-between items-center">
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading artists"
    >
      {items.map((item) => (
        <div
          key={item}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse"
        >
          <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
