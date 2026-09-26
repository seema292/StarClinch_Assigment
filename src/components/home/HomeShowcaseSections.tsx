import React, { useState } from 'react';
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
  Eye,
  HeartHandshake,
  MapPin,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react';

interface GalleryMoment {
  id: string;
  title: string;
  subtitle: string;
  artistId: string;
  artistName: string;
  categoryTag: 'Weddings & Sangeet' | 'Concerts & Festivals' | 'Corporate Galas';
  location: string;
  imageUrl: string;
  spanClass: string;
}

const GALLERY_MOMENTS: GalleryMoment[] = [
  {
    id: 'gal-1',
    title: 'Royal Udaipur Palace Sangeet Finale',
    subtitle: '600 Guests • Sufi & Bollywood Unplugged',
    artistId: 'artist-1',
    artistName: 'Aarav Mehta',
    categoryTag: 'Weddings & Sangeet',
    location: 'Udaipur / Mumbai',
    imageUrl:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80',
    spanClass: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 'gal-2',
    title: 'Mainstage Afro-House & Pyrotechnic Drop',
    subtitle: 'Sunburn Arena Afterparty Set',
    artistId: 'artist-2',
    artistName: 'DJ Nyra Vance',
    categoryTag: 'Concerts & Festivals',
    location: 'Mumbai',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'gal-3',
    title: 'Indo-Fusion Folk Rock Stadium Singalong',
    subtitle: 'IIT Annual Cultural Headline Night',
    artistId: 'artist-3',
    artistName: 'The Velvet Raag Collective',
    categoryTag: 'Concerts & Festivals',
    location: 'Delhi NCR',
    imageUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'gal-4',
    title: 'Theatrical Kathak & LED Bridal Entry',
    subtitle: '10-Dancer Synchronized Heritage Showcase',
    artistId: 'artist-5',
    artistName: 'Nupur & The Nritya Pulse Crew',
    categoryTag: 'Weddings & Sangeet',
    location: 'Jaipur',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'gal-5',
    title: 'Global FinTech Leadership Awards Night',
    subtitle: 'Stand-Up Comedy & Executive Roast',
    artistId: 'artist-4',
    artistName: 'Kabir Taneja',
    categoryTag: 'Corporate Galas',
    location: 'Bengaluru',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    spanClass: 'md:col-span-1 md:row-span-1',
  },
  {
    id: 'gal-6',
    title: 'Bridgerton-Style Electric Violin Cocktail Hour',
    subtitle: 'Luxury Sunset Lawn Reception',
    artistId: 'artist-18',
    artistName: 'Aisha & The Deccan Strings',
    categoryTag: 'Corporate Galas',
    location: 'Hyderabad',
    imageUrl:
      'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    spanClass: 'md:col-span-2 md:row-span-1',
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
      'StarClinch made booking Aarav Mehta for our 500-guest Sangeet completely stress-free. The real-time calendar locked our date immediately, the outstation travel pricing was 100% transparent, and Aarav kept the dance floor packed till 2:30 AM!',
    highlightMetric: '500+ Wedding Guests Entertained',
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
    highlightMetric: '1,200 Corporate Attendees',
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
  const [selectedGalleryTag, setSelectedGalleryTag] = useState<string>('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);

  const filteredGallery =
    selectedGalleryTag === 'All'
      ? GALLERY_MOMENTS
      : GALLERY_MOMENTS.filter((item) => item.categoryTag === selectedGalleryTag);

  return (
    <div className="space-y-20 pt-8">
      {/* ====================================================================
          SECTION 1: BEAUTIFUL ARTIST STAGE GALLERY (BENTO + LIGHTBOX)
      ==================================================================== */}
      <section
        id="artist-gallery"
        aria-label="Featured Artist Stage Gallery"
        className="space-y-6 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-rose-500">
              <Camera className="h-3.5 w-3.5" />
              Live Stage Moments
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Artist Performance Gallery
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore real moments from royal destination weddings, stadium
              college fests, and Fortune 500 corporate galas powered by
              StarClinch artists.
            </p>
          </div>

          {/* Gallery Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              'All',
              'Weddings & Sangeet',
              'Concerts & Festivals',
              'Corporate Galas',
            ].map((tag) => {
              const active = selectedGalleryTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedGalleryTag(tag)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                      : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-rose-500/40'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento Photo Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[230px]">
          {filteredGallery.map((moment, idx) => (
            <div
              key={moment.id}
              className={`group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md ${
                selectedGalleryTag === 'All'
                  ? moment.spanClass
                  : 'md:col-span-2 md:row-span-1 h-64 md:h-auto'
              }`}
            >
              <img
                src={moment.imageUrl}
                alt={`${moment.title} — ${moment.artistName}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Top Category & Fullscreen Button */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                <span className="rounded-xl bg-slate-950/75 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-rose-300">
                  {moment.categoryTag}
                </span>

                <button
                  type="button"
                  onClick={() => setLightboxIdx(idx)}
                  aria-label={`View ${moment.title} in fullscreen`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950/75 text-white backdrop-blur-md border border-white/15 hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Caption & Artist Link */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-300">
                    <MapPin className="h-3 w-3" />
                    {moment.location} • {moment.artistName}
                  </p>
                  <h3 className="font-display text-base sm:text-lg font-extrabold leading-snug mt-0.5">
                    {moment.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {moment.subtitle}
                  </p>
                </div>

                <Link
                  to={`/artists/${moment.artistId}`}
                  className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600 hover:border-rose-500 transition-colors"
                >
                  <span>Book Act</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: VERIFIED CLIENT REVIEWS & SOCIAL PROOF
      ==================================================================== */}
      <section
        id="client-reviews"
        aria-label="Verified Client Reviews and Testimonials"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900/90 dark:to-slate-950 p-6 sm:p-10 shadow-sm space-y-8 scroll-mt-24"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <MessageSquareQuote className="h-3.5 w-3.5" />
              Verified Client Stories
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Loved by Wedding Families, Brands &amp; Campuses
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Every review on StarClinch comes from a verified event host who
              completed their booking through our protected platform.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5">
              <Trophy className="h-5 w-5 text-amber-500" />
              <div>
                <span className="block font-display text-sm font-extrabold text-slate-900 dark:text-white">
                  4.88 / 5.0
                </span>
                <span className="block text-[10px] text-slate-500">
                  Across 2,400+ Reviews
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <div>
                <span className="block font-display text-sm font-extrabold text-slate-900 dark:text-white">
                  99.6% On-Time
                </span>
                <span className="block text-[10px] text-slate-500">
                  Zero Replacement Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Testimonial Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {FEATURED_TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:border-rose-500/40 transition-all"
            >
              <div className="space-y-4">
                {/* Stars & Metric Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex items-center gap-0.5"
                    aria-label={`Rated ${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: item.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <BadgeCheck className="h-3 w-3" /> {item.highlightMetric}
                  </span>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  “{item.quote}”
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Client Profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.clientAvatar}
                    alt={item.clientName}
                    className="h-10 w-10 rounded-full object-cover border border-rose-500/30"
                  />
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {item.clientName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.clientRole}
                    </p>
                  </div>
                </div>

                {/* Booked Artist Link */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs">
                  <span className="text-slate-500">
                    Booked:{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {item.artistName}
                    </strong>{' '}
                    ({item.artistCategory})
                  </span>
                  <Link
                    to={`/artists/${item.artistId}`}
                    className="font-bold text-rose-500 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Profile</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
              Latest from the StarClinch Blog
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
                    className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
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
          GALLERY LIGHTBOX MODAL
      ==================================================================== */}
      {lightboxIdx !== null && filteredGallery[lightboxIdx] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Artist Stage Gallery Lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close gallery viewer"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setLightboxIdx((i) =>
                i === null || i === 0 ? filteredGallery.length - 1 : i - 1
              )
            }
            aria-label="Previous image"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="max-w-4xl w-full overflow-hidden rounded-3xl bg-slate-900 border border-white/15 shadow-2xl">
            <img
              src={filteredGallery[lightboxIdx].imageUrl}
              alt={filteredGallery[lightboxIdx].title}
              className="max-h-[72vh] w-full object-cover"
            />
            <div className="p-5 flex flex-wrap items-center justify-between gap-4 text-white">
              <div>
                <span className="text-xs font-bold text-rose-400">
                  {filteredGallery[lightboxIdx].categoryTag} •{' '}
                  {filteredGallery[lightboxIdx].location}
                </span>
                <h3 className="font-display text-lg font-extrabold">
                  {filteredGallery[lightboxIdx].title} —{' '}
                  {filteredGallery[lightboxIdx].artistName}
                </h3>
                <p className="text-xs text-slate-300">
                  {filteredGallery[lightboxIdx].subtitle}
                </p>
              </div>
              <Link
                to={`/artists/${filteredGallery[lightboxIdx].artistId}`}
                onClick={() => setLightboxIdx(null)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-rose-500 transition-colors"
              >
                <span>View {filteredGallery[lightboxIdx].artistName}’s Profile</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setLightboxIdx((i) =>
                i === null || i === filteredGallery.length - 1 ? 0 : i + 1
              )
            }
            aria-label="Next image"
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

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
                  By <strong className="text-slate-900 dark:text-white">{activeBlog.authorName}</strong> ({activeBlog.authorRole})
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
