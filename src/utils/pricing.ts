import { CityName, DateTier, EventType, PriceBreakdown } from '../types';
import { parseDateKey } from './availability';

export const EVENT_TYPE_MULTIPLIERS: Record<
  EventType,
  { multiplier: number; label: string; description: string }
> = {
  Wedding: {
    multiplier: 1.3,
    label: 'Wedding (+30%)',
    description: 'Includes custom bridal/sangeet setlist, extended soundcheck & ceremonial cues',
  },
  'Concert / Ticketed Show': {
    multiplier: 1.25,
    label: 'Concert / Ticketed (+25%)',
    description: 'Commercial performance rights, full stage rider & headline production set',
  },
  'Corporate Gala': {
    multiplier: 1.2,
    label: 'Corporate Gala (+20%)',
    description: 'Corporate compliance, formal attire, brand integration & rehearsal slot',
  },
  'Private Party': {
    multiplier: 1.0,
    label: 'Private Party (Base 1.0x)',
    description: 'Standard private celebration performance package',
  },
  'College Fest': {
    multiplier: 0.9,
    label: 'College Fest (-10% Youth Rate)',
    description: 'Special subsidised campus rate for student festivals & cultural nights',
  },
};

export const DATE_TIER_CONFIG: Record<
  DateTier,
  { multiplier: number; label: string }
> = {
  weekday: {
    multiplier: 1.0,
    label: 'Weekday Standard (Mon–Thu, 1.0x)',
  },
  'friday-sunday': {
    multiplier: 1.15,
    label: 'Weekend Demand (Fri / Sun, 1.15x)',
  },
  'saturday-peak': {
    multiplier: 1.25,
    label: 'Prime Saturday Night (1.25x)',
  },
  'festive-peak': {
    multiplier: 1.35,
    label: 'Peak Festive / Auspicious Date (1.35x)',
  },
};

const FESTIVE_MONTH_DAYS = new Set([
  '01-01', // New Year's Day
  '02-14', // Valentine's Day
  '10-24', // Festive Season
  '10-25',
  '11-12', // Peak Wedding / Diwali Season
  '11-24',
  '12-24', // Christmas Eve
  '12-25', // Christmas Day
  '12-31', // New Year's Eve
]);

/**
 * Determines the pricing tier and multiplier for a specific calendar date (`YYYY-MM-DD`).
 */
export function getDateTierInfo(dateStr: string): {
  tier: DateTier;
  multiplier: number;
  label: string;
} {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return {
      tier: 'weekday',
      multiplier: DATE_TIER_CONFIG.weekday.multiplier,
      label: DATE_TIER_CONFIG.weekday.label,
    };
  }

  const monthDay = dateStr.slice(5); // MM-DD
  if (FESTIVE_MONTH_DAYS.has(monthDay)) {
    return {
      tier: 'festive-peak',
      multiplier: DATE_TIER_CONFIG['festive-peak'].multiplier,
      label: DATE_TIER_CONFIG['festive-peak'].label,
    };
  }

  const dateObj = parseDateKey(dateStr);
  const dayOfWeek = dateObj.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat

  if (dayOfWeek === 6) {
    return {
      tier: 'saturday-peak',
      multiplier: DATE_TIER_CONFIG['saturday-peak'].multiplier,
      label: DATE_TIER_CONFIG['saturday-peak'].label,
    };
  }

  if (dayOfWeek === 0 || dayOfWeek === 5) {
    return {
      tier: 'friday-sunday',
      multiplier: DATE_TIER_CONFIG['friday-sunday'].multiplier,
      label: DATE_TIER_CONFIG['friday-sunday'].label,
    };
  }

  return {
    tier: 'weekday',
    multiplier: DATE_TIER_CONFIG.weekday.multiplier,
    label: DATE_TIER_CONFIG.weekday.label,
  };
}

/**
 * Computes audience scale surcharge rate and label based on expected guest count.
 */
export function getAudienceTierInfo(audienceSize: number): {
  rate: number;
  label: string;
} {
  const safeSize = Math.max(1, audienceSize || 100);
  if (safeSize <= 250) {
    return { rate: 0, label: 'Intimate Gathering (≤250 guests, +0%)' };
  }
  if (safeSize <= 750) {
    return { rate: 0.08, label: 'Mid-Scale Venue (251–750 guests, +8%)' };
  }
  if (safeSize <= 2000) {
    return { rate: 0.15, label: 'Large Ballroom / Lawn (751–2,000 guests, +15%)' };
  }
  return { rate: 0.25, label: 'Arena / Festival Scale (2,000+ guests, +25%)' };
}

export interface CalculatePriceParams {
  basePrice: number;
  dateStr: string;
  eventType: EventType;
  audienceSize?: number;
  artistHomeCity?: CityName;
  eventCity?: CityName;
}

export const OUTSTATION_TRAVEL_ALLOWANCE = 18000;
export const PLATFORM_AND_GST_RATE = 0.12;

/**
 * Pure, deterministic price estimator that calculates the full itemized breakdown
 * based on artist base price, event date tier, event type multiplier, audience scale,
 * and outstation travel logistics.
 */
export function calculateDynamicPrice({
  basePrice,
  dateStr,
  eventType,
  audienceSize = 200,
  artistHomeCity,
  eventCity,
}: CalculatePriceParams): PriceBreakdown {
  const cleanBase = Math.max(0, Math.round(basePrice));
  const dateInfo = getDateTierInfo(dateStr);
  const eventConfig = EVENT_TYPE_MULTIPLIERS[eventType] ?? EVENT_TYPE_MULTIPLIERS['Private Party'];
  const audienceInfo = getAudienceTierInfo(audienceSize);

  const dateSurcharge = Math.round(cleanBase * (dateInfo.multiplier - 1));
  const eventTypeAdjustment = Math.round(cleanBase * (eventConfig.multiplier - 1));
  const audienceSurcharge = Math.round(cleanBase * audienceInfo.rate);

  const isOutstation = Boolean(
    artistHomeCity && eventCity && artistHomeCity !== eventCity
  );
  const outstationTravelFee = isOutstation ? OUTSTATION_TRAVEL_ALLOWANCE : 0;

  const subtotal = Math.max(
    cleanBase * 0.5,
    cleanBase +
      dateSurcharge +
      eventTypeAdjustment +
      audienceSurcharge +
      outstationTravelFee
  );

  const roundedSubtotal = Math.round(subtotal);
  const platformAndGstFee = Math.round(roundedSubtotal * PLATFORM_AND_GST_RATE);
  const totalPrice = roundedSubtotal + platformAndGstFee;

  return {
    basePrice: cleanBase,
    dateStr,
    dateTier: dateInfo.tier,
    dateTierLabel: dateInfo.label,
    dateMultiplier: dateInfo.multiplier,
    dateSurcharge,
    eventType,
    eventTypeMultiplier: eventConfig.multiplier,
    eventTypeAdjustment,
    audienceSize,
    audienceSurcharge,
    audienceTierLabel: audienceInfo.label,
    isOutstation,
    outstationTravelFee,
    subtotal: roundedSubtotal,
    platformAndGstFee,
    totalPrice,
  };
}
