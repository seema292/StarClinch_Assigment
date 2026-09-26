import React from 'react';
import {
  Calculator,
  CalendarCheck,
  CheckCircle2,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { CITIES, EVENT_TYPES } from '../../data/artists';
import { Artist, CityName, EventType, PriceBreakdown } from '../../types';
import { formatDisplayDate, formatINR } from '../../utils/formatters';
import { EVENT_TYPE_MULTIPLIERS } from '../../utils/pricing';

interface PriceEstimatorProps {
  artist: Artist;
  selectedDate: string;
  isSelectedDateValid: boolean;
  eventType: EventType;
  onChangeEventType: (type: EventType) => void;
  eventCity: CityName;
  onChangeEventCity: (city: CityName) => void;
  audienceSize: number;
  onChangeAudienceSize: (size: number) => void;
  priceBreakdown: PriceBreakdown;
  onOpenBookingWizard: () => void;
}

export const PriceEstimator: React.FC<PriceEstimatorProps> = ({
  artist,
  selectedDate,
  isSelectedDateValid,
  eventType,
  onChangeEventType,
  eventCity,
  onChangeEventCity,
  audienceSize,
  onChangeAudienceSize,
  priceBreakdown,
  onOpenBookingWizard,
}) => {
  return (
    <aside
      aria-label="Dynamic Event Price Estimator and Booking Call to Action"
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/95 p-5 sm:p-6 shadow-xl space-y-5"
    >
      {/* Top Price Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500">
            <Calculator className="h-3.5 w-3.5" />
            Dynamic Price Estimator
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatINR(priceBreakdown.totalPrice)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              incl. GST &amp; protection
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Base Fee
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {formatINR(artist.basePrice)}
          </span>
        </div>
      </div>

      {/* Selected Date Status Banner */}
      <div
        className={`rounded-xl p-3.5 border text-xs transition-colors ${
          isSelectedDateValid
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'
        }`}
      >
        <div className="flex items-center justify-between font-bold">
          <span className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4 shrink-0" />
            {isSelectedDateValid
              ? `Event Date: ${formatDisplayDate(selectedDate)}`
              : 'Select an Available Date on Calendar'}
          </span>
          {isSelectedDateValid && (
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-extrabold">
              {priceBreakdown.dateMultiplier.toFixed(2)}x Date Rate
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] opacity-90">
          {isSelectedDateValid
            ? priceBreakdown.dateTierLabel
            : 'Pick any open date from the availability calendar to unlock booking.'}
        </p>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-4">
        {/* Event Type Selector */}
        <div>
          <label
            htmlFor="estimator-event-type"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            1. Event Type (Multiplier)
          </label>
          <select
            id="estimator-event-type"
            value={eventType}
            onChange={(e) => onChangeEventType(e.target.value as EventType)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {EVENT_TYPE_MULTIPLIERS[type].label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {EVENT_TYPE_MULTIPLIERS[eventType].description}
          </p>
        </div>

        {/* Event City Selector */}
        <div>
          <label
            htmlFor="estimator-event-city"
            className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            2. Event City (Artist Home: {artist.city})
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
            <select
              id="estimator-event-city"
              value={eventCity}
              onChange={(e) => onChangeEventCity(e.target.value as CityName)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city} {city === artist.city ? '(Local — ₹0 Travel)' : '(Outstation)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expected Audience Size Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <label htmlFor="estimator-audience-size" className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-purple-500" />
              <span>3. Expected Audience</span>
            </label>
            <span className="text-rose-500 font-extrabold">
              {audienceSize.toLocaleString('en-IN')} Guests
            </span>
          </div>
          <input
            id="estimator-audience-size"
            type="range"
            min={50}
            max={3000}
            step={50}
            value={audienceSize}
            onChange={(e) => onChangeAudienceSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-rose-600"
          />
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {priceBreakdown.audienceTierLabel}
          </p>
        </div>
      </div>

      {/* Itemized Price Breakdown Box */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-950/90 p-4 border border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>Artist Base Performance Fee</span>
          <span className="font-semibold">{formatINR(priceBreakdown.basePrice)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>
            Date Tier ({priceBreakdown.dateMultiplier.toFixed(2)}x)
          </span>
          <span
            className={
              priceBreakdown.dateSurcharge > 0
                ? 'font-semibold text-amber-600 dark:text-amber-400'
                : 'font-semibold'
            }
          >
            {priceBreakdown.dateSurcharge >= 0
              ? `+${formatINR(priceBreakdown.dateSurcharge)}`
              : formatINR(priceBreakdown.dateSurcharge)}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span>
            {eventType} ({priceBreakdown.eventTypeMultiplier.toFixed(2)}x)
          </span>
          <span
            className={
              priceBreakdown.eventTypeAdjustment < 0
                ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                : 'font-semibold text-rose-600 dark:text-rose-400'
            }
          >
            {priceBreakdown.eventTypeAdjustment >= 0
              ? `+${formatINR(priceBreakdown.eventTypeAdjustment)}`
              : formatINR(priceBreakdown.eventTypeAdjustment)}
          </span>
        </div>

        {priceBreakdown.audienceSurcharge > 0 && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Venue Scale &amp; Sound Rider Adjustment</span>
            <span className="font-semibold">
              +{formatINR(priceBreakdown.audienceSurcharge)}
            </span>
          </div>
        )}

        {priceBreakdown.isOutstation && (
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1">
              <Plane className="h-3 w-3 text-rose-500" />
              Outstation Travel ({artist.city} → {eventCity})
            </span>
            <span className="font-semibold">
              +{formatINR(priceBreakdown.outstationTravelFee)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-2">
          <span>Platform Protection &amp; GST (12%)</span>
          <span>+{formatINR(priceBreakdown.platformAndGstFee)}</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 text-sm font-extrabold text-slate-900 dark:text-white">
          <span>Estimated Total</span>
          <span className="text-rose-600 dark:text-rose-400 text-base">
            {formatINR(priceBreakdown.totalPrice)}
          </span>
        </div>
      </div>

      {/* Primary Call-To-Action: Request to Book */}
      <div className="space-y-2.5">
        <button
          type="button"
          disabled={!isSelectedDateValid}
          onClick={onOpenBookingWizard}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isSelectedDateValid
              ? `Request to Book (${formatDisplayDate(selectedDate)})`
              : 'Select Available Date to Book'}
          </span>
        </button>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            No upfront card charge
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
            Instant Calendar Lock
          </span>
        </div>
      </div>
    </aside>
  );
};
