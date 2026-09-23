"use client";

import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  ThumbsUp,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { PhotographyRating, ShootCategory } from '@/lib/contact-reviews/types';
import { PHOTOGRAPHY_CATEGORIES } from '@/lib/contact-reviews/initialData';

interface ReviewsListProps {
  reviews: PhotographyRating[];
  onOpenRatingModal: () => void;
  onVoteHelpful: (reviewId: string) => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onOpenRatingModal,
  onVoteHelpful,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate metrics
  const stats = useMemo(() => {
    if (reviews.length === 0) return { avg: '5.0', count: 0, recommendRate: 100 };
    const total = reviews.reduce((acc, r) => acc + r.overallRating, 0);
    const recommend = reviews.filter((r) => r.wouldRecommend).length;
    return {
      avg: (total / reviews.length).toFixed(1),
      count: reviews.length,
      recommendRate: Math.round((recommend / reviews.length) * 100),
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (selectedCategory !== 'all' && review.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = (review.reviewText || '').toLowerCase().includes(q);
        const matchesAuthor = (review.clientName || '').toLowerCase().includes(q);
        const matchesTitle = (review.title || '').toLowerCase().includes(q);
        return matchesText || matchesAuthor || matchesTitle;
      }
      return true;
    });
  }, [reviews, selectedCategory, searchQuery]);

  return (
    <section id="reviews-section" className="py-24 sm:py-32 border-t border-[#DCDCD8] scroll-mt-24">
      {/* Section Eyebrow & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A8A86]">
              TESTIMONIALS / 02
            </span>
            <div className="w-12 h-px bg-[#DCDCD8]" />
            <span className="text-[11px] font-mono text-[#666666]">
              {stats.avg} / 5.0 RATING ({stats.count} REVIEWS)
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-6xl text-[#151515] uppercase tracking-tight">
            SELECTED REVIEWS
          </h2>

          <p className="text-[#666666] text-base mt-3 max-w-xl font-light">
            Reflections from clients, creative directors, and couples who have
            stepped in front of our studio lenses.
          </p>
        </div>

        {/* Rate Photography Trigger */}
        <div className="flex items-center gap-4">
          <button
            id="reviews-give-rating-cta"
            onClick={onOpenRatingModal}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#151515] border border-[#151515] px-6 py-3.5 bg-[#FFFFFF] hover:bg-[#151515] hover:text-[#F7F7F5] transition-all duration-300 cursor-pointer"
          >
            <span>Rate Studio Experience</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Minimal Category & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DCDCD8] mb-12">
        {/* Minimal Category Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto max-w-full text-xs tracking-[0.16em] uppercase">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`py-1 relative transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'text-[#151515] font-medium'
                : 'text-[#8A8A86] hover:text-[#151515]'
            }`}
          >
            <span>All ({reviews.length})</span>
            {selectedCategory === 'all' && (
              <span className="absolute bottom-0 left-0 w-full h-px bg-[#151515]" />
            )}
          </button>

          {PHOTOGRAPHY_CATEGORIES.map((cat) => {
            const count = reviews.filter((r) => r.category === cat.id).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1 relative transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'text-[#151515] font-medium'
                    : 'text-[#8A8A86] hover:text-[#151515]'
                }`}
              >
                <span>{cat.name} ({count})</span>
                {selectedCategory === cat.id && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-[#151515]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Minimal Search Field */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 border-b border-[#DCDCD8] focus:border-[#151515] py-1.5 text-xs text-[#151515] placeholder-[#B8B8B3] focus:outline-none transition-colors font-light"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* EDITORIAL REVIEWS VERTICAL LIST                                           */}
      {/* ========================================================================= */}
      {filteredReviews.length === 0 ? (
        <div className="py-20 text-center border-b border-[#DCDCD8]">
          <p className="text-[#666666] text-sm">No reviews found matching your search.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 text-xs font-mono uppercase underline text-[#151515] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#DCDCD8]">
          {filteredReviews.map((review, idx) => {
            const categoryObj = PHOTOGRAPHY_CATEGORIES.find(
              (c) => c.id === review.category
            );
            return (
              <article
                key={review.id}
                id={`review-item-${review.id}`}
                className="group relative py-12 sm:py-16 px-4 sm:px-8 transition-colors duration-300 hover:bg-[#EEEEEC]/60 -mx-4 sm:-mx-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Review Sequence Number & Category */}
                  <div className="lg:col-span-3 flex lg:flex-col justify-between items-start gap-4">
                    <div>
                      <span className="text-[11px] font-mono tracking-[0.2em] text-[#8A8A86] block">
                        0{idx + 1} / {(review.category || 'COMMISSION').toUpperCase()}
                      </span>
                      <span className="text-xs text-[#151515] font-medium tracking-wide mt-1 block">
                        {categoryObj?.name || review.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono text-[#8A8A86]">
                      <span>{review.overallRating.toFixed(1)} ★</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>

                  {/* Center: Large Quotation Typography & Review Text */}
                  <div className="lg:col-span-7 transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#151515] leading-snug mb-4 font-light">
                      “{review.reviewText}”
                    </h3>

                    {review.favoriteDeliverable && (
                      <p className="text-xs text-[#666666] tracking-wide mt-3">
                        <span className="text-[#151515] font-medium">Favorite Deliverable:</span>{' '}
                        {review.favoriteDeliverable}
                      </p>
                    )}
                  </div>

                  {/* Right: Client Attribution & Helpful Action */}
                  <div className="lg:col-span-2 flex flex-col justify-between items-start lg:items-end h-full gap-4">
                    <div className="lg:text-right">
                      <div className="text-sm text-[#151515] font-medium">
                        — {review.clientName}
                      </div>
                      <div className="text-xs text-[#666666] font-light mt-0.5">
                        {review.roleOrTag}
                      </div>
                      {review.verifiedClient && (
                        <div className="text-[10px] font-mono tracking-wider uppercase text-[#8A8A86] mt-1 flex items-center lg:justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#151515]" />
                          <span>Verified Client</span>
                        </div>
                      )}
                    </div>

                    {/* Subtle Helpful Vote Trigger */}
                    <button
                      id={`helpful-btn-${review.id}`}
                      type="button"
                      onClick={() => onVoteHelpful(review.id)}
                      className="text-[11px] font-mono text-[#8A8A86] hover:text-[#151515] transition-colors flex items-center gap-1.5 cursor-pointer mt-2"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>

                {/* Subtle arrow appearing on hover */}
                <div className="absolute right-4 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-[#151515]" />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Line */}
      <div className="pt-16 border-t border-[#DCDCD8] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#666666]">
        <p className="font-light">
          All testimonials are authentic commissions authored by verified studio patrons.
        </p>

        <button
          type="button"
          onClick={onOpenRatingModal}
          className="text-xs font-mono uppercase tracking-[0.2em] text-[#151515] hover:text-[#666666] transition-colors underline cursor-pointer"
        >
          Submit a Client Review →
        </button>
      </div>
    </section>
  );
};
