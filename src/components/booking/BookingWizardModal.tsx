import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Database,
  Loader2,
  Mail,
  MailCheck,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react';
import { CITIES, EVENT_TYPES } from '../../data/artists';
import { useBookingStore } from '../../store/useBookingStore';
import { Artist, Booking, CityName, EventType } from '../../types';
import { logAnalyticsEvent } from '../../utils/analytics';
import {
  formatDisplayDate,
  formatFullDate,
  formatINR,
} from '../../utils/formatters';
import {
  calculateDynamicPrice,
  EVENT_TYPE_MULTIPLIERS,
} from '../../utils/pricing';
import {
  Step1EventData,
  Step2ContactData,
  validateContactDetails,
  validateEventDetails,
} from '../../utils/validation';
import { ConfirmationEmailModal } from '../dashboard/ConfirmationEmailModal';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: Artist;
  initialDate: string;
  initialEventType: EventType;
  initialEventCity: CityName;
  initialAudienceSize: number;
  onBookingCreated?: (booking: Booking) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  artist,
  initialDate,
  initialEventType,
  initialEventCity,
  initialAudienceSize,
  onBookingCreated,
}) => {
  const navigate = useNavigate();
  const bookings = useBookingStore((s) => s.bookings);
  const createBooking = useBookingStore((s) => s.createBooking);
  const confirmBookingStatus = useBookingStore((s) => s.confirmBookingStatus);
  const isMutating = useBookingStore((s) => s.isMutating);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [emailModalBooking, setEmailModalBooking] = useState<Booking | null>(
    null
  );
  const wasOpenRef = useRef(false);

  // Step 1 State
  const [eventData, setEventData] = useState<Step1EventData>({
    eventDate: initialDate,
    eventType: initialEventType,
    eventCity: initialEventCity,
    audienceSize: initialAudienceSize,
    venueNotes: '',
  });
  const [step1Errors, setStep1Errors] = useState<
    Partial<Record<keyof Step1EventData, string>>
  >({});

  // Step 2 State
  const [contactData, setContactData] = useState<Step2ContactData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
  });
  const [step2Errors, setStep2Errors] = useState<
    Partial<Record<keyof Step2ContactData, string>>
  >({});
  const [step2Touched, setStep2Touched] = useState<
    Partial<Record<keyof Step2ContactData, boolean>>
  >({});

  // Step 3 & Step 4 State
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null
  );

  // Sync props ONLY when modal transitions from closed -> open
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      wasOpenRef.current = true;
      setStep(1);
      setEventData({
        eventDate: initialDate,
        eventType: initialEventType,
        eventCity: initialEventCity,
        audienceSize: initialAudienceSize,
        venueNotes: '',
      });
      setStep1Errors({});
      setStep2Errors({});
      setSubmitError(null);
      setConfirmedBooking(null);
    } else if (!isOpen) {
      wasOpenRef.current = false;
    }
  }, [
    isOpen,
    initialDate,
    initialEventType,
    initialEventCity,
    initialAudienceSize,
  ]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isMutating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMutating, onClose]);

  const livePriceBreakdown = useMemo(
    () =>
      calculateDynamicPrice({
        basePrice: artist.basePrice,
        dateStr: eventData.eventDate,
        eventType: eventData.eventType,
        audienceSize: eventData.audienceSize,
        artistHomeCity: artist.city,
        eventCity: eventData.eventCity,
      }),
    [artist.basePrice, artist.city, eventData]
  );

  if (!isOpen) return null;

  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateEventDetails(
      eventData,
      artist.id,
      artist.bookedDateRanges,
      bookings
    );
    setStep1Errors(errors);

    if (Object.keys(errors).length === 0) {
      logAnalyticsEvent('booking_step_complete', {
        step: 1,
        artistId: artist.id,
        eventDate: eventData.eventDate,
        eventType: eventData.eventType,
      });
      setStep(2);
    }
  };

  const handleContactFieldBlur = (field: keyof Step2ContactData) => {
    setStep2Touched((prev) => ({ ...prev, [field]: true }));
    const errors = validateContactDetails(contactData);
    setStep2Errors(errors);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Touched({ fullName: true, email: true, phone: true });
    const errors = validateContactDetails(contactData);
    setStep2Errors(errors);

    if (Object.keys(errors).length === 0) {
      logAnalyticsEvent('booking_step_complete', {
        step: 2,
        artistId: artist.id,
        contactEmail: contactData.email,
      });
      setSubmitError(null);
      setStep(3);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitError(null);

    try {
      const created = await createBooking(
        {
          artistId: artist.id,
          eventDate: eventData.eventDate,
          eventType: eventData.eventType,
          eventCity: eventData.eventCity,
          audienceSize: Number(eventData.audienceSize),
          venueNotes: eventData.venueNotes,
          contact: contactData,
        },
        { simulateNetworkError: false }
      );

      setConfirmedBooking(created);
      onBookingCreated?.(created);
      onClose();
      navigate(`/booking-success/${created.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please retry.'
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-wizard-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="h-11 w-11 rounded-xl object-cover border border-rose-500/30"
            />
            <div>
              <h2
                id="booking-wizard-title"
                className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white"
              >
                {step === 4
                  ? 'Your Booking Request is Done!'
                  : `Book ${artist.name}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {artist.category} • Base City: {artist.city}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isMutating}
            onClick={onClose}
            aria-label="Close booking modal"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator (Steps 1-3) */}
        {step < 4 && (
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 sm:px-6">
            <ol className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[
                { num: 1, label: '1. Event Details' },
                { num: 2, label: '2. Contact Info' },
                { num: 3, label: '3. Review & Confirm' },
              ].map((item) => {
                const isActive = step === item.num;
                const isDone = step > item.num;
                return (
                  <li
                    key={item.num}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors ${
                      isActive
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                        isActive
                          ? 'bg-rose-600 text-white'
                          : isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {isDone ? '✓' : item.num}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto">
          {/* ================================================================
              STEP 1: EVENT DETAILS
          ================================================================ */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Event Date */}
                <div>
                  <label
                    htmlFor="booking-event-date"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                    <input
                      id="booking-event-date"
                      type="date"
                      value={eventData.eventDate}
                      onChange={(e) => {
                        const next = {
                          ...eventData,
                          eventDate: e.target.value,
                        };
                        setEventData(next);
                        setStep1Errors(
                          validateEventDetails(
                            next,
                            artist.id,
                            artist.bookedDateRanges,
                            bookings
                          )
                        );
                      }}
                      aria-invalid={Boolean(step1Errors.eventDate)}
                      aria-describedby={
                        step1Errors.eventDate ? 'err-event-date' : undefined
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  {step1Errors.eventDate && (
                    <p
                      id="err-event-date"
                      role="alert"
                      className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step1Errors.eventDate}
                    </p>
                  )}
                </div>

                {/* Event Type */}
                <div>
                  <label
                    htmlFor="booking-event-type"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Event Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="booking-event-type"
                    value={eventData.eventType}
                    onChange={(e) =>
                      setEventData({
                        ...eventData,
                        eventType: e.target.value as EventType,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {EVENT_TYPE_MULTIPLIERS[t].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event City */}
                <div>
                  <label
                    htmlFor="booking-event-city"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Event City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
                    <select
                      id="booking-event-city"
                      value={eventData.eventCity}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          eventCity: e.target.value as CityName,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c} {c === artist.city ? '(Local)' : '(Outstation)'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expected Audience Size */}
                <div>
                  <label
                    htmlFor="booking-audience-size"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Expected Audience Size{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
                    <input
                      id="booking-audience-size"
                      type="number"
                      min={15}
                      max={50000}
                      value={eventData.audienceSize}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEventData({ ...eventData, audienceSize: val });
                        if (step1Errors.audienceSize) {
                          setStep1Errors({
                            ...step1Errors,
                            audienceSize: undefined,
                          });
                        }
                      }}
                      aria-invalid={Boolean(step1Errors.audienceSize)}
                      aria-describedby={
                        step1Errors.audienceSize
                          ? 'err-audience-size'
                          : undefined
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  {step1Errors.audienceSize && (
                    <p
                      id="err-audience-size"
                      role="alert"
                      className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step1Errors.audienceSize}
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Venue / Timing Notes */}
              <div>
                <label
                  htmlFor="booking-venue-notes"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Venue Name &amp; Special Song/Stage Requests (Optional)
                </label>
                <textarea
                  id="booking-venue-notes"
                  rows={2}
                  value={eventData.venueNotes}
                  onChange={(e) =>
                    setEventData({ ...eventData, venueNotes: e.target.value })
                  }
                  placeholder="e.g. Grand Hyatt Ballroom, Sangeet starts at 8:30 PM..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Live Price Preview Bar */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-100 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Live Dynamic Estimate (
                    {formatDisplayDate(eventData.eventDate)})
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    {livePriceBreakdown.dateTierLabel} • {eventData.eventType}
                  </span>
                </div>
                <span className="font-display text-xl font-extrabold text-rose-600 dark:text-rose-400">
                  {formatINR(livePriceBreakdown.totalPrice)}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <span>Continue to Contact Info</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================================================================
              STEP 2: CONTACT DETAILS (WITH FORMAT VALIDATION)
          ================================================================ */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2} noValidate className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your contact details. Once {artist.name} confirms your
                booking request, the confirmation message will be sent to your
                email ID.
              </p>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="contact-full-name"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="contact-full-name"
                    type="text"
                    value={contactData.fullName}
                    onChange={(e) => {
                      const next = { ...contactData, fullName: e.target.value };
                      setContactData(next);
                      if (step2Touched.fullName) {
                        setStep2Errors(validateContactDetails(next));
                      }
                    }}
                    onBlur={() => handleContactFieldBlur('fullName')}
                    placeholder="e.g. Priya Sharma"
                    aria-invalid={Boolean(step2Errors.fullName)}
                    aria-describedby={
                      step2Errors.fullName ? 'err-contact-name' : undefined
                    }
                    className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none ${
                      step2Errors.fullName
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-800 focus:border-rose-500'
                    }`}
                  />
                </div>
                {step2Errors.fullName && (
                  <p
                    id="err-contact-name"
                    role="alert"
                    className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {step2Errors.fullName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="contact-email"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => {
                        const next = { ...contactData, email: e.target.value };
                        setContactData(next);
                        if (step2Touched.email) {
                          setStep2Errors(validateContactDetails(next));
                        }
                      }}
                      onBlur={() => handleContactFieldBlur('email')}
                      placeholder="priya@company.in"
                      aria-invalid={Boolean(step2Errors.email)}
                      aria-describedby={
                        step2Errors.email ? 'err-contact-email' : undefined
                      }
                      className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none ${
                        step2Errors.email
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-rose-500'
                      }`}
                    />
                  </div>
                  {step2Errors.email && (
                    <p
                      id="err-contact-email"
                      role="alert"
                      className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step2Errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="contact-phone"
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Mobile Number (10-digit){' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="contact-phone"
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => {
                        const next = { ...contactData, phone: e.target.value };
                        setContactData(next);
                        if (step2Touched.phone) {
                          setStep2Errors(validateContactDetails(next));
                        }
                      }}
                      onBlur={() => handleContactFieldBlur('phone')}
                      placeholder="+91 98765 43210"
                      aria-invalid={Boolean(step2Errors.phone)}
                      aria-describedby={
                        step2Errors.phone ? 'err-contact-phone' : undefined
                      }
                      className={`w-full rounded-xl border bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none ${
                        step2Errors.phone
                          ? 'border-rose-500 focus:border-rose-500'
                          : 'border-slate-200 dark:border-slate-800 focus:border-rose-500'
                      }`}
                    />
                  </div>
                  {step2Errors.phone && (
                    <p
                      id="err-contact-phone"
                      role="alert"
                      className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {step2Errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Company / Family Name */}
              <div>
                <label
                  htmlFor="contact-org"
                  className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Company / Event Host Organization (Optional)
                </label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="contact-org"
                    type="text"
                    value={contactData.organization}
                    onChange={(e) =>
                      setContactData({
                        ...contactData,
                        organization: e.target.value,
                      })
                    }
                    placeholder="e.g. Acme Corp / Sharma Wedding Committee"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Event Details
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <span>Review &amp; Confirm</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* ================================================================
              STEP 3: REVIEW & CONFIRM (SMOOTH LOCALSTORAGE SUBMISSION)
          ================================================================ */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Event & Contact Summary Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                    Event Summary
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {formatFullDate(eventData.eventDate)}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Type:</strong> {eventData.eventType}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>City:</strong> {eventData.eventCity}{' '}
                    {livePriceBreakdown.isOutstation
                      ? '(Outstation Travel Included)'
                      : '(Local Performance)'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Expected Guests:</strong>{' '}
                    {eventData.audienceSize.toLocaleString('en-IN')}
                  </p>
                  {eventData.venueNotes && (
                    <p className="text-slate-500 italic pt-1">
                      “{eventData.venueNotes}”
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500">
                    Client Contact Details
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {contactData.fullName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Email:</strong> {contactData.email}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Phone:</strong> {contactData.phone}
                  </p>
                  {contactData.organization && (
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Organization:</strong> {contactData.organization}
                    </p>
                  )}
                </div>
              </div>

              {/* Computed Price Breakdown */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-2 text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Computed Price Breakdown
                </span>
                <div className="flex justify-between">
                  <span>Base Artist Fee</span>
                  <span className="font-semibold">
                    {formatINR(livePriceBreakdown.basePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{livePriceBreakdown.dateTierLabel}</span>
                  <span className="font-semibold">
                    +{formatINR(livePriceBreakdown.dateSurcharge)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {eventData.eventType} (
                    {livePriceBreakdown.eventTypeMultiplier}x)
                  </span>
                  <span className="font-semibold">
                    {livePriceBreakdown.eventTypeAdjustment >= 0
                      ? `+${formatINR(livePriceBreakdown.eventTypeAdjustment)}`
                      : formatINR(livePriceBreakdown.eventTypeAdjustment)}
                  </span>
                </div>
                {livePriceBreakdown.audienceSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span>{livePriceBreakdown.audienceTierLabel}</span>
                    <span className="font-semibold">
                      +{formatINR(livePriceBreakdown.audienceSurcharge)}
                    </span>
                  </div>
                )}
                {livePriceBreakdown.isOutstation && (
                  <div className="flex justify-between">
                    <span>Outstation Travel &amp; Hospitality</span>
                    <span className="font-semibold">
                      +{formatINR(livePriceBreakdown.outstationTravelFee)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span>Platform Protection &amp; GST (12%)</span>
                  <span>+{formatINR(livePriceBreakdown.platformAndGstFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Total Payable Estimate</span>
                  <span className="text-base text-rose-600 dark:text-rose-400">
                    {formatINR(livePriceBreakdown.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Reassuring LocalStorage & Email Notification Banner */}
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-800 dark:text-emerald-300">
                <Database className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>
                  Your booking will be saved instantly in{' '}
                  <strong>LocalStorage</strong> and confirmation details will be
                  sent to <strong>{contactData.email}</strong> once confirmed by{' '}
                  {artist.name}.
                </span>
              </div>

              {/* Error State with Direct Retry Action (if date was already booked) */}
              {submitError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 space-y-3"
                >
                  <div className="flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold">Could Not Complete Booking</p>
                      <p>{submitError}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => handleFinalSubmit()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white shadow hover:bg-rose-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry Booking
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Navigation & Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit Contact Info
                </button>

                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => handleFinalSubmit()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-purple-500 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isMutating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting Booking Request...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>
                        Confirm &amp; Submit Request (
                        {formatINR(livePriceBreakdown.totalPrice)})
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 4: POPUP MESSAGE — YOUR BOOKING REQUEST IS DONE!
          ================================================================ */}
          {step === 4 && confirmedBooking && (
            <div className="py-3 text-center space-y-5">
              {/* Prominent Popup Alert Banner */}
              <div
                role="alert"
                className="mx-auto max-w-lg rounded-2xl border-2 border-emerald-500 bg-emerald-500/15 px-5 py-4 text-sm sm:text-base font-extrabold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/10"
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                <span>🎉 Your Booking Request is Done &amp; Submitted!</span>
              </div>

              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-extrabold text-rose-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Saved in LocalStorage • Ref: {confirmedBooking.referenceCode}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                  Request Sent to {artist.name}
                </h3>
                <p className="mx-auto max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  We have locked{' '}
                  <strong>{formatFullDate(confirmedBooking.eventDate)}</strong>{' '}
                  on {artist.name}’s availability calendar and stored your
                  booking in <strong>My Bookings</strong>.
                </p>
              </div>

              {/* Email Notification Promise & Instant Simulation Box */}
              <div className="mx-auto max-w-lg rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-left text-xs space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <MailCheck className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {confirmedBooking.status === 'Confirmed'
                        ? `✓ Artist Confirmed! Email Sent to ${confirmedBooking.contact.email}`
                        : `Confirmation Email Will Be Sent to: ${confirmedBooking.contact.email}`}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {confirmedBooking.status === 'Confirmed' ? (
                        <>
                          <strong>{artist.name}</strong> has confirmed your
                          booking request! A confirmation message has been sent
                          to your email ID{' '}
                          <strong className="text-rose-500">
                            {confirmedBooking.contact.email}
                          </strong>
                          .
                        </>
                      ) : (
                        <>
                          Once <strong>{artist.name}</strong> confirms your
                          request, you will get a confirmation message on the
                          email ID you filled during booking:{' '}
                          <strong className="text-rose-500">
                            {confirmedBooking.contact.email}
                          </strong>
                          .
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Simulate Artist Confirming Right Now */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  {confirmedBooking.status === 'Pending' ? (
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={async () => {
                        const updated = await confirmBookingStatus(
                          confirmedBooking.id
                        );
                        setConfirmedBooking(updated);
                        setEmailModalBooking(updated);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isMutating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Artist Confirming &amp; Sending Email...</span>
                        </>
                      ) : (
                        <>
                          <MailCheck className="h-4 w-4" />
                          <span>
                            Artist Confirm Now → Get Message on{' '}
                            {confirmedBooking.contact.email}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEmailModalBooking(confirmedBooking)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 transition-colors cursor-pointer"
                    >
                      <MailCheck className="h-4 w-4" />
                      <span>
                        Open Email Message Sent to{' '}
                        {confirmedBooking.contact.email}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Summary Card */}
              <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Booking Status:</span>
                  <span
                    className={`font-extrabold ${
                      confirmedBooking.status === 'Confirmed'
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {confirmedBooking.status === 'Confirmed'
                      ? '✓ Confirmed by Artist (Email Sent)'
                      : 'Pending Artist Confirmation'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Event Type &amp; City:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {confirmedBooking.eventType} • {confirmedBooking.eventCity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client Email ID:</span>
                  <span className="font-bold text-rose-500">
                    {confirmedBooking.contact.email}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5 font-extrabold text-slate-900 dark:text-white">
                  <span>Total Amount:</span>
                  <span className="text-rose-500">
                    {formatINR(confirmedBooking.priceBreakdown.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/bookings');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  <span>Go to My Bookings Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Email Sent Popup Modal */}
      <ConfirmationEmailModal
        booking={emailModalBooking}
        onClose={() => setEmailModalBooking(null)}
      />
    </div>
  );
};
