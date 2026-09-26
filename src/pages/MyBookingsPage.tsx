import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Calendar,
  CalendarCheck2,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { CancelBookingModal } from '../components/dashboard/CancelBookingModal';
import { EditBookingDateModal } from '../components/dashboard/EditBookingDateModal';
import { useBookingStore } from '../store/useBookingStore';
import { Booking, BookingStatus } from '../types';
import { formatDisplayDate, formatFullDate, formatINR } from '../utils/formatters';

export const MyBookingsPage: React.FC = () => {
  const bookings = useBookingStore((s) => s.bookings);
  const isMutating = useBookingStore((s) => s.isMutating);
  const updateBookingDate = useBookingStore((s) => s.updateBookingDate);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const confirmBookingStatus = useBookingStore((s) => s.confirmBookingStatus);
  const resetDemoBookings = useBookingStore((s) => s.resetDemoBookings);

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToReschedule, setBookingToReschedule] =
    useState<Booking | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    const cancelled = bookings.filter((b) => b.status === 'Cancelled').length;
    const totalActiveValue = bookings
      .filter((b) => b.status !== 'Cancelled')
      .reduce((acc, b) => acc + b.priceBreakdown.totalPrice, 0);

    return {
      total: bookings.length,
      pending,
      confirmed,
      cancelled,
      totalActiveValue,
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'All') return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const showToast = (msg: string) => {
    setFeedbackBanner(msg);
    setTimeout(() => {
      setFeedbackBanner((curr) => (curr === msg ? null : curr));
    }, 5000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Dashboard Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <Database className="h-3.5 w-3.5" />
            <span>Persisted in LocalStorage (Zustand Store)</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            My Artist Bookings Dashboard
          </h1>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View, reschedule pending event dates (with live calendar availability
            re-validation), or cancel bookings. Changes immediately synchronize
            with each artist’s public availability calendar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              resetDemoBookings();
              showToast('Demo bookings restored to initial state.');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-rose-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
            Reset Demo Data
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-colors"
          >
            <Compass className="h-4 w-4" />
            Discover More Artists
          </Link>
        </div>
      </section>

      {/* KPI Summary Cards */}
      <section
        aria-label="Booking Summary Metrics"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Pending Requests
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-500">
              {stats.pending}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Date Editable
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Confirmed Shows
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {stats.confirmed}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Calendar Locked
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Cancelled
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-400">
              {stats.cancelled}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              Dates Released
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Booking Value
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-xl sm:text-2xl font-extrabold text-rose-500">
              {formatINR(stats.totalActiveValue)}
            </span>
          </div>
        </div>
      </section>

      {/* Live Feedback Toast Banner */}
      {feedbackBanner && (
        <div
          role="status"
          className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{feedbackBanner}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter bookings by status"
        className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4"
      >
        {(
          [
            { label: `All Bookings (${stats.total})`, value: 'All' },
            { label: `Pending (${stats.pending})`, value: 'Pending' },
            { label: `Confirmed (${stats.confirmed})`, value: 'Confirmed' },
            { label: `Cancelled (${stats.cancelled})`, value: 'Cancelled' },
          ] as { label: string; value: BookingStatus | 'All' }[]
        ).map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStatusFilter(tab.value)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-12 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
            <CalendarCheck2 className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            No {statusFilter !== 'All' ? statusFilter : ''} Bookings Found
          </h2>
          <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore our catalog of 32+ live performers, pick an available date on
            their calendar, and submit a booking request.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Browse Artists Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === 'Pending';
            const isConfirmed = booking.status === 'Confirmed';
            const isCancelled = booking.status === 'Cancelled';

            return (
              <article
                key={booking.id}
                className={`overflow-hidden rounded-3xl border transition-all ${
                  isCancelled
                    ? 'border-slate-200/70 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/40 opacity-80'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-rose-500/30'
                }`}
              >
                {/* Top Status & Reference Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 px-5 py-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                      Ref: {booking.referenceCode}
                    </span>

                    {/* Status Badge */}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-xs font-extrabold text-amber-600 dark:text-amber-400">
                        <Clock className="h-3 w-3" /> Pending Artist Approval
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Confirmed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-0.5 text-xs font-extrabold text-rose-600 dark:text-rose-400">
                        <CalendarX2 className="h-3 w-3" /> Cancelled
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Updated {new Date(booking.updatedAt).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Main Card Body */}
                <div className="p-5 sm:p-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-center">
                  {/* Artist & Event Info (5 cols) */}
                  <div className="lg:col-span-5 flex items-start gap-4">
                    <img
                      src={booking.artistAvatar}
                      alt={booking.artistName}
                      className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="space-y-1">
                      <span className="inline-block rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-500">
                        {booking.artistCategory}
                      </span>
                      <h2 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                        <Link
                          to={`/artists/${booking.artistId}`}
                          className="hover:text-rose-500 transition-colors inline-flex items-center gap-1"
                        >
                          {booking.artistName}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </h2>
                      <p className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <Calendar className="h-3.5 w-3.5 text-rose-500" />
                        {formatFullDate(booking.eventDate)}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-purple-500" />
                          {booking.eventCity} ({booking.eventType})
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-emerald-500" />
                          {booking.audienceSize} Guests
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Venue Details (4 cols) */}
                  <div className="lg:col-span-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 p-3.5 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <User className="h-3.5 w-3.5 text-rose-500" />
                      <span>{booking.contact.fullName}</span>
                      {booking.contact.organization && (
                        <span className="text-slate-400 font-normal">
                          • {booking.contact.organization}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{booking.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{booking.contact.phone}</span>
                    </div>
                    {booking.venueNotes && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        “{booking.venueNotes}”
                      </p>
                    )}
                    {isCancelled && booking.cancellationReason && (
                      <p className="text-[11px] font-semibold text-rose-500 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        Cancellation Note: {booking.cancellationReason}
                      </p>
                    )}
                  </div>

                  {/* Price & Actions (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4">
                    <div className="lg:text-right">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Computed Total ({booking.priceBreakdown.dateMultiplier}x Date)
                      </span>
                      <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                        {formatINR(booking.priceBreakdown.totalPrice)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center lg:justify-end gap-2">
                      {/* Edit Event Date — only enabled for Pending bookings per Requirement 3.4 */}
                      {isPending && (
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => setBookingToReschedule(booking)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                          Edit Event Date
                        </button>
                      )}

                      {/* Simulate Artist Confirmation (Pending -> Confirmed) */}
                      {isPending && (
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={async () => {
                            await confirmBookingStatus(booking.id);
                            showToast(
                              `Booking ${booking.referenceCode} marked as Confirmed!`
                            );
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                          title="Simulate artist accepting the pending request"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mark Confirmed
                        </button>
                      )}

                      {/* Cancel Booking — available for Pending or Confirmed bookings */}
                      {(isPending || isConfirmed) && (
                        <button
                          type="button"
                          disabled={isMutating}
                          onClick={() => setBookingToCancel(booking)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <CalendarX2 className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      <CancelBookingModal
        booking={bookingToCancel}
        isMutating={isMutating}
        onClose={() => setBookingToCancel(null)}
        onConfirmCancel={async (bookingId, reason) => {
          const target = bookings.find((b) => b.id === bookingId);
          await cancelBooking(bookingId, reason);
          if (target) {
            showToast(
              `Cancelled ${target.referenceCode}. ${formatDisplayDate(
                target.eventDate
              )} is now available again on ${target.artistName}’s calendar.`
            );
          }
        }}
      />

      {/* Edit Pending Booking Date Modal */}
      <EditBookingDateModal
        booking={bookingToReschedule}
        allBookings={bookings}
        isMutating={isMutating}
        onClose={() => setBookingToReschedule(null)}
        onSaveNewDate={async (bookingId, newDateStr) => {
          const updated = await updateBookingDate(bookingId, newDateStr);
          showToast(
            `Rescheduled ${updated.referenceCode} to ${formatDisplayDate(
              updated.eventDate
            )} (Updated Total: ${formatINR(updated.priceBreakdown.totalPrice)}).`
          );
        }}
      />
    </div>
  );
};
