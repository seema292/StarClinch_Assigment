import { BookedDateRange, Booking, DateAvailabilityStatus } from '../types';

/**
 * ============================================================================
 * AVAILABILITY DATA MODEL & COLLISION ENGINE
 * ============================================================================
 *
 * 1. Pre-existing Artist Commitments (`BookedDateRange[]`):
 *    Each artist stores an array of inclusive date intervals `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD', label?: string }`.
 *    A single-day gig is represented with `start === end`, while multi-day destination weddings or tours
 *    span across `start <= date <= end`.
 *
 * 2. Live Session Bookings (`Booking[]`):
 *    Whenever a user submits a booking in the app, its status starts as `'Pending'` (or `'Confirmed'`).
 *    Any booking for `artistId` whose status is NOT `'Cancelled'` immediately locks `booking.eventDate`
 *    as `'booked-user'`, preventing double-booking across the entire application without a page reload.
 *    If a user edits a pending booking's date, we exclude that booking's own ID (`excludeBookingId`)
 *    when re-validating availability.
 */

/**
 * Formats a Date object to local `YYYY-MM-DD` string without UTC timezone drift.
 */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a `YYYY-MM-DD` string into a local Date object at midnight (00:00:00).
 */
export function parseDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

/**
 * Checks if a given `YYYY-MM-DD` string falls within an inclusive `BookedDateRange`.
 * Since ISO `YYYY-MM-DD` strings are lexicographically ordered, string comparison is exact and O(1).
 */
export function isDateInBookedRange(dateStr: string, range: BookedDateRange): boolean {
  return dateStr >= range.start && dateStr <= range.end;
}

/**
 * Finds the matching pre-existing artist `BookedDateRange` for a specific date, if any.
 */
export function findArtistBookedRange(
  dateStr: string,
  bookedRanges: BookedDateRange[]
): BookedDateRange | undefined {
  return bookedRanges.find((range) => isDateInBookedRange(dateStr, range));
}

/**
 * Finds an active user booking (`Pending` or `Confirmed`) that locks the target date for the given artist.
 */
export function findActiveUserBookingForDate(
  artistId: string,
  dateStr: string,
  bookings: Booking[],
  excludeBookingId?: string
): Booking | undefined {
  return bookings.find(
    (b) =>
      b.artistId === artistId &&
      b.status !== 'Cancelled' &&
      b.id !== excludeBookingId &&
      b.eventDate === dateStr
  );
}

/**
 * Computes the complete availability status for a given date (`YYYY-MM-DD`).
 *
 * Priority order:
 * 1. `'past'`          — Date is strictly before `todayStr`
 * 2. `'booked-user'`   — Locked by an active ('Pending' or 'Confirmed') booking in the user's session
 * 3. `'booked-artist'` — Falls inside one of the artist's pre-existing `bookedDateRanges`
 * 4. `'available'`     — Open for booking
 */
export function getDateAvailabilityStatus(
  dateStr: string,
  artistId: string,
  bookedRanges: BookedDateRange[],
  userBookings: Booking[],
  todayStr: string = toDateKey(new Date()),
  excludeBookingId?: string
): {
  status: DateAvailabilityStatus;
  reason?: string;
} {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { status: 'past', reason: 'Invalid date format' };
  }

  if (dateStr < todayStr) {
    return { status: 'past', reason: 'Past date is unavailable' };
  }

  const userBooking = findActiveUserBookingForDate(
    artistId,
    dateStr,
    userBookings,
    excludeBookingId
  );
  if (userBooking) {
    return {
      status: 'booked-user',
      reason: `Booked by you (${userBooking.status} — ${userBooking.eventType})`,
    };
  }

  const artistRange = findArtistBookedRange(dateStr, bookedRanges);
  if (artistRange) {
    return {
      status: 'booked-artist',
      reason: artistRange.label || 'Artist unavailable (Pre-booked event)',
    };
  }

  return { status: 'available' };
}

/**
 * Boolean convenience helper: returns `true` only if the date is `'available'`.
 */
export function isDateAvailable(
  dateStr: string,
  artistId: string,
  bookedRanges: BookedDateRange[],
  userBookings: Booking[],
  todayStr: string = toDateKey(new Date()),
  excludeBookingId?: string
): boolean {
  return (
    getDateAvailabilityStatus(
      dateStr,
      artistId,
      bookedRanges,
      userBookings,
      todayStr,
      excludeBookingId
    ).status === 'available'
  );
}

export interface CalendarDayCell {
  dateStr: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  status: DateAvailabilityStatus;
  reason?: string;
}

/**
 * Builds a 42-cell (6 weeks x 7 days, Sunday–Saturday) month grid for the interactive calendar.
 */
export function buildMonthCalendarGrid(
  year: number,
  monthIndex: number, // 0 = Jan, 11 = Dec
  artistId: string,
  bookedRanges: BookedDateRange[],
  userBookings: Booking[],
  todayStr: string = toDateKey(new Date()),
  excludeBookingId?: string
): CalendarDayCell[] {
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const gridStartDate = new Date(year, monthIndex, 1 - startDayOfWeek);

  const cells: CalendarDayCell[] = [];

  for (let i = 0; i < 42; i++) {
    const cellDate = new Date(
      gridStartDate.getFullYear(),
      gridStartDate.getMonth(),
      gridStartDate.getDate() + i
    );
    const dateStr = toDateKey(cellDate);
    const dayOfWeek = cellDate.getDay();
    const { status, reason } = getDateAvailabilityStatus(
      dateStr,
      artistId,
      bookedRanges,
      userBookings,
      todayStr,
      excludeBookingId
    );

    cells.push({
      dateStr,
      dayOfMonth: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === monthIndex,
      isToday: dateStr === todayStr,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6,
      status,
      reason,
    });
  }

  return cells;
}

/**
 * Finds the next available date for an artist starting from `fromDateStr` (up to 90 days ahead).
 */
export function findNextAvailableDate(
  artistId: string,
  bookedRanges: BookedDateRange[],
  userBookings: Booking[],
  fromDate: Date = new Date()
): string {
  for (let offset = 1; offset <= 90; offset++) {
    const candidate = new Date(
      fromDate.getFullYear(),
      fromDate.getMonth(),
      fromDate.getDate() + offset
    );
    const candidateStr = toDateKey(candidate);
    if (
      isDateAvailable(
        candidateStr,
        artistId,
        bookedRanges,
        userBookings,
        toDateKey(fromDate)
      )
    ) {
      return candidateStr;
    }
  }
  return toDateKey(new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + 7));
}
