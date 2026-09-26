import { describe, expect, it } from 'vitest';
import { BookedDateRange, Booking } from '../types';
import {
  buildMonthCalendarGrid,
  getDateAvailabilityStatus,
  isDateAvailable,
  isDateInBookedRange,
} from './availability';

const mockRanges: BookedDateRange[] = [
  { start: '2026-10-10', end: '2026-10-12', label: 'Udaipur Royal Wedding' },
  { start: '2026-10-20', end: '2026-10-20', label: 'Corporate Summit Mumbai' },
];

const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    referenceCode: 'SC-2026-1001',
    artistId: 'artist-1',
    artistName: 'Aarav Mehta',
    artistCategory: 'Singer',
    artistAvatar: '',
    artistHomeCity: 'Mumbai',
    eventDate: '2026-10-25',
    eventType: 'Wedding',
    eventCity: 'Mumbai',
    audienceSize: 300,
    contact: {
      fullName: 'Riya Sharma',
      email: 'riya@example.com',
      phone: '9876543210',
    },
    priceBreakdown: {} as Booking['priceBreakdown'],
    status: 'Confirmed',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'bk-cancelled',
    referenceCode: 'SC-2026-1002',
    artistId: 'artist-1',
    artistName: 'Aarav Mehta',
    artistCategory: 'Singer',
    artistAvatar: '',
    artistHomeCity: 'Mumbai',
    eventDate: '2026-10-28',
    eventType: 'Private Party',
    eventCity: 'Mumbai',
    audienceSize: 100,
    contact: {
      fullName: 'Kabir Verma',
      email: 'kabir@example.com',
      phone: '9876543211',
    },
    priceBreakdown: {} as Booking['priceBreakdown'],
    status: 'Cancelled',
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z',
  },
];

describe('Availability & Double-Booking Engine (availability.ts)', () => {
  const referenceToday = '2026-10-05';

  it('checks inclusive date range boundaries accurately', () => {
    const range: BookedDateRange = { start: '2026-10-10', end: '2026-10-12' };
    expect(isDateInBookedRange('2026-10-09', range)).toBe(false);
    expect(isDateInBookedRange('2026-10-10', range)).toBe(true);
    expect(isDateInBookedRange('2026-10-11', range)).toBe(true);
    expect(isDateInBookedRange('2026-10-12', range)).toBe(true);
    expect(isDateInBookedRange('2026-10-13', range)).toBe(false);
  });

  it('marks dates prior to today as past and unavailable', () => {
    const res = getDateAvailabilityStatus(
      '2026-10-04',
      'artist-1',
      mockRanges,
      mockBookings,
      referenceToday
    );
    expect(res.status).toBe('past');
    expect(
      isDateAvailable('2026-10-04', 'artist-1', mockRanges, mockBookings, referenceToday)
    ).toBe(false);
  });

  it('marks dates within artist pre-existing bookedDateRanges as booked-artist', () => {
    const res = getDateAvailabilityStatus(
      '2026-10-11',
      'artist-1',
      mockRanges,
      mockBookings,
      referenceToday
    );
    expect(res.status).toBe('booked-artist');
    expect(res.reason).toContain('Udaipur Royal Wedding');
  });

  it('prevents double-booking when an active user booking exists for that artist and date', () => {
    const res = getDateAvailabilityStatus(
      '2026-10-25',
      'artist-1',
      mockRanges,
      mockBookings,
      referenceToday
    );
    expect(res.status).toBe('booked-user');
    expect(
      isDateAvailable('2026-10-25', 'artist-1', mockRanges, mockBookings, referenceToday)
    ).toBe(false);
  });

  it('allows re-selecting the same date when editing that specific booking (excludeBookingId)', () => {
    expect(
      isDateAvailable(
        '2026-10-25',
        'artist-1',
        mockRanges,
        mockBookings,
        referenceToday,
        'bk-1'
      )
    ).toBe(true);
  });

  it('releases the date back to available once a booking is Cancelled', () => {
    const res = getDateAvailabilityStatus(
      '2026-10-28',
      'artist-1',
      mockRanges,
      mockBookings,
      referenceToday
    );
    expect(res.status).toBe('available');
  });

  it('generates a 42-cell calendar grid with accurate status flags', () => {
    const grid = buildMonthCalendarGrid(
      2026,
      9, // October (0-indexed = 9)
      'artist-1',
      mockRanges,
      mockBookings,
      referenceToday
    );
    expect(grid).toHaveLength(42);
    const oct25 = grid.find((c) => c.dateStr === '2026-10-25');
    expect(oct25?.status).toBe('booked-user');
    const oct15 = grid.find((c) => c.dateStr === '2026-10-15');
    expect(oct15?.status).toBe('available');
  });
});
