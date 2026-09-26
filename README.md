# StarClinch — Artist Discovery & Live Entertainment Booking Web App

A responsive, production-grade **Artist Discovery & Booking Marketplace** built from scratch with **React 19, TypeScript (Strict Mode), Vite, Tailwind CSS v4, Zustand, and Vitest**.

---

## 1. Quick Start & Local Setup

### Prerequisites

- **Node.js** `v18+` (tested on `v24.18.0`)
- **npm** `v9+`

### Installation & Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local development server (http://localhost:5173)
npm run dev

# 3. Run unit tests (Pricing & Availability engines via Vitest)
npm test

# 4. Type-check and build production bundle
npm run build

# 5. Preview production build locally
npm run preview
```

---

## 2. Feature Matrix (Core + All Bonus Requirements)

| Requirement Area                | Implementation Highlights                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **3.1 Artist Listing Page**     | • **32 verified artists** across **8 categories** (`Singer`, `Live Band`, `DJ`, `Comedian`, `Dancer`, `Instrumentalist`, `Magician`, `Emcee / Anchor`) and **9 Indian cities**.<br>• Combinable **Search** (name, category, genre, tagline, city) + **Category** + **City** + **Price Range slider & quick budget presets** + **Available Date filter**.<br>• Sort by **Rating**, **Price (Low → High)**, **Price (High → Low)**, and **Popularity**.<br>• **Grid & List view toggle** + **Pagination** (9 per page) with shimmer skeletons (`ArtistSkeleton`) for zero layout jank.<br>• Thoughtful **Empty State** (with 1-click Reset) and **Error State** (with Retry).                                              |
| **3.2 Artist Profile Page**     | • Full hero cover, verified badge, bio, stage specs, technical sound rider, **Photo Carousel + Fullscreen Lightbox**, **Sample Performance Videos (YouTube modal)**, and **Verified Client Reviews**.<br>• **Interactive Month-View Availability Calendar** (keyboard-accessible via arrow keys) showing **Available**, **Pre-Booked (`BookedDateRange[]`)**, **Booked by You (`Session Lock`)**, and **Weekend Peak** indicators.<br>• **Dynamic Price Estimator** with live itemized breakdown.<br>• **"Request to Book" CTA** strictly gated until a valid, available date is selected.                                                                                                                               |
| **3.3 Multi-Step Booking Flow** | • **Step 1 (Event Details)**: Date (validated live against availability), Event Type, Event City (local vs. outstation detection), Expected Audience Size, and Venue Notes.<br>• **Step 2 (Contact Details)**: Full Name, Email, Mobile Phone (`+91`/10-digit regex validation), and Organization with inline `aria-invalid` error feedback.<br>• **Step 3 (Review & Confirm)**: Itemized summary + simulated async API call (`900ms`) with **Loading**, **Success**, and **Retryable Network Error** states (includes an in-UI _"Simulate API Failure"_ checkbox for easy testing).<br>• **Zero Double-Booking**: Confirmed/Pending bookings immediately lock the date on the artist's calendar without a page refresh. |
| **3.4 "My Bookings" Dashboard** | • Persisted in `localStorage` via Zustand (`starclinch-bookings-v1`) and pre-seeded with 2 sample bookings (`Pending` & `Confirmed`) + a **"Reset Demo Data"** button.<br>• Filter by `All`, `Pending`, `Confirmed`, or `Cancelled`.<br>• **Cancel Booking**: Confirmation modal with cancellation reason; immediately releases the date back to the artist's calendar.<br>• **Edit Event Date**: Reschedule modal for `Pending` bookings embedding the artist's live calendar to re-validate availability and recalculate dynamic pricing.                                                                                                                                                                              |
| **6. Bonus Features**           | • **Dark / Light Mode Toggle** persisted in `localStorage`.<br>• **15 Unit Tests (Vitest)** covering `pricing.ts` and `availability.ts`.<br>• **URL-Synced Filters** (`?q=&category=&city=&maxPrice=&date=&sort=&page=&view=`) with a **"Share Filters"** copy link button.<br>• **Live Analytics Telemetry Logger** logging structured events to `console.info` and an interactive floating **Analytics Event Stream Drawer**.                                                                                                                                                                                                                                                                                          |

---

## 3. Architecture & Folder Structure

```text
src/
├── types/
│   └── index.ts                  # Strict TypeScript interfaces for Artists, Bookings, Pricing, Filters
├── data/
│   └── artists.ts                # 32 mock artists with relative BookedDateRanges, galleries, videos, reviews
├── utils/
│   ├── availability.ts           # Pure functions for date range collision, double-booking lock & 42-cell grid
│   ├── availability.test.ts      # Vitest unit tests for availability & double-booking prevention
│   ├── pricing.ts                # Pure functions for dynamic multipliers & itemized INR breakdown
│   ├── pricing.test.ts           # Vitest unit tests for weekday/weekend/festive & event type pricing
│   ├── validation.ts             # Step 1 & Step 2 form validation rules (email/Indian phone regex)
│   ├── analytics.ts              # Console + reactive in-app analytics telemetry emitter
│   └── formatters.ts             # Indian numbering system (₹1,85,000) & readable date formatters
├── services/
│   └── api.ts                    # Simulated async API layer with latency & network error simulation
├── store/
│   ├── useBookingStore.ts        # Persisted Zustand store managing bookings & real-time calendar locks
│   └── useThemeStore.ts          # Persisted dark/light mode state
├── components/
│   ├── layout/                   # Navbar, Footer, AnalyticsDrawer
│   ├── artists/                  # ArtistCard (Grid/List), ArtistFilters, ArtistSkeleton
│   ├── profile/                  # AvailabilityCalendar, PriceEstimator, MediaGallery, ReviewsSection
│   ├── booking/                  # BookingWizardModal (3-step wizard + retryable error handling)
│   └── dashboard/                # CancelBookingModal, EditBookingDateModal
└── pages/
    ├── ArtistListingPage.tsx     # Catalog view synced with URL search params
    ├── ArtistProfilePage.tsx     # Detailed artist profile, calendar, estimator & sticky CTA
    └── MyBookingsPage.tsx        # Personal bookings dashboard
```

---

## 4. Data Models & Technical Decisions

### 4.1 Availability Data Model (`BookedDateRange[]` + Session Locks)

Each artist defines pre-existing commitments using an array of inclusive ISO date ranges:

```ts
export interface BookedDateRange {
  start: string; // 'YYYY-MM-DD' (inclusive)
  end: string; // 'YYYY-MM-DD' (inclusive)
  label?: string; // e.g., 'Royal Palace Sangeet', 'Arena Tour Stopover'
}
```

When determining availability for a target date (`getDateAvailabilityStatus` in `src/utils/availability.ts`), the engine evaluates four states in strict priority order:

1. **`past`**: `dateStr < todayStr` (disabled).
2. **`booked-user`**: Matches an active (`Pending` or `Confirmed`) booking in `useBookingStore` for that `artistId`. When editing an existing pending booking's date, `excludeBookingId` is passed so the booking does not collide with itself.
3. **`booked-artist`**: `dateStr >= range.start && dateStr <= range.end` for any range in `artist.bookedDateRanges`.
4. **`available`**: Open for selection and booking.

### 4.2 Dynamic Price Estimator Formula

The price calculator (`calculateDynamicPrice` in `src/utils/pricing.ts`) computes a transparent, itemized total:

- **Date Tier Multiplier (`dateMultiplier`)**:
  - `Weekday (Mon–Thu)`: **1.00x** (Base)
  - `Weekend (Fri & Sun)`: **1.15x** (`+15%`)
  - `Prime Saturday Night`: **1.25x** (`+25%`)
  - `Peak Festive / Auspicious Dates` (e.g., Dec 24–25, Dec 31, Feb 14): **1.35x** (`+35%`)
- **Event Type Multiplier (`eventTypeMultiplier`)**:
  - `Wedding`: **1.30x** (`+30%` bespoke setlist & extended ceremony cues)
  - `Concert / Ticketed Show`: **1.25x** (`+25%` commercial licensing & full rider)
  - `Corporate Gala`: **1.20x** (`+20%` brand integration & rehearsal slot)
  - `Private Party`: **1.00x** (Base)
  - `College Fest`: **0.90x** (`-10%` subsidised youth/campus rate)
- **Audience Scale Adjustment**:
  - `≤ 250 guests`: `+0%` | `251–750 guests`: `+8%` | `751–2,000 guests`: `+15%` | `2,000+ guests`: `+25%` of base fee.
- **Outstation Travel & Logistics**:
  - `₹0` when `eventCity === artist.city`, or flat **`₹18,000`** when performing outstation.
- **Platform Protection & GST**: `12%` applied to the subtotal.

### 4.3 Why Zustand + LocalStorage Persistence?

- **Right-sized complexity**: Redux Toolkit introduces unnecessary boilerplate for a client-side marketplace with two primary shared domains (Bookings & Theme), while plain React Context causes broad re-renders across catalog cards when booking state updates.
- **Cross-route synchronization**: Zustand allows `ArtistProfilePage`, `BookingWizardModal`, and `MyBookingsPage` to share atomic mutations (`createBooking`, `updateBookingDate`, `cancelBooking`) that immediately update calendar availability and persisted `localStorage` state without page reloads.

---

## 5. Trade-Offs & Future Improvements

- **Trade-Offs Made**:
  - Used client-side filtering/pagination inside a simulated async service (`src/services/api.ts`) with artificial network latency (`260ms–900ms`) rather than spinning up a separate Node/Postgres backend, keeping deployment zero-config on Vercel/Netlify.
  - Pre-anchored artist booked date ranges dynamically around the current month (`buildArtistBookedRanges`) so that evaluators always see realistic booked and open dates regardless of which month the submission is reviewed.
- **With More Time**:
  - Add multi-day date range selection in the booking wizard for multi-day destination weddings.
  - Integrate PDF invoice / contract generation and calendar `.ics` export on the booking confirmation screen.
  - Add Playwright E2E tests alongside the existing Vitest unit test suite.
