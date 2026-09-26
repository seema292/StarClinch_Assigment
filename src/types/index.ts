export type ArtistCategory =
  | 'Singer'
  | 'Live Band'
  | 'DJ'
  | 'Comedian'
  | 'Dancer'
  | 'Instrumentalist'
  | 'Magician'
  | 'Emcee / Anchor';

export type CityName =
  | 'Mumbai'
  | 'Delhi NCR'
  | 'Bengaluru'
  | 'Hyderabad'
  | 'Pune'
  | 'Goa'
  | 'Jaipur'
  | 'Kolkata'
  | 'Chennai';

export type EventType =
  | 'Wedding'
  | 'Corporate Gala'
  | 'College Fest'
  | 'Private Party'
  | 'Concert / Ticketed Show';

/**
 * Data Model for Artist Availability:
 * Each artist has an array of `BookedDateRange` objects representing pre-existing commitments
 * (inclusive of `start` and `end` in YYYY-MM-DD format).
 * In addition, any active ('Pending' or 'Confirmed') booking made in the user's session
 * immediately locks that date for the respective artist to prevent double-booking.
 */
export interface BookedDateRange {
  start: string; // YYYY-MM-DD (inclusive)
  end: string;   // YYYY-MM-DD (inclusive)
  label?: string; // e.g. "Private Wedding in Udaipur", "Arena Tour"
}

export interface SampleVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  youtubeId: string;
  eventTag: string;
  views: string;
}

export interface ArtistReview {
  id: string;
  clientName: string;
  clientRole: string;
  eventType: EventType;
  eventDate: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  stageTagline: string;
  category: ArtistCategory;
  subcategories: string[];
  city: CityName;
  basePrice: number; // Starting price in INR
  rating: number;
  reviewCount: number;
  eventsCompleted: number;
  responseTime: string;
  verified: boolean;
  trending?: boolean;
  avatar: string;
  coverImage: string;
  gallery: string[];
  bio: string;
  performanceDuration: string;
  languages: string[];
  teamSize: string;
  travelReady: boolean;
  equipmentRequirements: string[];
  bookedDateRanges: BookedDateRange[];
  sampleVideos: SampleVideo[];
  reviews: ArtistReview[];
}

export type DateAvailabilityStatus =
  | 'available'
  | 'booked-artist'
  | 'booked-user'
  | 'past';

export type DateTier = 'weekday' | 'friday-sunday' | 'saturday-peak' | 'festive-peak';

export interface PriceBreakdown {
  basePrice: number;
  dateStr: string;
  dateTier: DateTier;
  dateTierLabel: string;
  dateMultiplier: number;
  dateSurcharge: number;
  eventType: EventType;
  eventTypeMultiplier: number;
  eventTypeAdjustment: number;
  audienceSize: number;
  audienceSurcharge: number;
  audienceTierLabel: string;
  isOutstation: boolean;
  outstationTravelFee: number;
  subtotal: number;
  platformAndGstFee: number;
  totalPrice: number;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface BookingContact {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
}

export interface Booking {
  id: string;
  referenceCode: string;
  artistId: string;
  artistName: string;
  artistCategory: ArtistCategory;
  artistAvatar: string;
  artistHomeCity: CityName;
  eventDate: string; // YYYY-MM-DD
  eventType: EventType;
  eventCity: CityName;
  audienceSize: number;
  venueNotes?: string;
  contact: BookingContact;
  priceBreakdown: PriceBreakdown;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  cancellationReason?: string;
}

export type SortOption = 'rating-desc' | 'price-asc' | 'price-desc' | 'popularity-desc';

export type ViewMode = 'grid' | 'list';

export interface ArtistFilterState {
  search: string;
  category: ArtistCategory | 'All';
  city: CityName | 'All';
  minPrice: number;
  maxPrice: number;
  onlyAvailableOnDate: string; // optional YYYY-MM-DD quick availability filter
  sortBy: SortOption;
  page: number;
  pageSize: number;
  viewMode: ViewMode;
}

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  action:
    | 'artist_search'
    | 'artist_filter_change'
    | 'artist_profile_view'
    | 'calendar_date_select'
    | 'price_estimate_change'
    | 'booking_wizard_open'
    | 'booking_step_complete'
    | 'booking_submit_attempt'
    | 'booking_submit_success'
    | 'booking_submit_error'
    | 'booking_date_edit'
    | 'booking_cancel'
    | 'booking_status_confirm';
  payload: Record<string, unknown>;
}
