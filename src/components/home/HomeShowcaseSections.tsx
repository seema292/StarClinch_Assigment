import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartHandshake,
  MessageSquareQuote,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react';

interface GalleryArtistItem {
  id: string;
  artistId: string;
  artistName: string;
  category: string;
  imageUrl: string;
}

const GALLERY_ARTISTS: GalleryArtistItem[] = [
  {
    id: 'gal-1',
    artistId: 'artist-1',
    artistName: 'Aarav Mehta',
    category: 'Sufi & Bollywood Singer',
    imageUrl:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-2',
    artistId: 'artist-2',
    artistName: 'DJ Nyra Vance',
    category: 'Electronic & Afro-House DJ',
    imageUrl:
      'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-3',
    artistId: 'artist-3',
    artistName: 'The Velvet Raag Collective',
    category: 'Indo-Fusion Live Band',
    imageUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-4',
    artistId: 'artist-5',
    artistName: 'Nupur & Nritya Pulse',
    category: 'Classical & Contemporary Dance',
    imageUrl:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-5',
    artistId: 'artist-4',
    artistName: 'Kabir Taneja',
    category: 'Stand-Up Comedian',
    imageUrl:
      'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-6',
    artistId: 'artist-6',
    artistName: 'Rhea Kapoor',
    category: 'Indie-Pop & Acoustic Vocalist',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-7',
    artistId: 'artist-18',
    artistName: 'Aisha & Deccan Strings',
    category: 'Electric Violinist',
    imageUrl:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 'gal-8',
    artistId: 'artist-7',
    artistName: 'Zayan Malik Live',
    category: 'Punjabi Pop & Wedding Headliner',
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85',
  },
];

interface FeaturedTestimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientAvatar: string;
  artistId: string;
  artistName: string;
  artistCategory: string;
  eventType: string;
  eventCity: string;
  rating: number;
  quote: string;
  highlightMetric: string;
}

const FEATURED_TESTIMONIALS: FeaturedTestimonial[] = [
  {
    id: 'test-1',
    clientName: 'Arundhati & Siddharth Oberoi',
    clientRole: 'Hosts, Fairmont Jaipur Royal Wedding',
    clientAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    artistId: 'artist-1',
    artistName: 'Aarav Mehta',
    artistCategory: 'Singer',
    eventType: 'Destination Wedding Sangeet',
    eventCity: 'Jaipur',
    rating: 5,
    quote:
      'StarClinch made booking Aarav Mehta for our 500-guest Sangeet completely effortless. The real-time calendar locked our date immediately, the outstation travel pricing was 100% transparent, and Aarav kept the dance floor packed till 2:30 AM!',
    highlightMetric: '500+ Wedding Guests',
  },
  {
    id: 'test-2',
    clientName: 'Rajeev Chandrasekhar',
    clientRole: 'VP Brand Experience, Horizon Cloud India',
    clientAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    artistId: 'artist-3',
    artistName: 'The Velvet Raag Collective',
    artistCategory: 'Live Band',
    eventType: 'Annual Leadership Gala',
    eventCity: 'Delhi NCR',
    rating: 5,
    quote:
      'We used StarClinch’s dynamic price estimator to compare corporate gala packages across 4 bands in under 5 minutes. The Velvet Raag Collective delivered a stadium-level fusion show that our leadership team still talks about.',
    highlightMetric: '1,200 Corporate Guests',
  },
  {
    id: 'test-3',
    clientName: 'Tanvi Deshmukh',
    clientRole: 'Cultural Convener, Mood Indigo Campus Council',
    clientAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    artistId: 'artist-2',
    artistName: 'DJ Nyra Vance',
    artistCategory: 'DJ',
    eventType: 'College Fest Pro-Night',
    eventCity: 'Mumbai',
    rating: 5,
    quote:
      'The 10% youth campus festival discount in the StarClinch price calculator helped us fit a top-tier festival DJ within our student council budget. Instant email confirmation and zero middleman delays!',
    highlightMetric: '3,500+ Campus Crowd',
  },
  {
    id: 'test-4',
    clientName: 'Meera & Devansh Singhania',
    clientRole: 'Hosts, Taj Lake Palace Reception',
    clientAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    artistId: 'artist-18',
    artistName: 'Aisha & Deccan Strings',
    artistCategory: 'Instrumentalist',
    eventType: 'Luxury Sunset Cocktail Hour',
    eventCity: 'Udaipur',
    rating: 5,
    quote:
      'Aisha’s electric violin rendition of modern pop and AR Rahman classics as our guests arrived by boat created pure magic. Booking through StarClinch took less than 3 minutes with instant email confirmation.',
    highlightMetric: '350 VIP Guests',
  },
  {
    id: 'test-5',
    clientName: 'Karthik Subramanian',
    clientRole: 'Director of People, FinVerse Bengaluru',
    clientAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    artistId: 'artist-4',
    artistName: 'Kabir Taneja',
    artistCategory: 'Comedian',
    eventType: 'Annual Townhall & Awards Night',
    eventCity: 'Bengaluru',
    rating: 5,
    quote:
      'Kabir customized 20 minutes of clean tech-industry crowd work specifically for our engineering teams. Everyone was in splits, and the entire booking workflow was seamless from start to finish.',
    highlightMetric: '800+ Tech Employees',
  },
];

interface BlogPost {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishDate: string;
  authorName: string;
  authorRole: string;
  coverImage: string;
  fullContent: string[];
  keyTakeaways: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    tag: 'Wedding Entertainment Guide',
    title:
      'Sufi Unplugged vs. High-Energy DJ: How to Curate the Ultimate Sangeet Lineup',
    excerpt:
      'Discover how top luxury wedding planners combine a 90-minute live Sufi-Pop vocalist set with an Afro-Bollywood afterparty DJ for seamless multi-generational entertainment.',
    readTime: '4 min read',
    publishDate: '18 Sep 2026',
    authorName: 'Ananya Sen',
    authorRole: 'Head of Wedding Curation, StarClinch',
    coverImage:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    fullContent: [
      'When planning a modern Indian Sangeet or wedding reception, the biggest challenge hosts face is bridging the musical gap between older family members and younger friends ready for the dance floor.',
      'Our booking data across 3,000+ weddings shows that the highest-rated evenings follow a two-act arc: opening the first 90 minutes during family performances and dinner with a charismatic live Sufi-Bollywood singer or Indo-fusion band, followed by a high-octane DJ + live percussionist duo after 11:30 PM.',
      'Always lock your auspicious wedding ("Saya") dates at least 45–60 days in advance, as prime Saturday nights carry a 1.25x demand multiplier and top headliners book out months ahead.',
    ],
    keyTakeaways: [
      'Pair a 90-min Live Vocalist/Band with a late-night DJ for seamless flow.',
      'Verify sound rider requirements (In-Ear Monitors & Line Array PA) with your venue early.',
      'Use weekday or Friday slots to save 10–25% compared to prime Saturday nights.',
    ],
  },
  {
    id: 'blog-2',
    tag: 'Pricing & Transparency',
    title:
      '2026 Live Artist Pricing Decoded: Weekday vs. Weekend & Event Multipliers',
    excerpt:
      'Why does a Saturday wedding quote differ from a Wednesday corporate townhall? Here is an inside look at how artist base fees, technical riders, and travel allowances work.',
    readTime: '5 min read',
    publishDate: '10 Sep 2026',
    authorName: 'Vikramjit Kapoor',
    authorRole: 'VP Marketplace Operations, StarClinch',
    coverImage:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1000&q=80',
    fullContent: [
      'Historically, live entertainment pricing was opaque—clients had to wait days for manual quotes. At StarClinch, we standardized dynamic multiplier pricing so event hosts can calculate exact budgets in real time.',
      'An artist’s base fee covers a standard weekday private performance in their home city. Weekend dates (Friday/Sunday at 1.15x and Saturday at 1.25x) reflect peak calendar demand, while Wedding sets (1.30x) include custom bridal entry edits, extended family medleys, and early afternoon soundchecks.',
      'Conversely, college cultural festivals benefit from a 0.90x (-10%) youth campus rate because artists love performing for high-energy student arenas that amplify their social media reach.',
    ],
    keyTakeaways: [
      'Book an artist based in your event city to save ₹18,000+ in outstation travel logistics.',
      'Corporate Galas on Tuesdays–Thursdays enjoy 1.0x weekday base rates.',
      'Campus cultural nights automatically qualify for a 10% student festival subsidy.',
    ],
  },
  {
    id: 'blog-3',
    tag: 'Corporate Event Playbook',
    title:
      '7 Clean Stand-Up Comedians, Mentalists & Bands That Electrify Corporate Galas',
    excerpt:
      'Move beyond boring award ceremonies. Learn how psychological illusionists, iPad magicians, and clean observational comics turn annual townhalls into unforgettable nights.',
    readTime: '3 min read',
    publishDate: '02 Sep 2026',
    authorName: 'Rohan Kulkarni',
    authorRole: 'Enterprise Events Director, StarClinch',
    coverImage:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80',
    fullContent: [
      'After six hours of keynote presentations and slide decks, corporate audiences crave interactive, high-energy entertainment that feels personal to their company culture.',
      'Psychological mentalists and digital iPad illusionists have seen a 240% surge in corporate bookings this year—customizing stage predictions around product launches and CEO messages.',
      'For post-awards networking, pairing a bilingual emcee with a 45-minute clean observational comedy set guarantees boardroom-safe laughs before the live band takes over.',
    ],
    keyTakeaways: [
      'Brief your comedian or emcee 7 days prior with 3–5 inside company stories.',
      'Ensure a focused warm front spotlight and lapel/headset mic for mentalists.',
      'Schedule comedy or illusion sets right before dinner service for peak attention.',
    ],
  },
];

export const HomeShowcaseSections: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  const totalSlides = FEATURED_TESTIMONIALS.length;

  // Automatically advance the review slider every 3.2 seconds continuously
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [totalSlides]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="space-y-20 pt-8">
      {/* ====================================================================
          SECTION 1: CLEAN, ELEGANT ARTIST GALLERY WITH SUBTLE HOVER EFFECT
      ==================================================================== */}
      <section
        id="artist-gallery"
        aria-label="Featured Artist Portrait Gallery"
        className="space-y-8 scroll-mt-24 animate-fade-up"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-purple-500/15 border border-rose-500/25 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-500">
            <Camera className="h-3.5 w-3.5" />
            Featured Performers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Artist{' '}
            <span className="animate-gradient-heading">
              Spotlight Gallery
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Discover our most sought-after live vocalists, bands, DJs, and stage
            performers across India.
          </p>
        </div>

        {/* Clean 4-Column Portrait Gallery with Subtle Card Hover Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {GALLERY_ARTISTS.map((item) => (
            <Link
              key={item.id}
              to={`/artists/${item.artistId}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-rose-500/60 hover:shadow-xl hover:shadow-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <img
                src={item.imageUrl}
                alt={item.artistName}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Clean Bottom Gradient Overlay for Name Readability */}
              <div className="
                absolute inset-x-0 bottom-0 h-2/5
                bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent
                flex flex-col justify-end p-5 transition-all duration-300
              ">
                <h3 className="font-display text-lg font-extrabold text-white tracking-tight transition-colors duration-300 group-hover:text-rose-300">
                  {item.artistName}
                </h3>
                <p className="text-xs font-medium text-rose-300/90 group-hover:text-amber-300 transition-colors duration-300 mt-0.5">
                  {item.category}
                </p>
                <div className="mt-2 h-0.5 w-0 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300 group-hover:w-12" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: AUTOMATIC GRADIENT CLIENT REVIEWS SLIDER / CAROUSEL
      ==================================================================== */}
      <section
        id="client-reviews"
        aria-label="Verified Client Reviews Slider"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-rose-500/25 scroll-mt-24"
      >
        {/* Decorative Ambient Gradient Glows */}
        <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-rose-500/25 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl animate-pulse-glow" />

        <div className="relative z-10 space-y-8">
          {/* Header + Slider Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/30 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                <MessageSquareQuote className="h-3.5 w-3.5" />
                Verified Client Reviews • Auto-Play
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Loved by{' '}
                <span className="animate-gradient-text">
                  Wedding Hosts &amp; Brands
                </span>
              </h2>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-300">
                Real stories from verified events booked on StarClinch — sliding
                automatically every few seconds.
              </p>
            </div>

            {/* Trust Stats + Prev/Next Slider Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                <Trophy className="h-5 w-5 text-amber-400" />
                <div>
                  <span className="block font-display text-sm font-extrabold text-white">
                    4.88 / 5.0
                  </span>
                  <span className="block text-[10px] text-slate-300">
                    2,400+ Verified Events
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div>
                  <span className="block font-display text-sm font-extrabold text-white">
                    99.6% On-Time
                  </span>
                  <span className="block text-[10px] text-slate-300">
                    Protected Bookings
                  </span>
                </div>
              </div>

              {/* Carousel Prev / Next Arrows */}
              <div className="flex items-center gap-2 ml-auto lg:ml-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous client review"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 text-white hover:from-rose-500 hover:to-pink-600 hover:border-rose-400 transition-all cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next client review"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 text-white hover:from-rose-500 hover:to-pink-600 hover:border-rose-400 transition-all cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Smooth Horizontal Sliding Track */}
          <div className="overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {FEATURED_TESTIMONIALS.map((item, idx) => {
                const partnerItem =
                  FEATURED_TESTIMONIALS[(idx + 1) % totalSlides];
                return (
                  <div
                    key={item.id}
                    className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-6 px-0.5"
                  >
                    {[item, partnerItem].map((card, cardIdx) => (
                      <article
                        key={`${card.id}-${cardIdx}`}
                        className={`relative flex flex-col justify-between rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-rose-500/15 backdrop-blur-xl border border-white/15 p-6 sm:p-8 shadow-xl ${
                          cardIdx === 1 ? 'hidden lg:flex' : 'flex'
                        }`}
                      >
                        <Quote className="pointer-events-none absolute top-5 right-6 h-12 w-12 text-rose-400/15" />

                        <div className="space-y-5">
                          {/* Stars & Verified Metric Pill */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div
                              className="flex items-center gap-1"
                              aria-label={`Rated ${card.rating} out of 5 stars`}
                            >
                              {Array.from({ length: card.rating }, (_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-amber-400 text-amber-400"
                                />
                              ))}
                            </div>

                            <span className="rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 px-3 py-1 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              {card.highlightMetric}
                            </span>
                          </div>

                          {/* Review Quote */}
                          <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-medium">
                            “{card.quote}”
                          </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Client Info */}
                          <div className="flex items-center gap-3.5">
                            <img
                              src={card.clientAvatar}
                              alt={card.clientName}
                              className="h-12 w-12 rounded-full object-cover border-2 border-rose-400/50"
                            />
                            <div>
                              <h3 className="text-sm font-extrabold text-white">
                                {card.clientName}
                              </h3>
                              <p className="text-xs text-slate-300">
                                {card.clientRole}
                              </p>
                              <span className="inline-block text-[11px] font-semibold text-rose-300 mt-0.5">
                                {card.eventType} • {card.eventCity}
                              </span>
                            </div>
                          </div>

                          {/* Booked Artist Pill */}
                          <Link
                            to={`/artists/${card.artistId}`}
                            className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-2xl bg-gradient-to-r from-rose-500/25 to-purple-500/25 border border-rose-400/35 px-3.5 py-2 text-xs font-bold text-white hover:from-rose-500 hover:to-pink-600 transition-all"
                          >
                            <span>Booked: {card.artistName}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slider Pagination Dots & Slide Counter */}
          <div className="flex items-center justify-between pt-2">
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Select review slide"
            >
              {FEATURED_TESTIMONIALS.map((item, index) => {
                const isActive = index === activeSlide;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Go to review ${index + 1} by ${item.clientName}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-9 bg-gradient-to-r from-rose-400 to-amber-400'
                        : 'w-2.5 bg-white/25 hover:bg-white/50'
                    }`}
                  />
                );
              })}
            </div>

            <span className="text-xs font-bold text-slate-300">
              Slide {activeSlide + 1} of {totalSlides}
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: EDITORIAL BLOG & EVENT PLANNING INSIGHTS
      ==================================================================== */}
      <section
        id="event-blog"
        aria-label="StarClinch Stage Craft and Event Planning Blog"
        className="space-y-6 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              <BookOpen className="h-3.5 w-3.5" />
              Stage Craft &amp; Event Insights
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Latest from the{' '}
              <span className="animate-gradient-heading">
                StarClinch Blog
              </span>
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Expert guides on wedding sangeet curation, artist pricing
              multipliers, technical sound riders, and corporate entertainment.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <HeartHandshake className="h-4 w-4 text-rose-500" />
            Click any article card to read the full guide
          </span>
        </div>

        {/* 3-Column Blog Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-rose-500/40 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                <span className="absolute top-3 left-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-rose-400">
                  {post.tag}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-slate-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-rose-400" />
                    {post.publishDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                    {post.readTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
                <div className="space-y-2.5">
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors leading-snug">
                    <button
                      type="button"
                      onClick={() => setActiveBlog(post)}
                      className="text-left focus:outline-none cursor-pointer"
                    >
                      {post.title}
                    </button>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="block font-bold text-slate-800 dark:text-slate-200">
                      {post.authorName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {post.authorRole}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveBlog(post)}
                    className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500/15 to-purple-500/15 px-3 py-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:from-rose-600 hover:to-pink-600 hover:text-white transition-all cursor-pointer"
                  >
                    <span>Read Guide</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ====================================================================
          BLOG READER MODAL
      ==================================================================== */}
      {activeBlog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto"
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
            <div className="relative h-56 w-full bg-slate-950">
              <img
                src={activeBlog.coverImage}
                alt={activeBlog.title}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                type="button"
                onClick={() => setActiveBlog(null)}
                aria-label="Close article"
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-rose-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <span className="inline-block rounded-lg bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold">
                  {activeBlog.tag}
                </span>
                <h2
                  id="blog-modal-title"
                  className="font-display text-xl sm:text-2xl font-extrabold leading-snug"
                >
                  {activeBlog.title}
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs text-slate-500">
                <span>
                  By{' '}
                  <strong className="text-slate-900 dark:text-white">
                    {activeBlog.authorName}
                  </strong>{' '}
                  ({activeBlog.authorRole})
                </span>
                <span>
                  {activeBlog.publishDate} • {activeBlog.readTime}
                </span>
              </div>

              {activeBlog.fullContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <div className="rounded-2xl border border-rose-500/25 bg-rose-500/5 p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-rose-500">
                  <Sparkles className="h-4 w-4" />
                  Key Event Planning Takeaways
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {activeBlog.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveBlog(null)}
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-rose-500 transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
