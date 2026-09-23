"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { PortfolioImage } from '../data/portfolioData';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Share2, Check } from 'lucide-react';

interface LightboxProps {
  images: PortfolioImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onInquireImage: (image: PortfolioImage) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onInquireImage,
}) => {
  const [copied, setCopied] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const activeImage = images[currentIndex];

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    const newIndex = (currentIndex + 1) % images.length;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !activeImage) return null;

  // Format counter: e.g. "01 / 24"
  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(images.length).padStart(2, '0');

  return (
    <div
      id="portfolio-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Gallery Viewer - ${activeImage.title}`}
      className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-md flex flex-col text-white select-none transition-opacity duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Lightbox Top Bar */}
      <div className="flex-none px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-white/60">
            Krishna Photography
          </span>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono tracking-widest text-white/90">
            {formattedIndex} <span className="text-white/40">/</span> {formattedTotal}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="lightbox-share-btn"
            onClick={handleShare}
            aria-label="Share story link"
            className="p-2 text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] tracking-widest uppercase cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          <button
            id="lightbox-close-btn"
            onClick={onClose}
            aria-label="Close Lightbox (Esc)"
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Previous Button */}
        <button
          id="lightbox-prev-btn"
          onClick={handlePrev}
          aria-label="Previous image (Left arrow)"
          className="absolute left-4 sm:left-8 z-20 p-3 text-white/60 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-all rounded-none cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* The Active Image */}
        <div className="max-w-5xl max-h-[75vh] sm:max-h-[80vh] flex flex-col items-center justify-center">
          <img
            id="lightbox-current-image"
            src={activeImage.imageUrl}
            alt={activeImage.alt}
            key={activeImage.id}
            className="max-w-full max-h-[68vh] sm:max-h-[72vh] object-contain shadow-2xl transition-opacity duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          id="lightbox-next-btn"
          onClick={handleNext}
          aria-label="Next image (Right arrow)"
          className="absolute right-4 sm:right-8 z-20 p-3 text-white/60 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 transition-all rounded-none cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Lightbox Bottom Caption & Meta - Classic Museum Colophon */}
      <div className="flex-none px-6 sm:px-12 py-5 bg-black/85 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-1.5 font-mono text-[9px] tracking-[0.28em] uppercase text-white/60">
            <span className="text-white/90">PLATE {formattedIndex} / {formattedTotal}</span>
            <span className="text-white/30">•</span>
            <span>{activeImage.categoryName} ARCHIVE</span>
            {activeImage.location && (
              <>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{activeImage.location}</span>
                </span>
              </>
            )}
            {activeImage.year && (
              <>
                <span className="text-white/30">•</span>
                <span>{activeImage.year}</span>
              </>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-serif italic text-white font-normal leading-tight">
            {activeImage.title}
          </h3>
          {activeImage.storyCaption && (
            <p className="text-xs sm:text-sm text-white/85 font-serif italic font-light max-w-xl line-clamp-2 mt-1 leading-relaxed">
              “{activeImage.storyCaption}”
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
          <button
            id="lightbox-inquire-btn"
            onClick={() => {
              onClose();
              onInquireImage(activeImage);
            }}
            className="text-[10px] tracking-[0.25em] uppercase px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-200 transition-colors font-semibold cursor-pointer shadow-sm"
          >
            Enquire About This Work
          </button>
        </div>
      </div>
    </div>
  );
};
