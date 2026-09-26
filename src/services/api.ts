import { ARTISTS_DATA } from '../data/artists';
import { Artist, ArtistFilterState, Booking } from '../types';
import { isDateAvailable, toDateKey } from '../utils/availability';

/**
 * Simulates realistic network latency.
 */
export function delay(ms: number = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface PaginatedArtistsResponse {
  artists: Artist[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Simulated async API endpoint for querying, filtering, sorting, and paginating artists.
 */
export async function fetchArtistsCatalog(
  filters: ArtistFilterState,
  userBookings: Booking[],
  options?: { simulateError?: boolean; latencyMs?: number }
): Promise<PaginatedArtistsResponse> {
  await delay(options?.latencyMs ?? 320);

  if (options?.simulateError) {
    throw new Error(
      'Unable to reach the StarClinch Artist Directory server. Please check your connection and retry.'
    );
  }

  const normalizedQuery = filters.search.trim().toLowerCase();
  const todayStr = toDateKey(new Date());

  const filtered = ARTISTS_DATA.filter((artist) => {
    // 1. Search by name, category, subcategory, tagline, or city
    if (normalizedQuery) {
      const matchesName = artist.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = artist.category.toLowerCase().includes(normalizedQuery);
      const matchesSubcategory = artist.subcategories.some((sub) =>
        sub.toLowerCase().includes(normalizedQuery)
      );
      const matchesTagline = artist.stageTagline.toLowerCase().includes(normalizedQuery);
      const matchesCity = artist.city.toLowerCase().includes(normalizedQuery);

      if (
        !matchesName &&
        !matchesCategory &&
        !matchesSubcategory &&
        !matchesTagline &&
        !matchesCity
      ) {
        return false;
      }
    }

    // 2. Category filter
    if (filters.category !== 'All' && artist.category !== filters.category) {
      return false;
    }

    // 3. City filter
    if (filters.city !== 'All' && artist.city !== filters.city) {
      return false;
    }

    // 4. Price range filter
    if (artist.basePrice < filters.minPrice || artist.basePrice > filters.maxPrice) {
      return false;
    }

    // 5. Optional quick date availability filter
    if (filters.onlyAvailableOnDate) {
      const available = isDateAvailable(
        filters.onlyAvailableOnDate,
        artist.id,
        artist.bookedDateRanges,
        userBookings,
        todayStr
      );
      if (!available) return false;
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.basePrice - b.basePrice;
      case 'price-desc':
        return b.basePrice - a.basePrice;
      case 'popularity-desc':
        return b.eventsCompleted - a.eventsCompleted;
      case 'rating-desc':
      default:
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.reviewCount - a.reviewCount;
    }
  });

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / filters.pageSize));
  const safePage = Math.min(Math.max(1, filters.page), totalPages);
  const startIdx = (safePage - 1) * filters.pageSize;
  const paginated = sorted.slice(startIdx, startIdx + filters.pageSize);

  return {
    artists: paginated,
    totalCount,
    totalPages,
    currentPage: safePage,
  };
}

/**
 * Simulated async API endpoint for fetching a single artist profile by ID or slug.
 */
export async function fetchArtistById(
  idOrSlug: string,
  options?: { simulateError?: boolean; latencyMs?: number }
): Promise<Artist> {
  await delay(options?.latencyMs ?? 280);

  if (options?.simulateError) {
    throw new Error(
      'Network error while loading artist profile details. Please click retry to reload.'
    );
  }

  const found = ARTISTS_DATA.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug
  );

  if (!found) {
    throw new Error(`Artist "${idOrSlug}" could not be found in our catalog.`);
  }

  return found;
}
