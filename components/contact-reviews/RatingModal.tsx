"use client";

import React, { useState } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { PhotographyRating, ShootCategory } from '@/lib/contact-reviews/types';
import { PHOTOGRAPHY_CATEGORIES } from '@/lib/contact-reviews/initialData';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: PhotographyRating) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Sub-criteria ratings
  const [photoQuality, setPhotoQuality] = useState<number>(5);
  const [lightingComp, setLightingComp] = useState<number>(5);
  const [professionalism, setProfessionalism] = useState<number>(5);
  const [turnaroundSpeed, setTurnaroundSpeed] = useState<number>(5);

  const [category, setCategory] = useState<ShootCategory>('portrait');
  const [clientName, setClientName] = useState('');
  const [roleOrTag, setRoleOrTag] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [favoriteDeliverable, setFavoriteDeliverable] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMsg('Please enter your name');
      return;
    }
    if (!reviewText.trim()) {
      setErrorMsg('Please share a reflection on your photography session');
      return;
    }

    const newReview: PhotographyRating = {
      id: `rev-${Date.now()}`,
      clientName: clientName.trim(),
      roleOrTag: roleOrTag.trim() || 'Verified Patron',
      category,
      overallRating,
      photoQualityRating: photoQuality,
      lightingCompositionRating: lightingComp,
      professionalismRating: professionalism,
      turnaroundTimeRating: turnaroundSpeed,
      title: reviewTitle.trim() || 'Studio Commission Review',
      reviewText: reviewText.trim(),
      favoriteDeliverable: favoriteDeliverable.trim() || undefined,
      wouldRecommend,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      verifiedClient: true,
      helpfulCount: 0,
    };

    onSubmitReview(newReview);

    confetti({
      particleCount: 35,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#111111', '#666666', '#B8B8B3', '#D7D7D2'],
    });

    onClose();
  };

  const renderCriteriaRow = (
    label: string,
    value: number,
    setter: (val: number) => void
  ) => (
    <div className="flex items-center justify-between py-2.5 border-b border-[#D7D7D2] text-xs font-mono">
      <span className="text-[#666666] tracking-wide">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                star <= value
                  ? 'text-[#111111] fill-[#111111]'
                  : 'text-[#D7D7D2]'
              }`}
            />
          </button>
        ))}
        <span className="w-6 text-right font-mono text-[11px] text-[#111111]">
          {value}.0
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#111111]/45 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="relative w-full max-w-xl bg-[#FFFFFF] border border-[#D7D7D2] p-8 sm:p-10 my-6 transition-all shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-rating-modal-btn"
          onClick={onClose}
          className="absolute top-6 right-6 text-[#8A8A86] hover:text-[#111111] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#8A8A86] block mb-2">
            CLIENT PERSPECTIVE / CRITIQUE
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#111111] uppercase tracking-wide">
            RATE PHOTOGRAPHY
          </h2>
          <p className="text-xs text-[#666666] mt-2 font-light">
            Your review helps future patrons understand our medium-format capture, lighting direction, and delivery speed.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border border-[#B8B8B3] text-[#111111] text-xs font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Main 5-Star Selection */}
          <div className="pb-6 border-b border-[#D7D7D2] flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8A86] mb-3">
              Overall Experience Score
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = hoverRating !== null ? hoverRating : overallRating;
                const isLit = star <= active;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        isLit
                          ? 'text-[#111111] fill-[#111111]'
                          : 'text-[#D7D7D2]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="font-mono text-[11px] text-[#666666] mt-2">
              {hoverRating !== null ? hoverRating : overallRating}.0 / 5.0 RATING
            </span>
          </div>

          {/* Sub Criteria */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8A86] block mb-1">
              Technical Metrics
            </span>
            <div className="divide-y divide-[#D7D7D2]">
              {renderCriteriaRow('Optics & Color Science', photoQuality, setPhotoQuality)}
              {renderCriteriaRow('Lighting & Composition', lightingComp, setLightingComp)}
              {renderCriteriaRow('Posing Direction & Ease', professionalism, setProfessionalism)}
              {renderCriteriaRow('Turnaround Delivery', turnaroundSpeed, setTurnaroundSpeed)}
            </div>
          </div>

          {/* Session Genre */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8A8A86] block mb-2">
              Commission Genre
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 text-center border text-[11px] transition-colors cursor-pointer truncate ${
                    category === cat.id
                      ? 'border-[#111111] bg-[#111111] text-[#F6F6F4]'
                      : 'border-[#D7D7D2] text-[#666666] hover:border-[#111111]'
                  }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Maya Lin"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-[#D7D7D2] focus:border-[#111111] py-2 text-xs text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-colors font-editorial text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
                Role / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Architect, Designer, Patron"
                value={roleOrTag}
                onChange={(e) => setRoleOrTag(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-[#D7D7D2] focus:border-[#111111] py-2 text-xs text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-colors font-grotesk"
              />
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-[#666666] mb-1">
              Your Review / Experience Reflection *
            </label>
            <textarea
              rows={3}
              placeholder="How did the imagery, lighting, and session feel? Share your personal impression..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#D7D7D2] focus:border-[#111111] py-2 text-xs text-[#111111] placeholder-[#D7D7D2] focus:outline-none transition-colors resize-none font-editorial text-base"
            />
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-[#D7D7D2] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-[0.16em] text-[#8A8A86] hover:text-[#111111] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-[#111111] text-[#F6F6F4] hover:bg-[#222222] text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
            >
              <span>Publish Review</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
