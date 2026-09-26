import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  Clock,
  Flame,
  MapPin,
  Star,
} from 'lucide-react';
import { Artist, Booking, ViewMode } from '../../types';
import { findNextAvailableDate } from '../../utils/availability';
import { formatDisplayDate, formatINR } from '../../utils/formatters';

interface ArtistCardProps {
  artist: Artist;
  viewMode: ViewMode;
  userBookings: Booking[];
  selectedFilterDate?: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  viewMode,
  userBookings,
  selectedFilterDate,
}) => {
  const [imgSrc, setImgSrc] = useState(artist.avatar);

  const nextAvailableDate = findNextAvailableDate(
    artist.id,
    artist.bookedDateRanges,
    userBookings
  );

  const profileUrl = selectedFilterDate
    ? `/artists/${artist.id}?date=${encodeURIComponent(selectedFilterDate)}`
    : `/artists/${artist.id}`;

  if (viewMode === 'list') {
    return (
      <article className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-xl hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-56 sm:h-auto sm:w-64 shrink-0 overflow-hidden bg-slate-900">
          <img
            src={imgSrc}
            alt={`${artist.name} — ${artist.category} in ${artist.city}`}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent sm:hidden" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/15">
              {artist.category}
            </span>
            {artist.trending && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-600/95 px-2 py-1 text-[11px] font-bold text-white shadow">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    <Link to={profileUrl} className="focus:outline-none">
                      {artist.name}
                    </Link>
                  </h2>
                  {artist.verified && (
                    <BadgeCheck
                      className="h-4 w-4 text-rose-500 shrink-0"
                      aria-label="Verified Artist"
                    />
                  )}
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {artist.stageTagline}
                </p>
              </div>

              {/* Rating Pill */}
              <div className="flex items-center gap-1 rounded-xl bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{artist.rating.toFixed(1)}</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  ({artist.reviewCount})
                </span>
              </div>
            </div>

            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {artist.bio}
            </p>

            {/* Subcategory Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {artist.subcategories.map((sub) => (
                <span
                  key={sub}
                  className="rounded-md bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-3.5">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                {artist.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                Next Open: {formatDisplayDate(nextAvailableDate)}
              </span>
              <span className="hidden md:flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                Replies {artist.responseTime}
              </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Starting Price
                </span>
                <span className="font-display text-base font-extrabold text-slate-900 dark:text-white">
                  {formatINR(artist.basePrice)}
                </span>
              </div>

              <Link
                to={profileUrl}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-600 dark:hover:bg-rose-500 transition-colors"
              >
                <span>View Profile</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Default Grid Card
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-rose-500/40 dark:hover:border-rose-500/40 transition-all duration-300">
      {/* Card Image Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={`${artist.name} — ${artist.category} in ${artist.city}`}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white border border-white/15">
            {artist.category}
          </span>

          <div className="flex items-center gap-1.5">
            {artist.trending && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-rose-600/95 px-2 py-1 text-[11px] font-bold text-white shadow">
                <Flame className="h-3 w-3" /> Hot
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-950/80 backdrop-blur-md px-2 py-1 text-xs font-bold text-amber-400 border border-white/10">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {artist.rating.toFixed(1)}
              <span className="text-[10px] font-normal text-slate-300">
                ({artist.reviewCount})
              </span>
            </span>
          </div>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-display text-lg font-extrabold leading-tight tracking-tight">
                <Link to={profileUrl} className="hover:underline focus:outline-none">
                  {artist.name}
                </Link>
              </h2>
              {artist.verified && (
                <BadgeCheck
                  className="h-4 w-4 text-rose-400 shrink-0"
                  aria-label="Verified Artist"
                />
              )}
            </div>
            <p className="flex items-center gap-1 text-xs font-medium text-slate-300 mt-0.5">
              <MapPin className="h-3 w-3 text-rose-400 shrink-0" />
              {artist.city} • {artist.eventsCompleted}+ Shows
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <p className="line-clamp-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            {artist.stageTagline}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {artist.subcategories.slice(0, 3).map((sub) => (
              <span
                key={sub}
                className="rounded-md bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-3">
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <Calendar className="h-3 w-3" />
              Open: {formatDisplayDate(nextAvailableDate)}
            </span>
            <span>Replies {artist.responseTime}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Starting Price
              </span>
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                {formatINR(artist.basePrice)}
              </span>
            </div>

            <Link
              to={profileUrl}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-rose-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-600 dark:hover:bg-rose-500 transition-colors"
            >
              <span>Check Dates</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
