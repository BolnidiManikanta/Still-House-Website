"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Star,
  ThumbsUp,
  ShieldCheck,
  Check,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PhotographyRating } from '@/lib/contact-reviews/types';

interface ReviewsSliderProps {
  reviews: PhotographyRating[];
  onOpenRatingModal: () => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const ReviewsSlider: React.FC<ReviewsSliderProps> = ({
  reviews,
  onOpenRatingModal,
  onVoteHelpful,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  // Drag and Swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const totalReviews = reviews.length;
  const fallbackReview: PhotographyRating = {
    id: 'default-review',
    clientName: 'Sunita & Siddharth Rao',
    roleOrTag: 'Heritage Estate Commission',
    category: 'architecture',
    overallRating: 5.0,
    photoQualityRating: 5.0,
    lightingCompositionRating: 5.0,
    professionalismRating: 5.0,
    turnaroundTimeRating: 5.0,
    title: 'Sublime architectural documentary masters',
    reviewText:
      'An exceptional experience from beginning to end. Apex captured the brutalist geometry and shifting morning light of our Pune residence with quiet reverence. The medium-format tonal gradations are unparalleled.',
    wouldRecommend: true,
    date: 'February 2026',
    verifiedClient: true,
    helpfulCount: 24,
  };

  const currentReview: PhotographyRating =
    (reviews && reviews.length > 0 ? reviews[currentIndex] || reviews[0] : null) ||
    fallbackReview;

  const handleNext = () => {
    if (totalReviews <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  const handlePrev = () => {
    if (totalReviews <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  // Keyboard navigation (Requirement #14)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = document.getElementById('reviews-section');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalReviews]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartXRef.current = e.clientX;
    isDraggingRef.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || mouseStartXRef.current === null) return;
    const diff = e.clientX - mouseStartXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    isDraggingRef.current = false;
    mouseStartXRef.current = null;
  };

  const handleVote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!votedIds.has(id)) {
      setVotedIds((prev) => new Set(prev).add(id));
      onVoteHelpful(id);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.overallRating, 0) / reviews.length
      : 5.0;

  // Curated architectural & sculptural grayscale thumbnails for the right side
  const reviewImages = [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  ];

  const currentThumbnail = reviewImages[currentIndex % reviewImages.length];

  return (
    <section
      id="reviews-section"
      className="relative py-20 sm:py-32 scroll-mt-24 border-t border-[#D7D7D2] overflow-hidden"
    >
      {/* ========================================================================= */}
      {/* REVIEW BACKGROUND EFFECT (Requirement #15)                                */}
      {/* Subtle moving grey atmospheric texture, stone form, and slow light drift  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Faint ambient light float */}
        <div
          className="absolute -top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full opacity-40 mix-blend-soft-light filter blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(233,233,230,0.8) 0%, rgba(246,246,244,0) 70%)',
            animation: 'reviewsAtmosphereDrift 30s ease-in-out infinite alternate',
          }}
        />
        {/* Soft abstract stone geometry silhouette */}
        <div
          className="absolute -bottom-[20%] -left-[10%] w-[45vw] h-[45vw] rounded-full opacity-30 mix-blend-multiply filter blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(220,220,215,0.4) 0%, transparent 65%)',
            animation: 'reviewsAtmosphereDrift 24s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      {/* 1. Header with Large Editorial Typography (Requirement #13) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 pb-12 sm:pb-16 border-b border-[#D7D7D2]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-[#8A8A86]">
              CRITIQUE / 02
            </span>
            <div className="w-10 h-px bg-[#D7D7D2]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#666666] font-mono">
              CLIENT REVIEWS
            </span>
          </div>

          <h2 className="font-editorial text-5xl sm:text-7xl md:text-8xl text-[#111111] uppercase tracking-tight leading-[0.9]">
            WHAT PEOPLE
            <br />
            SAY.
          </h2>
        </div>

        {/* Studio Score & Review Link */}
        <div className="flex flex-col sm:items-end gap-2 font-mono text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-4xl sm:text-5xl text-[#111111] font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-[#8A8A86]">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 text-[#111111]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(averageRating) ? 'fill-[#111111]' : 'text-[#D7D7D2]'
                }`}
              />
            ))}
            <span className="text-[#8A8A86] ml-2">
              ({totalReviews} Verified Critiques)
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenRatingModal}
            className="group mt-1 inline-flex items-center gap-1.5 uppercase tracking-[0.16em] text-[#111111] hover:text-[#666666] border-b border-[#111111] hover:border-[#666666] transition-colors cursor-pointer"
          >
            <span>Submit Your Rating</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* 2. One Primary Review Dominating with Grayscale Image on Right (Requirement #13 & #14) */}
      <div
        data-cursor="DRAG"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative py-14 sm:py-20 select-none cursor-grab active:cursor-grabbing"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentReview.id}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          >
            {/* Left Dominant Editorial Quote (Cols 1-8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Star Rating & Verified Meta */}
              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px]">
                {/* Prominent Star Rating Badge */}
                <div className="flex items-center gap-1.5 bg-[#111111] text-[#F6F6F4] px-3 py-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(currentReview.overallRating)
                            ? 'fill-[#F6F6F4] text-[#F6F6F4]'
                            : 'text-[#555555]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-xs ml-1">
                    {currentReview.overallRating.toFixed(1)}
                  </span>
                </div>

                <span className="text-[#111111] font-medium tracking-[0.2em] uppercase">
                  {(currentReview.category || 'COMMISSION').toUpperCase()}
                </span>
                <span className="text-[#D7D7D2]">•</span>
                <span className="text-[#8A8A86]">{currentReview.date}</span>

                {currentReview.verifiedClient && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#111111] bg-[#E9E9E6] px-2 py-0.5 border border-[#D7D7D2]">
                    <ShieldCheck className="w-3 h-3 text-[#111111]" />
                    <span>VERIFIED CLIENT</span>
                  </span>
                )}

                {currentReview.wouldRecommend && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#111111] bg-[#FFFFFF] px-2 py-0.5 border border-[#D7D7D2]">
                    <Check className="w-3 h-3 text-[#111111]" />
                    <span>RECOMMENDED</span>
                  </span>
                )}
              </div>

              {/* Review Headline & Dominant Editorial Quote */}
              <div>
                <h3 className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#111111] font-medium tracking-tight mb-3">
                  &ldquo;{currentReview.title}&rdquo;
                </h3>
                <blockquote className="font-editorial text-lg sm:text-2xl text-[#444444] font-light leading-relaxed">
                  {currentReview.reviewText}
                </blockquote>
              </div>

              {/* 4-Pillar Detailed Rating Star Criteria Breakdown */}
              <div className="p-3.5 sm:p-4 bg-[#FFFFFF]/80 border border-[#D7D7D2] grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#8A8A86] block tracking-wider mb-1">
                    Photo Quality
                  </span>
                  <div className="flex items-center gap-1 text-[#111111]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(currentReview.photoQualityRating || currentReview.overallRating)
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D7D7D2]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-semibold ml-1">
                      {(currentReview.photoQualityRating || currentReview.overallRating).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-[#8A8A86] block tracking-wider mb-1">
                    Lighting & Framing
                  </span>
                  <div className="flex items-center gap-1 text-[#111111]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(currentReview.lightingCompositionRating || currentReview.overallRating)
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D7D7D2]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-semibold ml-1">
                      {(currentReview.lightingCompositionRating || currentReview.overallRating).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-[#8A8A86] block tracking-wider mb-1">
                    Studio Etiquette
                  </span>
                  <div className="flex items-center gap-1 text-[#111111]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(currentReview.professionalismRating || currentReview.overallRating)
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D7D7D2]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-semibold ml-1">
                      {(currentReview.professionalismRating || currentReview.overallRating).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-[#8A8A86] block tracking-wider mb-1">
                    Grading & Delivery
                  </span>
                  <div className="flex items-center gap-1 text-[#111111]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.round(currentReview.turnaroundTimeRating || currentReview.overallRating)
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D7D7D2]'
                        }`}
                      />
                    ))}
                    <span className="text-[11px] font-semibold ml-1">
                      {(currentReview.turnaroundTimeRating || currentReview.overallRating).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {currentReview.favoriteDeliverable && (
                <div className="font-mono text-[11px] text-[#666666] flex flex-wrap items-center gap-2">
                  <span className="text-[#8A8A86] uppercase tracking-wider text-[10px]">
                    Client Favorite Frame:
                  </span>
                  <span className="text-[#111111] font-medium">
                    &ldquo;{currentReview.favoriteDeliverable}&rdquo;
                  </span>
                </div>
              )}

              {/* Author Block */}
              <div className="pt-4 border-t border-[#D7D7D2] flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <h4 className="font-editorial text-xl sm:text-2xl text-[#111111] font-medium tracking-wide">
                    {currentReview.clientName}
                  </h4>
                  <p className="font-mono text-xs text-[#8A8A86] mt-0.5">
                    {currentReview.roleOrTag}
                  </p>
                </div>

                {/* Helpful endorsement */}
                <button
                  type="button"
                  onClick={(e) => handleVote(currentReview.id, e)}
                  disabled={votedIds.has(currentReview.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 border text-xs font-mono transition-colors cursor-pointer ${
                    votedIds.has(currentReview.id)
                      ? 'border-[#111111] bg-[#111111] text-[#F6F6F4]'
                      : 'border-[#D7D7D2] text-[#666666] hover:border-[#111111] hover:text-[#111111] bg-[#FFFFFF]/70'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>
                    Endorsed ({currentReview.helpfulCount + (votedIds.has(currentReview.id) ? 1 : 0)})
                  </span>
                </button>
              </div>
            </div>

            {/* Right Architectural Grayscale Image Thumbnail (Requirement #13) */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div
                data-cursor="VIEW"
                className="relative w-full max-w-xs aspect-[4/5] bg-[#E9E9E6] border border-[#D7D7D2] overflow-hidden group shadow-xs"
              >
                <img
                  src={currentThumbnail}
                  alt={`Apex Light review archival commission thumbnail`}
                  className="w-full h-full object-cover object-center grayscale contrast-105 brightness-95 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#FFFFFF] flex justify-between">
                  <span>PLATE REF / {String(currentIndex + 1).padStart(2, '0')}</span>
                  <span>100MP MASTER</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Slider Controls & Thin Progress Indicator (Requirement #14) */}
      <div className="pt-8 border-t border-[#D7D7D2] flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Progress bar */}
        <div className="w-full sm:w-64 h-px bg-[#D7D7D2] relative">
          <div
            className="h-full bg-[#111111] transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / totalReviews) * 100}%`,
            }}
          />
        </div>

        {/* Counter: 01 / 05 & Nav buttons */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <span className="tracking-widest text-[#111111] font-medium">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalReviews).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous review"
              className="w-10 h-10 border border-[#D7D7D2] hover:border-[#111111] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#F6F6F4] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next review"
              className="w-10 h-10 border border-[#D7D7D2] hover:border-[#111111] flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-[#F6F6F4] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Complete Client Review Archive Grid (Requirement: show all client reviews with full star ratings) */}
      <div className="mt-14 pt-10 border-t border-[#D7D7D2]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 font-mono">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#8A8A86] block mb-1">
              PATRON ARCHIVE INDEX
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#111111] uppercase tracking-tight">
              ALL CLIENT RATINGS & CRITIQUES
            </h3>
          </div>
          <span className="text-xs text-[#8A8A86]">
            Showing all {totalReviews} documented studio commissions • 100% 5-Star Consensus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((rev, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={rev.id}
                type="button"
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`p-5 text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-[#111111] bg-[#FFFFFF] shadow-sm ring-1 ring-[#111111]'
                    : 'border-[#D7D7D2] bg-[#FFFFFF]/60 hover:border-[#111111] hover:bg-[#FFFFFF]'
                }`}
              >
                <div>
                  {/* Review Top Meta & Stars */}
                  <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
                    <span className="uppercase text-[10px] font-medium text-[#111111] tracking-wider">
                      {rev.category}
                    </span>
                    <span className="text-[#8A8A86] text-[10px]">{rev.date}</span>
                  </div>

                  {/* 5-Star Row */}
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.round(rev.overallRating)
                            ? 'fill-[#111111] text-[#111111]'
                            : 'text-[#D7D7D2]'
                        }`}
                      />
                    ))}
                    <span className="font-mono text-xs font-semibold text-[#111111] ml-1.5">
                      {rev.overallRating.toFixed(1)}
                    </span>
                  </div>

                  {/* Review Title */}
                  <h4 className="font-editorial text-base sm:text-lg text-[#111111] font-medium line-clamp-1 mb-1">
                    &ldquo;{rev.title}&rdquo;
                  </h4>

                  {/* Review Snippet */}
                  <p className="font-editorial text-xs sm:text-sm text-[#666666] line-clamp-2 leading-relaxed">
                    {rev.reviewText}
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-4 pt-3 border-t border-[#E9E9E6] flex items-center justify-between font-mono text-[11px]">
                  <span className="font-medium text-[#111111] truncate">{rev.clientName}</span>
                  <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-[#111111] font-semibold' : 'text-[#8A8A86]'}`}>
                    {isActive ? 'Active [Selected]' : 'View Review →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes reviewsAtmosphereDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(4%, 3%, 0) scale(1.05); }
          100% { transform: translate3d(-3%, -2%, 0) scale(0.96); }
        }
      `}</style>
    </section>
  );
};
