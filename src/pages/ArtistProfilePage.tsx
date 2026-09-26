import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  Mic2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { AvailabilityCalendar } from '../components/profile/AvailabilityCalendar';
import { MediaGallery } from '../components/profile/MediaGallery';
import { PriceEstimator } from '../components/profile/PriceEstimator';
import { ReviewsSection } from '../components/profile/ReviewsSection';
import { fetchArtistById } from '../services/api';
import { useBookingStore } from '../store/useBookingStore';
import { Artist, Booking, CityName, EventType } from '../types';
import { logAnalyticsEvent } from '../utils/analytics';
import { isDateAvailable, toDateKey } from '../utils/availability';
import { formatDisplayDate, formatINR } from '../utils/formatters';
import { calculateDynamicPrice } from '../utils/pricing';

export const ArtistProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const userBookings = useBookingStore((s) => s.bookings);

  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Interactive Estimator & Calendar State
  const [selectedDate, setSelectedDate] = useState<string>(
    () => searchParams.get('date') || ''
  );
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [eventCity, setEventCity] = useState<CityName>('Mumbai');
  const [audienceSize, setAudienceSize] = useState<number>(300);

  // Booking Wizard Modal State
  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [recentConfirmedBooking, setRecentConfirmedBooking] =
    useState<Booking | null>(null);

  const loadArtist = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchArtistById(id);
      setArtist(data);
      setEventCity(data.city);

      logAnalyticsEvent('artist_profile_view', {
        artistId: data.id,
        artistName: data.name,
        category: data.category,
        basePrice: data.basePrice,
      });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to load artist profile.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadArtist();
  }, [loadArtist]);

  const todayStr = toDateKey(new Date());

  // Live check whether the currently selected date is valid & available
  const isSelectedDateValid = useMemo(() => {
    if (!artist || !selectedDate) return false;
    return isDateAvailable(
      selectedDate,
      artist.id,
      artist.bookedDateRanges,
      userBookings,
      todayStr
    );
  }, [artist, selectedDate, userBookings, todayStr]);

  // Compute dynamic price breakdown in real time
  const priceBreakdown = useMemo(() => {
    const basePrice = artist?.basePrice ?? 100000;
    return calculateDynamicPrice({
      basePrice,
      dateStr: selectedDate,
      eventType,
      audienceSize,
      artistHomeCity: artist?.city,
      eventCity,
    });
  }, [artist, selectedDate, eventType, audienceSize, eventCity]);

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setRecentConfirmedBooking(null);
    logAnalyticsEvent('calendar_date_select', {
      artistId: artist?.id,
      selectedDate: dateStr,
    });
  };

  const handleEventTypeChange = (type: EventType) => {
    setEventType(type);
    logAnalyticsEvent('price_estimate_change', {
      artistId: artist?.id,
      eventType: type,
      selectedDate,
    });
  };

  const handleOpenBookingWizard = () => {
    if (!isSelectedDateValid || !artist) return;
    logAnalyticsEvent('booking_wizard_open', {
      artistId: artist.id,
      selectedDate,
      eventType,
      estimatedTotal: priceBreakdown.totalPrice,
    });
    setWizardOpen(true);
  };

  if (isLoading) {
    return (
      <div
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse"
        aria-busy="true"
        aria-label="Loading artist profile"
      >
        <div className="h-8 w-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="lg:col-span-5">
            <div className="h-[520px] rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !artist) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Artist Profile Unavailable
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {errorMessage || 'Could not find the requested artist.'}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={loadArtist}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8 pb-24 lg:pb-12">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-rose-500/40 hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Artist Discovery
        </Link>

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Artist ID: <code className="font-mono">{artist.id}</code>
        </span>
      </div>

      {/* Live Toast Banner When a Booking Request Was Just Completed */}
      {recentConfirmedBooking && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">
                🎉 Your Booking Request ({recentConfirmedBooking.referenceCode}) is Done &amp; Saved in LocalStorage!
              </p>
              <p className="text-xs opacity-90">
                <strong>{formatDisplayDate(recentConfirmedBooking.eventDate)}</strong> is now locked on the calendar below, and once confirmed by {artist.name}, the confirmation message is sent to <strong>{recentConfirmedBooking.contact.email}</strong>.
              </p>
            </div>
          </div>
          <Link
            to="/bookings"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500 transition-colors"
          >
            View in My Bookings →
          </Link>
        </div>
      )}

      {/* Hero Cover + Artist Identity Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white shadow-2xl">
        {/* Background Cover Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img
            src={artist.coverImage}
            alt={`${artist.name} stage cover`}
            className="h-full w-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Overlay Profile Content */}
        <div className="relative -mt-24 sm:-mt-28 px-5 pb-6 sm:px-8 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <img
              src={artist.avatar}
              alt={artist.name}
              className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover ring-4 ring-slate-950 shadow-2xl"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                  {artist.category}
                </span>
                {artist.subcategories.map((sub) => (
                  <span
                    key={sub}
                    className="rounded-lg bg-white/10 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-slate-200"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {artist.name}
                </h1>
                {artist.verified && (
                  <BadgeCheck
                    className="h-6 w-6 text-rose-400 shrink-0"
                    aria-label="StarClinch Verified Artist"
                  />
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-300 font-medium">
                {artist.stageTagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  Base City: {artist.city}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {artist.rating.toFixed(1)} ({artist.reviewCount} verified reviews)
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  {artist.eventsCompleted}+ Events Completed
                </span>
              </div>
            </div>
          </div>

          {/* Starting Fee Badge */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 text-left md:text-right shrink-0">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-300">
              Base Starting Fee
            </span>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {formatINR(artist.basePrice)}
            </span>
            <span className="block text-[11px] text-slate-300 mt-0.5">
              Replies {artist.responseTime} • Pan-India Travel Ready
            </span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Layout: Left (Bio, Specs, Calendar, Gallery, Reviews) + Right (Sticky Price Estimator) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Bio & Performance Specifications */}
          <section
            aria-label="Artist Biography and Technical Rider"
            className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-5"
          >
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2">
                About {artist.name}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {artist.bio}
              </p>
            </div>

            {/* Key Performance Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Set Duration</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {artist.performanceDuration}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-500 mb-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>On-Stage Crew</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {artist.teamSize}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mb-1">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Languages</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {artist.languages.join(', ')}
                </p>
              </div>
            </div>

            {/* Technical Stage Rider Requirements */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Mic2 className="h-3.5 w-3.5 text-rose-500" />
                Standard Technical &amp; Sound Rider Requirements:
              </span>
              <div className="flex flex-wrap gap-2">
                {artist.equipmentRequirements.map((req) => (
                  <span
                    key={req}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Availability Calendar */}
          <AvailabilityCalendar
            artistId={artist.id}
            artistName={artist.name}
            bookedRanges={artist.bookedDateRanges}
            userBookings={userBookings}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />

          {/* Photo Carousel & Sample Videos */}
          <MediaGallery
            artistName={artist.name}
            gallery={artist.gallery}
            sampleVideos={artist.sampleVideos}
          />

          {/* Verified Client Reviews */}
          <ReviewsSection
            artistName={artist.name}
            rating={artist.rating}
            reviewCount={artist.reviewCount}
            reviews={artist.reviews}
          />
        </div>

        {/* Right Column (5 Cols): Sticky Dynamic Price Estimator & Booking CTA */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <PriceEstimator
            artist={artist}
            selectedDate={selectedDate}
            isSelectedDateValid={isSelectedDateValid}
            eventType={eventType}
            onChangeEventType={handleEventTypeChange}
            eventCity={eventCity}
            onChangeEventCity={setEventCity}
            audienceSize={audienceSize}
            onChangeAudienceSize={setAudienceSize}
            priceBreakdown={priceBreakdown}
            onOpenBookingWizard={handleOpenBookingWizard}
          />
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar for Quick Booking Access */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex lg:hidden items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 py-3 backdrop-blur-lg shadow-2xl">
        <div>
          <span className="block text-[10px] font-bold uppercase text-slate-400">
            {isSelectedDateValid
              ? `Est. Total (${formatDisplayDate(selectedDate)})`
              : 'Select an available date'}
          </span>
          <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
            {formatINR(priceBreakdown.totalPrice)}
          </span>
        </div>

        <button
          type="button"
          disabled={!isSelectedDateValid}
          onClick={handleOpenBookingWizard}
          className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-rose-600/25 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {isSelectedDateValid ? 'Request to Book' : 'Pick Date First'}
          </span>
        </button>
      </div>

      {/* Multi-Step Booking Flow Modal */}
      <BookingWizardModal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        artist={artist}
        initialDate={selectedDate}
        initialEventType={eventType}
        initialEventCity={eventCity}
        initialAudienceSize={audienceSize}
        onBookingCreated={(created) => {
          setRecentConfirmedBooking(created);
          setSelectedDate('');
        }}
      />
    </div>
  );
};
