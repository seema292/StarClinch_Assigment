import React, { useState } from 'react';
import { AlertTriangle, CalendarX2, Loader2, X } from 'lucide-react';
import { Booking } from '../../types';
import { formatFullDate, formatINR } from '../../utils/formatters';

interface CancelBookingModalProps {
  booking: Booking | null;
  isMutating: boolean;
  onClose: () => void;
  onConfirmCancel: (bookingId: string, reason: string) => Promise<void>;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  booking,
  isMutating,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('Schedule change / Event postponed');

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirmCancel(booking.id, reason);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-rose-500/10 px-5 py-4">
          <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <h2
              id="cancel-booking-title"
              className="font-display text-base font-extrabold"
            >
              Confirm Booking Cancellation
            </h2>
          </div>
          <button
            type="button"
            disabled={isMutating}
            onClick={onClose}
            aria-label="Close cancellation dialog"
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to cancel your{' '}
            <strong className="text-slate-900 dark:text-white">
              {booking.status}
            </strong>{' '}
            booking with{' '}
            <strong className="text-slate-900 dark:text-white">
              {booking.artistName}
            </strong>{' '}
            ({booking.referenceCode})?
          </p>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Event Date:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatFullDate(booking.eventDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Event Type &amp; City:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {booking.eventType} • {booking.eventCity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Value:</span>
              <span className="font-bold text-rose-500">
                {formatINR(booking.priceBreakdown.totalPrice)}
              </span>
            </div>
          </div>

          <p className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3 text-xs text-amber-800 dark:text-amber-300">
            <strong>Note:</strong> Cancelling this booking will immediately release{' '}
            <strong>{booking.eventDate}</strong> back to {booking.artistName}’s
            public availability calendar.
          </p>

          <div>
            <label
              htmlFor="cancel-reason-input"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Reason for Cancellation
            </label>
            <input
              id="cancel-reason-input"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Event date postponed by venue"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isMutating}
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Keep Booking
            </button>

            <button
              type="submit"
              disabled={isMutating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/25 hover:bg-rose-500 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isMutating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <CalendarX2 className="h-4 w-4" />
                  <span>Yes, Cancel Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
