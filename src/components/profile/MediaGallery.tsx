import React, { useState } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  Film,
  Play,
  X,
} from 'lucide-react';
import { SampleVideo } from '../../types';

interface MediaGalleryProps {
  artistName: string;
  gallery: string[];
  sampleVideos: SampleVideo[];
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  artistName,
  gallery,
  sampleVideos,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<SampleVideo | null>(null);

  const handlePrevPhoto = () => {
    setActivePhotoIdx((i) => (i === 0 ? gallery.length - 1 : i - 1));
  };

  const handleNextPhoto = () => {
    setActivePhotoIdx((i) => (i === gallery.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="space-y-8">
      {/* Photo Gallery & Carousel */}
      <section aria-label="Stage Photo Gallery" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-rose-500" />
            <span>Stage Gallery &amp; Live Moments</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Photo {activePhotoIdx + 1} of {gallery.length}
          </span>
        </div>

        {/* Main Featured Stage Image */}
        <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800">
          <img
            src={gallery[activePhotoIdx]}
            alt={`${artistName} stage photo ${activePhotoIdx + 1}`}
            className="h-full w-full object-cover transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* Prev/Next Carousel Controls */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            aria-label="Previous gallery photo"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handleNextPhoto}
            aria-label="Next gallery photo"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/75 text-white backdrop-blur-md hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white border border-white/15 hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            Fullscreen View
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="grid grid-cols-5 gap-2.5">
          {gallery.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePhotoIdx(idx)}
              aria-label={`Select photo ${idx + 1}`}
              aria-current={activePhotoIdx === idx}
              className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                activePhotoIdx === idx
                  ? 'border-rose-500 ring-2 ring-rose-500/30 scale-[1.02]'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`${artistName} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Sample Performance Videos */}
      <section aria-label="Sample Performance Videos" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Film className="h-5 w-5 text-purple-500" />
            <span>Sample Live Videos &amp; Showreels</span>
          </h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Click any showreel to watch
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sampleVideos.map((vid) => (
            <div
              key={vid.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-rose-500/40 transition-all"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/35 group-hover:bg-slate-950/20 transition-colors" />

                <button
                  type="button"
                  onClick={() => setActiveVideo(vid)}
                  aria-label={`Play video: ${vid.title}`}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 transition-transform duration-200 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-white ml-0.5" />
                  </span>
                </button>

                <span className="absolute top-2.5 left-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-rose-400 border border-white/10">
                  {vid.eventTag}
                </span>

                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-950/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                  {vid.duration}
                </span>
              </div>

              <div className="p-3.5 flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {vid.title}
                </h4>
                <span className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">
                  {vid.views}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Photo Viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close photo viewer"
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={handlePrevPhoto}
            aria-label="Previous photo"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={gallery[activePhotoIdx]}
            alt={`${artistName} fullscreen stage view`}
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={handleNextPhoto}
            aria-label="Next photo"
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-rose-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Embedded YouTube Showreel Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <h4 className="font-display text-sm font-bold text-white truncate">
                {activeVideo.title}
              </h4>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
