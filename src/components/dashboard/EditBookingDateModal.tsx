import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Loader2,
  X,
} from 'lucide-react';
import { ARTISTS_DATA } from '../../data/artists';
import { Booking } from '../../types';
import { isDateAvailable, toDateKey } from '../../utils/availability';
import { formatFullDate, formatINR } from '../../utils/formatters';
import { calculateDynamicPrice } from '../../utils/pricing';
import { AvailabilityCalendar } from '../profile/AvailabilityCalendar';

interface EditBookingDateModalProps {
  booking: Booking | null;
  allBookings: Booking[];
  isMutating: boolean;
  onClose: () => void;
  onSaveNewDate: (bookingId: string, newDateStr: string) => Promise<void>;
}

export const EditBookingDateModal: React.FC<EditBookingDateModalProps> = ({
  booking,
  allBookings,
  isMutating,
  onClose,
  onSaveNewDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (booking) {
      setSelectedDate(booking.eventDate);
      setErrorMsg(null);
    }
  }, [booking]);

  const artist = useMemo(
    () => ARTISTS_DATA.find((a) => a.id === booking?.artistId),
    [booking]
  );

  if (!booking || !artist) return null;

  const todayStr = toDateKey(new Date());
  const isNewDateValid = isDateAvailable(
    selectedDate,
    artist.id,
    artist.bookedDateRanges,
    allBookings,
    todayStr,
    booking.id
  );

  const isUnchanged = selectedDate === booking.eventDate;

  const updatedPrice = calculateDynamicPrice({
    basePrice: artist.basePrice,
    dateStr: selectedDate,
    eventType: booking.eventType,
    audienceSize: booking.audienceSize,
    artistHomeCity: artist.city,
    eventCity: booking.eventCity,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isNewDateValid) {
      setErrorMsg('Please choose an open date from the calendar.');
      return;
    }

    try {
      await onSaveNewDate(booking.id, selectedDate);
      onClose();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Failed to update event date. Please retry.'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-booking-date-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <CalendarClock className="h-5 w-5 text-rose-500" />
            <div>
              <h2
                id="edit-booking-date-title"
                className="font-display text-base font-extrabold text-slate-900 dark:text-white"
              >
                Reschedule Pending Booking ({booking.referenceCode})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Re-validated live against {artist.name}’s availability calendar
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isMutating}
            onClick={onClose}
            aria-label="Close reschedule dialog"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto"
        >
          {/* Embedded Live Availability Calendar */}
          <AvailabilityCalendar
            artistId={artist.id}
            artistName={artist.name}
            bookedRanges={artist.bookedDateRanges}
            userBookings={allBookings}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setErrorMsg(null);
            }}
            excludeBookingId={booking.id}
            compact
          />

          {/* Comparison Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5">
              <span className="block text-[10px] font-bold uppercase text-slate-400">
                Original Event Date
              </span>
              <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                {formatFullDate(booking.eventDate)}
              </p>
              <p className="mt-1 text-slate-500">
                Original Estimate:{' '}
                <strong>{formatINR(booking.priceBreakdown.totalPrice)}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3.5">
              <span className="block text-[10px] font-bold uppercase text-rose-500">
                New Selected Date
              </span>
              <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                {formatFullDate(selectedDate)}
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Updated Estimate:{' '}
                <strong className="text-rose-500">
                  {formatINR(updatedPrice.totalPrice)}
                </strong>{' '}
                ({updatedPrice.dateMultiplier}x tier)
              </p>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              disabled={isMutating}
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isMutating || !isNewDateValid || isUnchanged}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isMutating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Date...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {isUnchanged ? 'Pick a Different Date' : 'Save New Event Date'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
