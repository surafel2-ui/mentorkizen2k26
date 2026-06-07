import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, Tag, Users, GraduationCap } from 'lucide-react';
import { Photo } from '../types';

interface LightboxModalProps {
  photo: Photo | null;
  photos: Photo[];
  onClose: () => void;
  onLike: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelectPhoto: (photo: Photo) => void;
  isAdmin: boolean;
  likedPhotoIds: Set<string>;
}

export default function LightboxModal({
  photo,
  photos,
  onClose,
  onLike,
  onDelete,
  onSelectPhoto,
  isAdmin,
  likedPhotoIds,
}: LightboxModalProps) {
  const [isLikingAnimation, setIsLikingAnimation] = useState(false);

  const activePhoto = photos.find((p) => p.id === photo?.id) || photo;
  const isAlreadyLiked = activePhoto ? likedPhotoIds.has(activePhoto.id) : false;

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, photos]);

  if (!activePhoto) return null;

  const currentIndex = photos.findIndex((p) => p.id === activePhoto.id);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length <= 1) return;
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    onSelectPhoto(photos[prevIdx]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (photos.length <= 1) return;
    const nextIdx = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    onSelectPhoto(photos[nextIdx]);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAlreadyLiked) {
      setIsLikingAnimation(true);
      await onLike(activePhoto.id);
      setTimeout(() => setIsLikingAnimation(false), 600);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Are you sure you want to delete this class yearbook memory permanently?')) {
      onDelete(activePhoto.id);
      if (photos.length > 1) {
        handleNext();
      } else {
        onClose();
      }
    }
  };

  const formattedDate = new Date(activePhoto.timestamp).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 select-none overflow-y-auto"
        id="fullscreen-lightbox-modal"
      >
        {/* Intricate decorative border layout lines */}
        <div className="absolute inset-4 sm:inset-6 border border-gold-500/10 rounded-2xl pointer-events-none z-0" />
        <div className="absolute inset-6 sm:inset-8 border border-dashed border-gold-500/5 rounded-xl pointer-events-none z-0" />

        {/* Modal Header */}
        <div
          className="relative z-10 w-full flex items-center justify-between bg-black/40 border border-gold-500/10 px-4 py-3 rounded-xl max-w-4xl mx-auto backdrop-blur"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold-500 animate-ping" />
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-gold-300">
              Memory {currentIndex + 1} of {photos.length}
            </span>
            <span className="text-[10px] opacity-60 text-slate-400 hidden sm:inline">
              | Published by {activePhoto.uploadedBy}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onDelete && (
              <button
                onClick={handleDelete}
                className="cursor-pointer flex items-center gap-1 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition"
                title="Admin Delete Photo"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Delete</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-200 border border-gold-500/20 transition"
              title="Close View (Esc)"
              id="lightbox-close-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image viewport slider layout */}
        <div
          className="relative z-10 w-full flex-1 flex items-center justify-center py-6 sm:py-8"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.length > 1 && (
            <button
              onClick={handlePrev}
              className="cursor-pointer absolute left-1 sm:left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/20 hover:scale-105 active:scale-95 transition"
              title="Previous Photo (Left Arrow)"
              id="lightbox-prev-btn"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <motion.div
            initial={{ scale: 0.94, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 10, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative max-w-full max-h-[72vh] sm:max-h-[78vh] md:max-h-[82vh] flex items-center justify-center rounded-xl p-1 bg-black/60 border border-gold-500/10 shadow-[0_0_60px_rgba(0,0,0,0.95)] group select-none"
            id="lightbox-image-container"
          >
            {/* Visual crop lines corner tags */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold-500/40 rounded-tl pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold-500/40 rounded-tr pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold-500/40 rounded-bl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold-500/40 rounded-br pointer-events-none" />

            <img
              src={activePhoto.url}
              alt={activePhoto.caption}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[70vh] sm:max-h-[76vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl pointer-events-none"
            />
          </motion.div>

          {photos.length > 1 && (
            <button
              onClick={handleNext}
              className="cursor-pointer absolute right-1 sm:right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 border border-gold-500/20 hover:scale-105 active:scale-95 transition"
              title="Next Photo (Right Arrow)"
              id="lightbox-next-btn"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Narrative caption registry bar */}
        <div
          className="relative z-10 w-full bg-gradient-to-t from-maroon-950/90 to-maroon-950/40 border border-gold-500/15 p-5 rounded-2xl max-w-4xl mx-auto shadow-2xl backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              {activePhoto.tags && activePhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activePhoto.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1 rounded bg-gold-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-gold-300 border border-gold-500/25"
                    >
                      <Tag className="h-3 w-3 text-gold-400" />
                      {tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}

              {activePhoto.caption && activePhoto.caption.trim() && activePhoto.caption !== 'Class of 2026 Memory' && (
                <p className="font-serif text-base sm:text-lg italic leading-relaxed text-slate-100 pr-4">
                  "{activePhoto.caption}"
                </p>
              )}

              {activePhoto.studentNames && activePhoto.studentNames.trim() && activePhoto.studentNames !== 'Senior Class' && (
                <div className="flex items-center gap-2 text-gold-200">
                  <Users className="h-4 w-4 text-gold-500" />
                  <span className="font-sans font-bold text-xs sm:text-sm tracking-widest uppercase">
                    Featured: {activePhoto.studentNames}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gold-500/10 justify-between md:justify-end shrink-0">
              <div className="font-mono text-[10.5px] text-slate-400 flex flex-col gap-0.5 md:items-end">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-gold-600" />
                  <span>{formattedDate}</span>
                </div>
                <span className="text-slate-500">Graduation Album Registry</span>
              </div>

              <button
                onClick={handleLike}
                disabled={isAlreadyLiked}
                className={`cursor-pointer flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isAlreadyLiked
                    ? 'bg-gold-500/25 text-gold-200 border border-gold-500/50 cursor-not-allowed shadow-md'
                    : activePhoto.likes > 0
                    ? 'bg-gold-500/15 text-gold-300 border border-gold-500/40 shadow-lg hover:bg-gold-500/25'
                    : 'bg-black/60 text-slate-400 border border-gold-500/10 hover:text-gold-300 hover:border-gold-500/30'
                } hover:scale-102`}
                id="lightbox-like-btn"
                title={isAlreadyLiked ? 'You have already liked this photo in this session' : 'Like this photo'}
              >
                <motion.div
                  animate={isLikingAnimation ? { scale: [1, 1.4, 0.9, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Heart
                    className={`h-4.5 w-4.5 transition-colors ${
                      isAlreadyLiked
                        ? 'fill-gold-400 text-gold-400'
                        : activePhoto.likes > 0
                        ? 'fill-gold-400/50 text-gold-400'
                        : 'text-slate-400'
                    }`}
                  />
                </motion.div>
                <span>{activePhoto.likes || 0} Likes</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 border-t border-gold-500/5 pt-3">
            <span>← USE LEFT ARROW KEY OR CLICK PREVIOUS</span>
            <span>USE RIGHT ARROW KEY OR CLICK NEXT →</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
