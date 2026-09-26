import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ARTISTS_DATA } from '../data/artists';
import { Booking, BookingContact, CityName, EventType } from '../types';
import { logAnalyticsEvent } from '../utils/analytics';
import {
  findNextAvailableDate,
  getDateAvailabilityStatus,
  toDateKey,
} from '../utils/availability';
import { calculateDynamicPrice } from '../utils/pricing';
import { delay } from '../services/api';

export interface CreateBookingInput {
  artistId: string;
  eventDate: string;
  eventType: EventType;
  eventCity: CityName;
  audienceSize: number;
  venueNotes?: string;
  contact: BookingContact;
}

interface BookingStoreState {
  bookings: Booking[];
  isMutating: boolean;
  createBooking: (
    input: CreateBookingInput,
    options?: { simulateNetworkError?: boolean }
  ) => Promise<Booking>;
  updateBookingDate: (
    bookingId: string,
    newEventDate: string,
    options?: { simulateNetworkError?: boolean }
  ) => Promise<Booking>;
  cancelBooking: (
    bookingId: string,
    reason?: string
  ) => Promise<void>;
  confirmBookingStatus: (bookingId: string) => Promise<Booking>;
  resetDemoBookings: () => void;
}

/**
 * Generates 2 initial realistic bookings so the "My Bookings" dashboard is immediately
 * demonstrable out-of-the-box, while locking their respective dates on the calendar.
 */
function buildInitialSeedBookings(): Booking[] {
  const artist1 = ARTISTS_DATA[0]; // Aarav Mehta
  const artist3 = ARTISTS_DATA[2]; // The Velvet Raag Collective

  const now = new Date();
  const futureBase1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14);
  const futureBase2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 24);

  const date1 = findNextAvailableDate(
    artist1.id,
    artist1.bookedDateRanges,
    [],
    futureBase1
  );
  const date2 = findNextAvailableDate(
    artist3.id,
    artist3.bookedDateRanges,
    [],
    futureBase2
  );

  const price1 = calculateDynamicPrice({
    basePrice: artist1.basePrice,
    dateStr: date1,
    eventType: 'Wedding',
    audienceSize: 450,
    artistHomeCity: artist1.city,
    eventCity: 'Mumbai',
  });

  const price2 = calculateDynamicPrice({
    basePrice: artist3.basePrice,
    dateStr: date2,
    eventType: 'Corporate Gala',
    audienceSize: 600,
    artistHomeCity: artist3.city,
    eventCity: 'Delhi NCR',
  });

  return [
    {
      id: 'seed-booking-1',
      referenceCode: 'SC-2026-8421',
      artistId: artist1.id,
      artistName: artist1.name,
      artistCategory: artist1.category,
      artistAvatar: artist1.avatar,
      artistHomeCity: artist1.city,
      eventDate: date1,
      eventType: 'Wedding',
      eventCity: 'Mumbai',
      audienceSize: 450,
      venueNotes: 'Taj Lands End Seaside Lawn — Sangeet Ceremony at 8:00 PM',
      contact: {
        fullName: 'Vikramaditya Singhania',
        email: 'vikram.singhania@luxuryevents.in',
        phone: '+91 98201 44512',
        organization: 'Singhania Family Wedding',
      },
      priceBreakdown: price1,
      status: 'Pending',
      createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    },
    {
      id: 'seed-booking-2',
      referenceCode: 'SC-2026-7910',
      artistId: artist3.id,
      artistName: artist3.name,
      artistCategory: artist3.category,
      artistAvatar: artist3.avatar,
      artistHomeCity: artist3.city,
      eventDate: date2,
      eventType: 'Corporate Gala',
      eventCity: 'Delhi NCR',
      audienceSize: 600,
      venueNotes: 'JW Marriott Aerocity Grand Ballroom — Annual Leadership Night',
      contact: {
        fullName: 'Meenakshi Sundaram',
        email: 'm.sundaram@nexustech.io',
        phone: '+91 98114 78230',
        organization: 'NexusTech Global Pvt Ltd',
      },
      priceBreakdown: price2,
      status: 'Confirmed',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
  ];
}

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      bookings: buildInitialSeedBookings(),
      isMutating: false,

      createBooking: async (input, options) => {
        set({ isMutating: true });
        logAnalyticsEvent('booking_submit_attempt', {
          artistId: input.artistId,
          eventDate: input.eventDate,
          eventType: input.eventType,
        });

        try {
          // Smooth async save to LocalStorage (400ms)
          await delay(400);

          if (options?.simulateNetworkError) {
            logAnalyticsEvent('booking_submit_error', {
              reason: 'Simulated network timeout',
              artistId: input.artistId,
            });
            throw new Error(
              'Gateway Timeout (504): Could not reach the StarClinch Booking Engine. Your details are safe — please click "Retry Booking" to complete submission.'
            );
          }

          const artist = ARTISTS_DATA.find((a) => a.id === input.artistId);
          if (!artist) {
            throw new Error('Selected artist could not be found.');
          }

          // Re-verify availability right before commit to prevent race/double-booking
          const currentBookings = get().bookings;
          const availability = getDateAvailabilityStatus(
            input.eventDate,
            artist.id,
            artist.bookedDateRanges,
            currentBookings,
            toDateKey(new Date())
          );

          if (availability.status !== 'available') {
            logAnalyticsEvent('booking_submit_error', {
              reason: 'Date double-booking prevented',
              eventDate: input.eventDate,
            });
            throw new Error(
              `Double-booking prevented: ${input.eventDate} is no longer available (${availability.reason || 'already booked'}).`
            );
          }

          const priceBreakdown = calculateDynamicPrice({
            basePrice: artist.basePrice,
            dateStr: input.eventDate,
            eventType: input.eventType,
            audienceSize: input.audienceSize,
            artistHomeCity: artist.city,
            eventCity: input.eventCity,
          });

          const randomDigits = Math.floor(1000 + Math.random() * 9000);
          const nowIso = new Date().toISOString();

          const newBooking: Booking = {
            id: `bk-${Date.now()}`,
            referenceCode: `SC-2026-${randomDigits}`,
            artistId: artist.id,
            artistName: artist.name,
            artistCategory: artist.category,
            artistAvatar: artist.avatar,
            artistHomeCity: artist.city,
            eventDate: input.eventDate,
            eventType: input.eventType,
            eventCity: input.eventCity,
            audienceSize: input.audienceSize,
            venueNotes: input.venueNotes?.trim() || undefined,
            contact: {
              fullName: input.contact.fullName.trim(),
              email: input.contact.email.trim(),
              phone: input.contact.phone.trim(),
              organization: input.contact.organization?.trim() || undefined,
            },
            priceBreakdown,
            status: 'Pending',
            createdAt: nowIso,
            updatedAt: nowIso,
          };

          set((state) => ({
            bookings: [newBooking, ...state.bookings],
            isMutating: false,
          }));

          logAnalyticsEvent('booking_submit_success', {
            referenceCode: newBooking.referenceCode,
            artistName: artist.name,
            eventDate: newBooking.eventDate,
            totalPrice: newBooking.priceBreakdown.totalPrice,
          });

          return newBooking;
        } catch (err) {
          set({ isMutating: false });
          throw err;
        }
      },

      updateBookingDate: async (bookingId, newEventDate, options) => {
        set({ isMutating: true });
        try {
          await delay(700);

          if (options?.simulateNetworkError) {
            throw new Error(
              'Network interruption while rescheduling booking. Please retry.'
            );
          }

          const state = get();
          const target = state.bookings.find((b) => b.id === bookingId);
          if (!target) {
            throw new Error('Booking record not found.');
          }

          if (target.status !== 'Pending') {
            throw new Error('Only Pending bookings can have their event date edited.');
          }

          const artist = ARTISTS_DATA.find((a) => a.id === target.artistId);
          if (!artist) {
            throw new Error('Associated artist not found.');
          }

          const availability = getDateAvailabilityStatus(
            newEventDate,
            artist.id,
            artist.bookedDateRanges,
            state.bookings,
            toDateKey(new Date()),
            bookingId
          );

          if (availability.status !== 'available') {
            throw new Error(
              availability.reason || 'Selected new date is not available for this artist.'
            );
          }

          const updatedPrice = calculateDynamicPrice({
            basePrice: artist.basePrice,
            dateStr: newEventDate,
            eventType: target.eventType,
            audienceSize: target.audienceSize,
            artistHomeCity: artist.city,
            eventCity: target.eventCity,
          });

          const updatedBooking: Booking = {
            ...target,
            eventDate: newEventDate,
            priceBreakdown: updatedPrice,
            updatedAt: new Date().toISOString(),
          };

          set((prev) => ({
            bookings: prev.bookings.map((b) =>
              b.id === bookingId ? updatedBooking : b
            ),
            isMutating: false,
          }));

          logAnalyticsEvent('booking_date_edit', {
            bookingId,
            referenceCode: target.referenceCode,
            oldDate: target.eventDate,
            newDate: newEventDate,
            newTotalPrice: updatedPrice.totalPrice,
          });

          return updatedBooking;
        } catch (err) {
          set({ isMutating: false });
          throw err;
        }
      },

      cancelBooking: async (bookingId, reason) => {
        set({ isMutating: true });
        await delay(600);

        const target = get().bookings.find((b) => b.id === bookingId);
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  status: 'Cancelled',
                  cancellationReason: reason?.trim() || 'Cancelled by client from dashboard',
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
          isMutating: false,
        }));

        if (target) {
          logAnalyticsEvent('booking_cancel', {
            bookingId,
            referenceCode: target.referenceCode,
            releasedDate: target.eventDate,
            reason,
          });
        }
      },

      confirmBookingStatus: async (bookingId) => {
        set({ isMutating: true });
        await delay(500);

        const target = get().bookings.find((b) => b.id === bookingId);
        if (!target) {
          set({ isMutating: false });
          throw new Error('Booking not found.');
        }

        const confirmedBooking: Booking = {
          ...target,
          status: 'Confirmed',
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? confirmedBooking : b
          ),
          isMutating: false,
        }));

        logAnalyticsEvent('booking_status_confirm', {
          bookingId,
          referenceCode: target.referenceCode,
          eventDate: target.eventDate,
          confirmationEmailSentTo: target.contact.email,
        });

        return confirmedBooking;
      },

      resetDemoBookings: () => {
        set({ bookings: buildInitialSeedBookings(), isMutating: false });
      },
    }),
    {
      name: 'starclinch-bookings-v1',
      partialize: (state) => ({ bookings: state.bookings }),
    }
  )
);
