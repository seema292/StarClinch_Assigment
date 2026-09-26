import React from 'react';
import { BadgeCheck, MessageSquareQuote, Star } from 'lucide-react';
import { ArtistReview } from '../../types';
import { formatDisplayDate } from '../../utils/formatters';

interface ReviewsSectionProps {
  artistName: string;
  rating: number;
  reviewCount: number;
  reviews: ArtistReview[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  artistName,
  rating,
  reviewCount,
  reviews,
}) => {
  return (
    <section
      aria-label="Verified Client Reviews"
      className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-sm space-y-6"
    >
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-rose-500" />
            <span>Verified Event Reviews</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Feedback from clients who booked {artistName} via StarClinch
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            <span className="font-display text-xl font-extrabold">
              {rating.toFixed(1)}
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold block">Overall Rating</span>
            <span>Based on {reviewCount} bookings</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <article
            key={rev.id}
            className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/60 p-4 space-y-2.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rev.clientName}
                  </h4>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="h-3 w-3" /> Verified Booking
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {rev.clientRole} •{' '}
                  <span className="font-semibold text-rose-500">
                    {rev.eventType}
                  </span>{' '}
                  ({formatDisplayDate(rev.eventDate)})
                </p>
              </div>

              <div
                className="flex items-center gap-0.5"
                aria-label={`Rated ${rev.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rev.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              “{rev.comment}”
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
