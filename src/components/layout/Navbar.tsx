import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  CalendarCheck2,
  Compass,
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { useBookingStore } from '../../store/useBookingStore';
import { useThemeStore } from '../../store/useThemeStore';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bookings = useBookingStore((s) => s.bookings);
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const activeBookingsCount = bookings.filter(
    (b) => b.status === 'Pending' || b.status === 'Confirmed'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-xl"
          aria-label="StarClinch Home — Artist Discovery"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 text-white shadow-lg shadow-rose-500/25 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Star<span className="text-rose-500">Clinch</span>
              </span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Live Booking
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Artist Discovery &amp; Event Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          className="hidden md:flex items-center gap-2"
          aria-label="Main Navigation"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                isActive || location.pathname.startsWith('/artists')
                  ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Compass className="h-4 w-4" />
            Discover Artists
          </NavLink>

          <a
            href="/#artist-gallery"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white transition-all"
          >
            Gallery
          </a>

          <a
            href="/#client-reviews"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white transition-all"
          >
            Reviews
          </a>

          <a
            href="/#event-blog"
            className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white transition-all"
          >
            Blog
          </a>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`
            }
          >
            <CalendarCheck2 className="h-4 w-4" />
            <span>My Bookings</span>
            <span
              className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white shadow-sm"
              aria-label={`${activeBookingsCount} active bookings`}
            >
              {activeBookingsCount}
            </span>
          </NavLink>
        </nav>

        {/* Right Controls: Theme Toggle & CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={
              theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-rose-500/40 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          <Link
            to="/bookings"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:from-rose-500 hover:to-pink-500 transition-all"
          >
            <CalendarCheck2 className="h-3.5 w-3.5" />
            Manage Bookings ({bookings.length})
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1.5">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                isActive
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`
            }
          >
            <Compass className="h-4 w-4" />
            Discover Artists (32 Verified Acts)
          </NavLink>
          <NavLink
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                isActive
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`
            }
          >
            <span className="flex items-center gap-2.5">
              <CalendarCheck2 className="h-4 w-4" />
              My Bookings Dashboard
            </span>
            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
              {activeBookingsCount} Active
            </span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
