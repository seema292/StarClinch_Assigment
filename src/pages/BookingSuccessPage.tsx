import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  Loader2,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { ConfirmationEmailModal } from '../components/dashboard/ConfirmationEmailModal';
import { useBookingStore } from '../store/useBookingStore';
import { formatFullDate, formatINR } from '../utils/formatters';

export const BookingSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const bookings = useBookingStore((s) => s.bookings);
  const confirmBookingStatus = useBookingStore((s) => s.confirmBookingStatus);
  const isMutating = useBookingStore((s) => s.isMutating);

  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          No Recent Booking Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Browse our artist catalog to submit a new booking request.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition-colors"
        >
          <Compass className="h-4 w-4" />
          Browse Artists
        </Link>
      </div>
    );
  }

  const isConfirmed = booking.status === 'Confirmed';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Celebratory Hero Card */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-6 sm:p-10 text-white shadow-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-rose-500/15 blur-3xl" />

        <div className="relative z-10 text-center space-y-5">
          {/* Animated Checkmark Badge */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="h-11 w-11" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Booking Reference: {booking.referenceCode}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Your Booking Request is{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Submitted!
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Thank you, <strong className="text-white">{booking.contact.fullName}</strong>!
            Your request to book{' '}
            <strong className="text-rose-400">{booking.artistName}</strong> for{' '}
            <strong className="text-white">
              {formatFullDate(booking.eventDate)}
            </strong>{' '}
            has been saved in <strong>LocalStorage</strong> and the date is now
            locked on the artist’s availability calendar.
          </p>

          {/* Status Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-xs font-bold text-slate-200">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              Saved in LocalStorage
            </span>

            {isConfirmed ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/25 border border-emerald-400/40 px-3.5 py-1.5 text-xs font-extrabold text-emerald-300">
                <BadgeCheck className="h-4 w-4" />
                Status: Artist Confirmed (Email Dispatched)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 px-3.5 py-1.5 text-xs font-extrabold text-amber-300">
                <Clock className="h-4 w-4" />
                Status: Pending Artist Confirmation
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Email Notification & Artist Confirmation Section */}
      <section className="rounded-3xl border border-rose-500/30 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
              <MailCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500">
                Email Notification System
              </span>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                {isConfirmed
                  ? `Confirmation Message Sent to ${booking.contact.email}`
                  : `Confirmation Will Be Sent to ${booking.contact.email}`}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {isConfirmed ? (
                  <>
                    <strong>{booking.artistName}</strong> has confirmed your
                    booking request! An official confirmation message has been
                    delivered to the email ID you provided during booking (
                    <strong className="text-rose-500">
                      {booking.contact.email}
                    </strong>
                    ).
                  </>
                ) : (
                  <>
                    As soon as <strong>{booking.artistName}</strong> confirms
                    your booking request, you will receive an official
                    confirmation message on your email ID:{' '}
                    <strong className="text-rose-500">
                      {booking.contact.email}
                    </strong>
                    .
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {!isConfirmed ? (
              <button
                type="button"
                disabled={isMutating}
                onClick={async () => {
                  await confirmBookingStatus(booking.id);
                  setEmailModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer disabled:opacity-50"
              >
                {isMutating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Artist Confirming...</span>
                  </>
                ) : (
                  <>
                    <MailCheck className="h-4 w-4" />
                    <span>Simulate Artist Confirm → Get Email Now</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-emerald-500 transition-colors cursor-pointer"
              >
                <MailCheck className="h-4 w-4" />
                <span>Open Confirmation Email</span>
              </button>
            )}
          </div>
        </div>

        {/* Booking Details Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Artist & Event Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={booking.artistAvatar}
                alt={booking.artistName}
                className="h-16 w-16 rounded-2xl object-cover border border-rose-500/30"
              />
              <div>
                <span className="inline-block rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-500">
                  {booking.artistCategory}
                </span>
                <h3 className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  {booking.artistName}
                </h3>
                <p className="text-xs text-slate-500">
                  Base City: {booking.artistHomeCity}
                </p>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" />
                  Event Date
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatFullDate(booking.eventDate)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-purple-500" />
                  Event Type &amp; City
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {booking.eventType} • {booking.eventCity}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-3.5 w-3.5 text-emerald-500" />
                  Expected Audience
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {booking.audienceSize.toLocaleString('en-IN')} Guests
                </span>
              </div>
            </div>
          </div>

          {/* Client Contact & Price Summary Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500">
                Registered Client Information
              </span>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <User className="h-4 w-4 text-rose-500" />
                <span>{booking.contact.fullName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="h-3.5 w-3.5 text-rose-500" />
                <span className="font-semibold">{booking.contact.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Phone className="h-3.5 w-3.5 text-emerald-500" />
                <span>{booking.contact.phone}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1.5">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({booking.priceBreakdown.dateMultiplier}x Date Tier)</span>
                <span>{formatINR(booking.priceBreakdown.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform Protection &amp; GST (12%)</span>
                <span>+{formatINR(booking.priceBreakdown.platformAndGstFee)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Total Estimate
                </span>
                <span className="text-base text-rose-600 dark:text-rose-400">
                  {formatINR(booking.priceBreakdown.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
          <Link
            to={`/artists/${booking.artistId}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            View {booking.artistName}’s Updated Calendar
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Compass className="h-4 w-4" />
              Browse More Artists
            </Link>

            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 transition-colors"
            >
              <CalendarCheck2 className="h-4 w-4" />
              <span>Go to My Bookings Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Confirmation Email Modal */}
      <ConfirmationEmailModal
        booking={emailModalOpen ? booking : null}
        onClose={() => setEmailModalOpen(false)}
      />
    </div>
  );
};
