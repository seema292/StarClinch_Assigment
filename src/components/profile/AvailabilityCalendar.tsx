import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Info,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BookedDateRange, Booking } from '../../types';
import {
  buildMonthCalendarGrid,
  CalendarDayCell,
  parseDateKey,
  toDateKey,
} from '../../utils/availability';
import { formatDisplayDate, formatFullDate } from '../../utils/formatters';
import { getDateTierInfo } from '../../utils/pricing';

interface AvailabilityCalendarProps {
  artistId: string;
  artistName: string;
  bookedRanges: BookedDateRange[];
  userBookings: Booking[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  excludeBookingId?: string;
  compact?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  artistId,
  artistName,
  bookedRanges,
  userBookings,
  selectedDate,
  onSelectDate,
  excludeBookingId,
  compact = false,
}) => {
  const initialDate = useMemo(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      return parseDateKey(selectedDate);
    }
    return new Date();
  }, [selectedDate]);

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());
  const [hoveredCell, setHoveredCell] = useState<CalendarDayCell | null>(null);
  const [showDataModelInfo, setShowDataModelInfo] = useState<boolean>(false);

  const todayStr = toDateKey(new Date());

  const gridCells = useMemo(
    () =>
      buildMonthCalendarGrid(
        viewYear,
        viewMonth,
        artistId,
        bookedRanges,
        userBookings,
        todayStr,
        excludeBookingId
      ),
    [viewYear, viewMonth, artistId, bookedRanges, userBookings, todayStr, excludeBookingId]
  );

  const monthTitle = new Date(viewYear, viewMonth, 1).toLocaleDateString(
    'en-IN',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Count stats for current displayed month
  const monthStats = useMemo(() => {
    const inMonth = gridCells.filter((c) => c.isCurrentMonth);
    return {
      available: inMonth.filter((c) => c.status === 'available').length,
      bookedArtist: inMonth.filter((c) => c.status === 'booked-artist').length,
      bookedUser: inMonth.filter((c) => c.status === 'booked-user').length,
    };
  }, [gridCells]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let targetIndex: number | null = null;
    if (e.key === 'ArrowRight') targetIndex = Math.min(41, index + 1);
    if (e.key === 'ArrowLeft') targetIndex = Math.max(0, index - 1);
    if (e.key === 'ArrowDown') targetIndex = Math.min(41, index + 7);
    if (e.key === 'ArrowUp') targetIndex = Math.max(0, index - 7);

    if (targetIndex !== null) {
      e.preventDefault();
      const btn = document.querySelector<HTMLButtonElement>(
        `[data-cal-idx="${artistId}-${targetIndex}"]`
      );
      btn?.focus();
    }
  };

  const activeUserLocks = userBookings.filter(
    (b) =>
      b.artistId === artistId &&
      b.status !== 'Cancelled' &&
      b.id !== excludeBookingId
  );

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-rose-500" />
            <span>Live Availability Calendar</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select an open date to unlock pricing &amp; booking for {artistName}
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-rose-500/50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span
            className="min-w-[135px] text-center font-display text-sm font-bold text-slate-900 dark:text-white"
            aria-live="polite"
          >
            {monthTitle}
          </span>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:border-rose-500/50 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Month Summary Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/90 px-3.5 py-2 text-xs border border-slate-200/60 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {monthStats.available} Open Dates
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            {monthStats.bookedArtist} Pre-Booked
          </span>
          {monthStats.bookedUser > 0 && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-purple-600 dark:text-purple-400">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              {monthStats.bookedUser} Booked by You
            </span>
          )}
        </div>

        {!compact && (
          <button
            type="button"
            onClick={() => setShowDataModelInfo((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            {showDataModelInfo ? 'Hide Data Model' : 'View Calendar Data Model'}
          </button>
        )}
      </div>

      {/* Weekday Headers */}
      <div
        role="row"
        className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400"
      >
        {WEEKDAYS.map((day) => (
          <div key={day} role="columnheader" className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 42-Cell Calendar Grid */}
      <div
        role="grid"
        aria-label={`Availability calendar for ${monthTitle}`}
        className="grid grid-cols-7 gap-1.5"
      >
        {gridCells.map((cell, idx) => {
          const isSelected = cell.dateStr === selectedDate;
          const isInteractive = cell.status === 'available';
          const tierInfo = getDateTierInfo(cell.dateStr);

          let cellStyle = '';
          if (!cell.isCurrentMonth) {
            cellStyle = 'opacity-30 ';
          }

          if (isSelected) {
            cellStyle +=
              'bg-gradient-to-br from-rose-600 to-pink-600 text-white font-extrabold ring-2 ring-rose-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg shadow-rose-600/30 scale-[1.03]';
          } else if (cell.status === 'available') {
            cellStyle +=
              'bg-emerald-500/10 dark:bg-emerald-500/10 text-slate-900 dark:text-slate-100 border border-emerald-500/25 hover:border-rose-500 hover:bg-rose-500/15 cursor-pointer';
          } else if (cell.status === 'booked-user') {
            cellStyle +=
              'bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 cursor-not-allowed';
          } else if (cell.status === 'booked-artist') {
            cellStyle +=
              'bg-rose-500/10 dark:bg-rose-950/40 text-rose-400 dark:text-rose-400/70 border border-rose-500/20 line-through cursor-not-allowed';
          } else {
            // Past date
            cellStyle +=
              'bg-slate-100/70 dark:bg-slate-950/50 text-slate-400 dark:text-slate-600 border border-transparent cursor-not-allowed';
          }

          return (
            <button
              key={cell.dateStr}
              type="button"
              role="gridcell"
              data-cal-idx={`${artistId}-${idx}`}
              aria-selected={isSelected}
              aria-disabled={!isInteractive}
              aria-label={`${formatFullDate(cell.dateStr)} — ${
                cell.status === 'available'
                  ? `Available (${tierInfo.label})`
                  : cell.reason || 'Unavailable'
              }`}
              onClick={() => {
                if (isInteractive) {
                  onSelectDate(cell.dateStr);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onMouseEnter={() => setHoveredCell(cell)}
              onMouseLeave={() => setHoveredCell(null)}
              onFocus={() => setHoveredCell(cell)}
              className={`relative flex flex-col items-center justify-center rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${cellStyle}`}
            >
              <span>{cell.dayOfMonth}</span>

              {/* Status Indicator Dot / Icon */}
              <div className="mt-1 flex items-center gap-0.5 h-2">
                {cell.status === 'booked-user' && (
                  <Lock
                    className="h-2.5 w-2.5 text-purple-500"
                    aria-hidden="true"
                  />
                )}
                {cell.status === 'booked-artist' && (
                  <CalendarX2
                    className="h-2.5 w-2.5 text-rose-500/80"
                    aria-hidden="true"
                  />
                )}
                {cell.status === 'available' && cell.isWeekend && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isSelected ? 'bg-amber-200' : 'bg-amber-400'
                    }`}
                    title="Weekend peak demand date"
                  />
                )}
              </div>

              {cell.isToday && (
                <span className="absolute top-1 right-1.5 text-[8px] font-extrabold uppercase text-rose-500">
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Hover / Selected Date Status Bar */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
        {hoveredCell ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {formatDisplayDate(hoveredCell.dateStr)}:
            </span>
            {hoveredCell.status === 'available' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Available • {getDateTierInfo(hoveredCell.dateStr).label}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                {hoveredCell.reason}
              </span>
            )}
          </div>
        ) : selectedDate ? (
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-rose-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              Selected Date: {formatFullDate(selectedDate)}
            </span>
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Available
            </span>
          </div>
        ) : (
          <span className="text-slate-500 dark:text-slate-400">
            Click or use arrow keys to pick an emerald available date above.
          </span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Weekend Peak
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-2.5 w-2.5 text-purple-500" /> Your Booking
          </span>
        </div>
      </div>

      {/* Collapsible Data Model Documentation Panel */}
      {showDataModelInfo && !compact && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950 p-4 text-xs space-y-2.5">
          <p className="font-bold text-slate-900 dark:text-white">
            Availability Data Model (`BookedDateRange[]` + Session Locks)
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Each artist stores an array of inclusive ISO date intervals{' '}
            <code className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 font-mono text-rose-500">
              {'{ start: "YYYY-MM-DD", end: "YYYY-MM-DD", label?: string }'}
            </code>
            . Active session bookings (<code className="font-mono">Pending</code> or{' '}
            <code className="font-mono">Confirmed</code>) dynamically lock their{' '}
            <code className="font-mono">eventDate</code> in real time to prevent double-booking.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">
                Pre-Existing Commitments ({bookedRanges.length})
              </span>
              <ul className="space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                {bookedRanges.map((r, i) => (
                  <li key={i}>
                    {r.start} → {r.end}{' '}
                    <span className="text-slate-400">({r.label})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-white dark:bg-slate-900 p-2.5 border border-slate-200 dark:border-slate-800">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-500 mb-1">
                Your Active Session Locks ({activeUserLocks.length})
              </span>
              {activeUserLocks.length === 0 ? (
                <p className="text-[11px] text-slate-400">
                  No dates locked by you for this artist yet.
                </p>
              ) : (
                <ul className="space-y-1 font-mono text-[11px] text-purple-600 dark:text-purple-300">
                  {activeUserLocks.map((b) => (
                    <li key={b.id}>
                      {b.eventDate} — {b.status} ({b.referenceCode})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
