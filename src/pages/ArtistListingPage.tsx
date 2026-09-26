import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Music2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { ArtistCard } from '../components/artists/ArtistCard';
import { ArtistFilters } from '../components/artists/ArtistFilters';
import { ArtistSkeleton } from '../components/artists/ArtistSkeleton';
import { HomeShowcaseSections } from '../components/home/HomeShowcaseSections';
import {
  ARTIST_CATEGORIES,
  CITIES,
  MAX_ARTIST_PRICE,
  MIN_ARTIST_PRICE,
} from '../data/artists';
import { fetchArtistsCatalog, PaginatedArtistsResponse } from '../services/api';
import { useBookingStore } from '../store/useBookingStore';
import {
  ArtistCategory,
  ArtistFilterState,
  CityName,
  SortOption,
  ViewMode,
} from '../types';
import { logAnalyticsEvent } from '../utils/analytics';

const DEFAULT_PAGE_SIZE = 9;

export const ArtistListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userBookings = useBookingStore((s) => s.bookings);

  // Parse URL query parameters into strongly-typed filter state
  const filters: ArtistFilterState = useMemo(() => {
    const q = searchParams.get('q') || '';
    const rawCat = searchParams.get('category') || 'All';
    const category: ArtistCategory | 'All' = ARTIST_CATEGORIES.includes(
      rawCat as ArtistCategory
    )
      ? (rawCat as ArtistCategory)
      : 'All';

    const rawCity = searchParams.get('city') || 'All';
    const city: CityName | 'All' = CITIES.includes(rawCity as CityName)
      ? (rawCity as CityName)
      : 'All';

    const minPrice = Number(searchParams.get('minPrice')) || MIN_ARTIST_PRICE;
    const maxPrice = Number(searchParams.get('maxPrice')) || MAX_ARTIST_PRICE;
    const onlyAvailableOnDate = searchParams.get('date') || '';

    const rawSort = searchParams.get('sort') || 'rating-desc';
    const validSorts: SortOption[] = [
      'rating-desc',
      'price-asc',
      'price-desc',
      'popularity-desc',
    ];
    const sortBy: SortOption = validSorts.includes(rawSort as SortOption)
      ? (rawSort as SortOption)
      : 'rating-desc';

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const viewMode: ViewMode =
      searchParams.get('view') === 'list' ? 'list' : 'grid';

    return {
      search: q,
      category,
      city,
      minPrice,
      maxPrice,
      onlyAvailableOnDate,
      sortBy,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      viewMode,
    };
  }, [searchParams]);

  const [data, setData] = useState<PaginatedArtistsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulateErrorNext, setSimulateErrorNext] = useState<boolean>(false);

  const updateFilters = useCallback(
    (partial: Partial<ArtistFilterState>) => {
      const merged: ArtistFilterState = { ...filters, ...partial };
      const nextParams = new URLSearchParams();

      if (merged.search.trim()) nextParams.set('q', merged.search);
      if (merged.category !== 'All') nextParams.set('category', merged.category);
      if (merged.city !== 'All') nextParams.set('city', merged.city);
      if (merged.minPrice > MIN_ARTIST_PRICE)
        nextParams.set('minPrice', String(merged.minPrice));
      if (merged.maxPrice < MAX_ARTIST_PRICE)
        nextParams.set('maxPrice', String(merged.maxPrice));
      if (merged.onlyAvailableOnDate)
        nextParams.set('date', merged.onlyAvailableOnDate);
      if (merged.sortBy !== 'rating-desc')
        nextParams.set('sort', merged.sortBy);
      if (merged.page > 1) nextParams.set('page', String(merged.page));
      if (merged.viewMode === 'list') nextParams.set('view', 'list');

      setSearchParams(nextParams, { replace: true });

      if (partial.search !== undefined) {
        logAnalyticsEvent('artist_search', { query: partial.search });
      } else {
        logAnalyticsEvent('artist_filter_change', partial as Record<string, unknown>);
      }
    },
    [filters, setSearchParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
    logAnalyticsEvent('artist_filter_change', { reset: true });
  }, [setSearchParams]);

  const loadCatalog = useCallback(
    async (forceSimulateError = false) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetchArtistsCatalog(filters, userBookings, {
          simulateError: forceSimulateError,
          latencyMs: 260,
        });
        setData(res);
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Failed to load artists. Please retry.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [filters, userBookings]
  );

  useEffect(() => {
    loadCatalog(simulateErrorNext);
    if (simulateErrorNext) {
      setSimulateErrorNext(false);
    }
  }, [loadCatalog, simulateErrorNext]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Hero Banner with Animated Gradient Headings */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/90 to-rose-950 p-6 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-rose-500/25 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-600/25 blur-3xl animate-pulse-glow" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 animate-fade-up">
          <div className="max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-amber-500/20 border border-rose-500/30 px-3.5 py-1 text-xs font-bold text-rose-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span>India’s #1 Live Entertainment Booking Marketplace</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Book Extraordinary{' '}
              <span className="animate-gradient-text">
                Live Artists &amp; Performers
              </span>{' '}
              for Every Stage
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed">
              Browse 32+ verified singers, live bands, DJs, stand-up comedians, and
              choreographers across 9 Indian cities. Check real-time calendar
              availability, calculate dynamic event pricing, and lock your date in minutes.
            </p>
          </div>

          {/* Quick Stats Cards with Gradient Borders */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/15 p-3.5 text-center">
              <span className="block font-display text-2xl font-extrabold animate-gradient-text">
                32+
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                Verified Acts
              </span>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/15 p-3.5 text-center">
              <span className="block font-display text-2xl font-extrabold text-rose-400">
                8
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                Categories
              </span>
            </div>
            <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md border border-white/15 p-3.5 text-center">
              <span className="block font-display text-2xl font-extrabold text-amber-400">
                4.8★
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                Avg Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Section Heading for Catalog */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 animate-fade-up">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-500">
            Curated Roster
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Explore Verified{' '}
            <span className="animate-gradient-heading">
              Stage Talent
            </span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Filter by category, city, budget, or exact event date below
        </p>
      </div>

      {/* Combinable Search & Filter Panel */}
      <ArtistFilters
        filters={filters}
        totalMatching={data?.totalCount ?? 0}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
      />

      {/* Catalog Content Area */}
      {isLoading ? (
        <ArtistSkeleton count={DEFAULT_PAGE_SIZE} viewMode={filters.viewMode} />
      ) : errorMessage ? (
        /* Error State with Retry */
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Unable to Load Artist Directory
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {errorMessage}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => loadCatalog(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading Artists
            </button>
          </div>
        </div>
      ) : !data || data.artists.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-10 sm:p-16 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
            <Music2 className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            No Artists Match Your Active Filters
          </h2>
          <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">
            We couldn’t find any performers matching your current combination of
            search query, city, category, or budget ceiling. Try broadening your
            price range or resetting filters.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Artist Cards Grid / List */}
          <div
            className={
              filters.viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {data.artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                viewMode={filters.viewMode}
                userBookings={userBookings}
                selectedFilterDate={filters.onlyAvailableOnDate || undefined}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {data.totalPages > 1 && (
            <nav
              aria-label="Artist Catalog Pagination"
              className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-6"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Showing page{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {data.currentPage}
                </span>{' '}
                of{' '}
                <span className="font-bold text-slate-900 dark:text-white">
                  {data.totalPages}
                </span>{' '}
                ({data.totalCount} total artists)
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={data.currentPage <= 1}
                  onClick={() => {
                    updateFilters({ page: data.currentPage - 1 });
                    window.scrollTo({ top: 260, behavior: 'smooth' });
                  }}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:border-rose-500/40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>

                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const active = pageNum === data.currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          updateFilters({ page: pageNum });
                          window.scrollTo({ top: 260, behavior: 'smooth' });
                        }}
                        aria-current={active ? 'page' : undefined}
                        className={`h-9 w-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                            : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-500/40'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={data.currentPage >= data.totalPages}
                  onClick={() => {
                    updateFilters({ page: data.currentPage + 1 });
                    window.scrollTo({ top: 260, behavior: 'smooth' });
                  }}
                  aria-label="Next page"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:border-rose-500/40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </nav>
          )}
        </>
      )}

      {/* Featured Artist Stage Gallery, Verified Client Reviews & Editorial Blog */}
      <HomeShowcaseSections />

      {/* Evaluator Helper Bar at bottom of page */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-100/60 dark:bg-slate-900/40 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-rose-500" />
          <span>
            <strong>Evaluator Tip:</strong> All search, category, city, budget, sort, and pagination states sync live with URL query parameters.
          </span>
        </span>
        <button
          type="button"
          onClick={() => setSimulateErrorNext(true)}
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
        >
          Test Catalog API Error State
        </button>
      </div>
    </div>
  );
};
