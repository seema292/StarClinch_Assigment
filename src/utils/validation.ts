import { BookedDateRange, Booking, CityName, EventType } from '../types';
import { getDateAvailabilityStatus, toDateKey } from './availability';

export interface Step1EventData {
  eventDate: string;
  eventType: EventType;
  eventCity: CityName;
  audienceSize: number;
  venueNotes?: string;
}

export interface Step2ContactData {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
}

export interface ValidationErrors<T> {
  [K in keyof T]?: string;
}

/**
 * Validates Step 1 (Event Details) including live availability check.
 */
export function validateEventDetails(
  data: Step1EventData,
  artistId: string,
  bookedRanges: BookedDateRange[],
  userBookings: Booking[]
): Partial<Record<keyof Step1EventData, string>> {
  const errors: Partial<Record<keyof Step1EventData, string>> = {};

  if (!data.eventDate) {
    errors.eventDate = 'Please select an event date from the calendar.';
  } else {
    const availability = getDateAvailabilityStatus(
      data.eventDate,
      artistId,
      bookedRanges,
      userBookings,
      toDateKey(new Date())
    );
    if (availability.status !== 'available') {
      errors.eventDate =
        availability.reason ||
        'This date is unavailable or already booked. Please choose an open date.';
    }
  }

  if (!data.eventType) {
    errors.eventType = 'Please select an event type.';
  }

  if (!data.eventCity) {
    errors.eventCity = 'Please select the event city.';
  }

  if (!data.audienceSize || Number.isNaN(Number(data.audienceSize))) {
    errors.audienceSize = 'Please enter expected audience size.';
  } else if (data.audienceSize < 15) {
    errors.audienceSize = 'Minimum expected audience size is 15 guests.';
  } else if (data.audienceSize > 50000) {
    errors.audienceSize = 'For stadium events above 50,000 guests, please enter up to 50,000.';
  }

  return errors;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Accepts Indian 10-digit mobile numbers (starting 6-9), optional +91/0 prefix, or international 10-14 digits
const PHONE_REGEX = /^(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}$|^\+?[1-9]\d{9,13}$/;

/**
 * Validates Step 2 (Client Contact Details) with strict format checks for name, email, and phone.
 */
export function validateContactDetails(
  data: Step2ContactData
): Partial<Record<keyof Step2ContactData, string>> {
  const errors: Partial<Record<keyof Step2ContactData, string>> = {};

  const trimmedName = data.fullName.trim();
  if (!trimmedName) {
    errors.fullName = 'Full name is required.';
  } else if (trimmedName.length < 3) {
    errors.fullName = 'Name must be at least 3 characters long.';
  } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
    errors.fullName = 'Name should only contain letters and standard punctuation.';
  }

  const trimmedEmail = data.email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email address is required for booking confirmation.';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address (e.g., priya@company.in).';
  }

  const normalizedPhone = data.phone.replace(/[\s()-]/g, '');
  if (!normalizedPhone) {
    errors.phone = 'Mobile number is required for artist coordination.';
  } else if (!PHONE_REGEX.test(normalizedPhone)) {
    errors.phone =
      'Enter a valid 10-digit Indian mobile number (starting with 6–9) or international number.';
  }

  return errors;
}
