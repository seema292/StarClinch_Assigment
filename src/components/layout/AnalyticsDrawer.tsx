import React, { useEffect, useState } from 'react';
import { Activity, ChevronDown, Trash2 } from 'lucide-react';
import { AnalyticsEvent } from '../../types';
import {
  clearAnalyticsHistory,
  getAnalyticsHistory,
  subscribeAnalytics,
} from '../../utils/analytics';

export const AnalyticsDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<AnalyticsEvent[]>(() =>
    getAnalyticsHistory()
  );

  useEffect(() => {
    return subscribeAnalytics((updated) => {
      setEvents([...updated]);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-lg backdrop-blur-md hover:border-rose-500 transition-all cursor-pointer"
          title="View live user action telemetry (also logged to DevTools Console)"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          <Activity className="h-3.5 w-3.5 text-rose-500" />
          <span>Analytics Log ({events.length})</span>
        </button>
      ) : (
        <div
          role="region"
          aria-label="Live Analytics Telemetry Inspector"
          className="w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Analytics Event Stream ({events.length})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearAnalyticsHistory}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-rose-500 transition-colors cursor-pointer"
                title="Clear analytics log"
                aria-label="Clear analytics log"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Minimize analytics log"
                aria-label="Minimize analytics log"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70 p-2 text-[11px]">
            {events.length === 0 ? (
              <p className="py-6 text-center text-slate-400">
                Interact with search, filters, calendar, or bookings to see live telemetry events.
              </p>
            ) : (
              events.map((ev) => (
                <div key={ev.id} className="py-2 px-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                      {ev.action}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="overflow-x-auto rounded bg-slate-100 dark:bg-slate-950 p-1.5 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                    {JSON.stringify(ev.payload)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
