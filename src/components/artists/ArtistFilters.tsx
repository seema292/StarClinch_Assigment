import React, { useState } from 'react';
import {
  Calendar,
  Check,
  LayoutGrid,
  List,
  MapPin,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ARTIST_CATEGORIES,
  CITIES,
  MAX_ARTIST_PRICE,
  MIN_ARTIST_PRICE,
} from '../../data/artists';
import {
  ArtistCategory,
  ArtistFilterState,
  CityName,
  SortOption,
  ViewMode,
} from '../../types';
import { toDateKey } from '../../utils/availability';
import { formatCompactINR, formatINR } from '../../utils/formatters';

interface ArtistFiltersProps {
  filters: ArtistFilterState;
  totalMatching: number;
  onUpdateFilters: (partial: Partial<ArtistFilterState>) => void;
  onResetFilters: () => void;
}

export const ArtistFilters: React.FC<ArtistFiltersProps> = ({
  filters,
  totalMatching,
  onUpdateFilters,
  onResetFilters,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.category !== 'All' ||
    filters.city !== 'All' ||
    filters.minPrice > MIN_ARTIST_PRICE ||
    filters.maxPrice < MAX_ARTIST_PRICE ||
    filters.onlyAvailableOnDate !== '';

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback
    }
  };

  const todayStr = toDateKey(new Date());

  return (
    <section
      aria-label="Artist Search and Filters"
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-4 sm:p-6 shadow-sm space-y-5"
    >
      {/* Top Row: Search Bar + City + Sort + View Mode */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Search Input */}
        <div className="relative md:col-span-5">
          <label htmlFor="artist-search-input" className="sr-only">
            Search artists by name, category, genre, or city
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="artist-search-input"
            type="search"
            value={filters.search}
            onChange={(e) =>
              onUpdateFilters({ search: e.target.value, page: 1 })
            }
            placeholder="Search by name, category (e.g. Sufi, DJ, Standup, Band)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-9 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ search: '', page: 1 })}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* City Filter Dropdown */}
        <div className="relative md:col-span-3">
          <label htmlFor="city-filter-select" className="sr-only">
            Filter by Base City
          </label>
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-500" />
          <select
            id="city-filter-select"
            value={filters.city}
            onChange={(e) =>
              onUpdateFilters({
                city: e.target.value as CityName | 'All',
                page: 1,
              })
            }
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <option value="All">All Cities (Pan-India)</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative md:col-span-3">
          <label htmlFor="sort-filter-select" className="sr-only">
            Sort artists by
          </label>
          <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
          <select
            id="sort-filter-select"
            value={filters.sortBy}
            onChange={(e) =>
              onUpdateFilters({
                sortBy: e.target.value as SortOption,
                page: 1,
              })
            }
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-9 pr-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
          >
            <option value="rating-desc">Sort: Highest Rated</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="popularity-desc">Sort: Most Shows Booked</option>
          </select>
        </div>

        {/* View Toggle (Grid / List) */}
        <div
          className="flex items-center justify-end md:col-span-1 gap-1"
          role="group"
          aria-label="Catalog View Mode"
        >
          {(['grid', 'list'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdateFilters({ viewMode: mode })}
              aria-pressed={filters.viewMode === mode}
              aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
                filters.viewMode === mode
                  ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode === 'grid' ? (
                <LayoutGrid className="h-4 w-4" />
              ) : (
                <List className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => onUpdateFilters({ category: 'All', page: 1 })}
          aria-pressed={filters.category === 'All'}
          className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
            filters.category === 'All'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          All Categories
        </button>

        {ARTIST_CATEGORIES.map((cat: ArtistCategory) => {
          const active = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() =>
                onUpdateFilters({
                  category: active ? 'All' : cat,
                  page: 1,
                })
              }
              aria-pressed={active}
              className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Price Range Slider + Quick Budget Presets + Available Date Filter */}
      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4 lg:grid-cols-12 items-center">
        {/* Price Range Controls */}
        <div className="lg:col-span-6 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label
              htmlFor="max-price-range"
              className="font-semibold text-slate-700 dark:text-slate-300"
            >
              Budget Range:{' '}
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {formatINR(filters.minPrice)} – {formatINR(filters.maxPrice)}
              </span>
            </label>

            {/* Quick Budget Chips */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    minPrice: MIN_ARTIST_PRICE,
                    maxPrice: 100000,
                    page: 1,
                  })
                }
                className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-colors cursor-pointer ${
                  filters.maxPrice === 100000 && filters.minPrice === MIN_ARTIST_PRICE
                    ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ≤ ₹1L
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    minPrice: 100000,
                    maxPrice: 200000,
                    page: 1,
                  })
                }
                className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-colors cursor-pointer ${
                  filters.minPrice === 100000 && filters.maxPrice === 200000
                    ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                ₹1L–₹2L
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    minPrice: MIN_ARTIST_PRICE,
                    maxPrice: MAX_ARTIST_PRICE,
                    page: 1,
                  })
                }
                className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold border transition-colors cursor-pointer ${
                  filters.minPrice === MIN_ARTIST_PRICE &&
                  filters.maxPrice === MAX_ARTIST_PRICE
                    ? 'border-rose-500 bg-rose-500/10 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Any Budget
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-slate-400">
              {formatCompactINR(MIN_ARTIST_PRICE)}
            </span>
            <input
              id="max-price-range"
              type="range"
              min={MIN_ARTIST_PRICE}
              max={MAX_ARTIST_PRICE}
              step={5000}
              value={filters.maxPrice}
              onChange={(e) => {
                const nextMax = Number(e.target.value);
                onUpdateFilters({
                  maxPrice: nextMax,
                  minPrice: Math.min(filters.minPrice, nextMax),
                  page: 1,
                });
              }}
              aria-label="Maximum artist starting price"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800 accent-rose-600"
            />
            <span className="text-[11px] font-medium text-slate-400">
              {formatCompactINR(MAX_ARTIST_PRICE)}
            </span>
          </div>
        </div>

        {/* Event Date Availability Filter */}
        <div className="lg:col-span-3">
          <label
            htmlFor="available-date-filter"
            className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1"
          >
            Check Date Availability (Optional)
          </label>
          <div className="relative flex items-center">
            <Calendar className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-emerald-500" />
            <input
              id="available-date-filter"
              type="date"
              min={todayStr}
              value={filters.onlyAvailableOnDate}
              onChange={(e) =>
                onUpdateFilters({
                  onlyAvailableOnDate: e.target.value,
                  page: 1,
                })
              }
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-7 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:border-rose-500 focus:outline-none"
            />
            {filters.onlyAvailableOnDate && (
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({ onlyAvailableOnDate: '', page: 1 })
                }
                aria-label="Clear date filter"
                className="absolute right-2 text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results Counter + Share URL + Reset */}
        <div className="lg:col-span-3 flex flex-wrap items-center justify-between lg:justify-end gap-2">
          <span
            className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            aria-live="polite"
          >
            Showing <strong className="text-rose-500">{totalMatching}</strong>{' '}
            {totalMatching === 1 ? 'artist' : 'artists'}
          </span>

          <button
            type="button"
            onClick={handleCopyShareLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-500/40 transition-colors cursor-pointer"
            title="Copy URL with active filters"
          >
            {copiedUrl ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied Link</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-rose-500" />
                <span>Share Filters</span>
              </>
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
