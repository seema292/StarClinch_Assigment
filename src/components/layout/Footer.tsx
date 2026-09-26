import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Headphones, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-purple-700 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                Star<span className="text-rose-500">Clinch</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              India’s premier live entertainment discovery &amp; booking platform.
              Discover 30+ verified singers, live bands, DJs, comedians, and dancers
              with transparent dynamic pricing and instant calendar availability.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                100% Payment Protection
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-rose-500" />
                Verified Stage Riders
              </span>
              <span className="flex items-center gap-1.5">
                <Headphones className="h-4 w-4 text-purple-500" />
                24/7 Event Concierge
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Popular Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/?category=Singer"
                  className="hover:text-rose-500 transition-colors"
                >
                  Bollywood &amp; Sufi Singers
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Live+Band"
                  className="hover:text-rose-500 transition-colors"
                >
                  Live Fusion &amp; Rock Bands
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=DJ"
                  className="hover:text-rose-500 transition-colors"
                >
                  Wedding &amp; Festival DJs
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Comedian"
                  className="hover:text-rose-500 transition-colors"
                >
                  Stand-Up Comedians
                </Link>
              </li>
              <li>
                <Link
                  to="/?category=Dancer"
                  className="hover:text-rose-500 transition-colors"
                >
                  Sangeet &amp; Cultural Dance Troupes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-rose-500 transition-colors">
                  Artist Catalog (32 Acts)
                </Link>
              </li>
              <li>
                <Link
                  to="/bookings"
                  className="hover:text-rose-500 transition-colors"
                >
                  My Bookings Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/?sort=rating-desc"
                  className="hover:text-rose-500 transition-colors"
                >
                  Top Rated Performers
                </Link>
              </li>
              <li>
                <Link
                  to="/?city=Mumbai"
                  className="hover:text-rose-500 transition-colors"
                >
                  Mumbai Artists
                </Link>
              </li>
              <li>
                <Link
                  to="/?city=Delhi+NCR"
                  className="hover:text-rose-500 transition-colors"
                >
                  Delhi NCR Artists
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800/80 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} StarClinch Live Entertainment Marketplace. Built with React, TypeScript &amp; Tailwind CSS.</p>
          <p className="mt-2 sm:mt-0">
            Real-time Availability Engine • Dynamic Multiplier Pricing • Zero Double-Booking
          </p>
        </div>
      </div>
    </footer>
  );
};
