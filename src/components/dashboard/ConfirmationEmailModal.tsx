import React, { useState } from 'react';
import {
  BadgeCheck,
  Calendar,
  Check,
  Copy,
  ExternalLink,
  MailCheck,
  MapPin,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { Booking } from '../../types';
import { formatFullDate, formatINR } from '../../utils/formatters';

interface ConfirmationEmailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ConfirmationEmailModal: React.FC<ConfirmationEmailModalProps> = ({
  booking,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!booking) return null;

  const emailSubject = `Booking Confirmed! ${booking.artistName} for your ${booking.eventType} (${booking.referenceCode})`;

  const emailBodyText = `Hi ${booking.contact.fullName},

Great news! ${booking.artistName} (${booking.artistCategory}) has officially CONFIRMED your booking request on StarClinch.

BOOKING CONFIRMATION DETAILS:
• Reference ID: ${booking.referenceCode}
• Status: CONFIRMED
• Artist: ${booking.artistName}
• Event Date: ${formatFullDate(booking.eventDate)}
• Event Type: ${booking.eventType}
• Event City: ${booking.eventCity}
• Expected Audience: ${booking.audienceSize} Guests
• Confirmed Total Amount: ${formatINR(booking.priceBreakdown.totalPrice)} (incl. GST & Platform Protection)

REGISTERED CLIENT DETAILS:
• Name: ${booking.contact.fullName}
• Email: ${booking.contact.email}
• Phone: ${booking.contact.phone}

Your event date (${booking.eventDate}) is now permanently locked on ${booking.artistName}'s calendar. Our StarClinch Event Concierge team will reach out to you on ${booking.contact.phone} for sound rider & stage coordination.

Warm regards,
StarClinch Artist Booking Desk
bookings@starclinch.com`;

  const mailtoHref = `mailto:${encodeURIComponent(
    booking.contact.email
  )}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    emailBodyText
  )}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailBodyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/40 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Top Notification Banner */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <MailCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-100">
                <Sparkles className="h-3 w-3" /> Artist Confirmed Request • Email Dispatched
              </span>
              <h2
                id="email-modal-title"
                className="font-display text-base sm:text-lg font-extrabold"
              >
                Confirmation Message Sent to {booking.contact.email}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close email preview"
            className="rounded-xl p-1.5 text-white/80 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Email Client Envelope Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-3.5 text-xs space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-400">From: </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                StarClinch Booking Desk &lt;bookings@starclinch.com&gt;
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" /> Delivered to Inbox
            </span>
          </div>

          <div>
            <span className="font-semibold text-slate-400">To: </span>
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {booking.contact.fullName} &lt;{booking.contact.email}&gt;
            </span>
          </div>

          <div>
            <span className="font-semibold text-slate-400">Subject: </span>
            <span className="font-bold text-slate-900 dark:text-white">
              🎉 {emailSubject}
            </span>
          </div>
        </div>

        {/* Email Message Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[68vh] overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Hi{' '}
            <strong className="text-slate-900 dark:text-white">
              {booking.contact.fullName}
            </strong>
            ,
          </p>

          <p>
            Great news!{' '}
            <strong className="text-rose-600 dark:text-rose-400">
              {booking.artistName}
            </strong>{' '}
            ({booking.artistCategory}) has officially{' '}
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-bold text-emerald-600 dark:text-emerald-400">
              CONFIRMED
            </span>{' '}
            your booking request. Below is your official confirmation summary sent
            to <strong>{booking.contact.email}</strong>:
          </p>

          {/* Ticket Card inside Email */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={booking.artistAvatar}
                  alt={booking.artistName}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                    {booking.artistName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Booking Ref: <strong className="font-mono">{booking.referenceCode}</strong>
                  </p>
                </div>
              </div>
              <span className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                ✓ Artist Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-rose-500 shrink-0" />
                <span>{formatFullDate(booking.eventDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-500 shrink-0" />
                <span>
                  {booking.eventCity} • {booking.eventType}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>{booking.audienceSize} Guests</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
              <span className="text-slate-500">
                Confirmed Total (incl. 12% GST &amp; Protection)
              </span>
              <span className="font-display text-base font-extrabold text-rose-600 dark:text-rose-400">
                {formatINR(booking.priceBreakdown.totalPrice)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Our StarClinch Event Concierge team will also coordinate with you on{' '}
            <strong>{booking.contact.phone}</strong> regarding stage setup and sound
            check timings.
          </p>

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied Message</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Email Content</span>
                  </>
                )}
              </button>

              <a
                href={mailtoHref}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in Mail App ({booking.contact.email})</span>
              </a>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
