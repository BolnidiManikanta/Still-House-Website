"use client";

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DynamicBackground } from './DynamicBackground';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { CinematicImageBanner } from './CinematicImageBanner';
import { ContactSection } from './ContactSection';
import { ReviewsSlider } from './ReviewsSlider';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';
import { RatingModal } from './RatingModal';
import { DynamicActionButton } from './DynamicActionButton';
import { INITIAL_REVIEWS, PHOTOGRAPHY_CATEGORIES } from '@/lib/contact-reviews/initialData';
import { PhotographyRating, ShootCategory } from '@/lib/contact-reviews/types';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactReviewsExperience() {
  const [reviews, setReviews] = useState<PhotographyRating[]>(INITIAL_REVIEWS);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'contact' | 'reviews'>('contact');
  const [selectedCategory, setSelectedCategory] = useState<ShootCategory>('portrait');

  // Load reviews from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_photography_reviews');
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load reviews from localStorage', e);
    }
  }, []);

  // Save reviews to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('apex_photography_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to persist reviews', e);
    }
  }, [reviews]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const reviewsEl = document.getElementById('reviews-section');
      if (reviewsEl) {
        const rect = reviewsEl.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSection('reviews');
          return;
        }
      }
      setActiveSection('contact');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenRatingModal = () => {
    setIsRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setIsRatingModalOpen(false);
  };

  const handleSubmitReview = (newReview: PhotographyRating) => {
    setReviews((prev) => [newReview, ...prev]);
    const el = document.getElementById('reviews-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVoteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.overallRating, 0) / reviews.length
      : 5.0;

  const currentCategoryName =
    PHOTOGRAPHY_CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
    'Portrait & Headshots';

  return (
    <div className="min-h-screen text-[#111111] selection:bg-[#111111] selection:text-[#F6F6F4] relative font-sans bg-[#F6F6F4]">
      {/* 1. Moving Background: Paper, grain, subtle light movement, guidelines */}
      <DynamicBackground />

      {/* 2. Editorial Sticky Navbar */}
      <Navbar
        onOpenRatingModal={handleOpenRatingModal}
        activeSection={activeSection}
        reviewCount={reviews.length}
        averageRating={averageRating}
      />

      {/* 3. Main Editorial Flow */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Huge Editorial Hero with line-stagger masked reveal + asymmetrical layout + 3D art */}
        <HeroSection
          onOpenRatingModal={handleOpenRatingModal}
          reviewCount={reviews.length}
          averageRating={averageRating}
        />

        {/* Cinematic Image Element with clip-path inset reveal & parallax */}
        <CinematicImageBanner />

        {/* Editorial Contact Information + Spacious 01/02/03/04 Form + Magnetic Button */}
        <ContactSection
          onOpenRatingModal={handleOpenRatingModal}
          categoryOverride={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* Editorial Review Slider: One review at a time + Cursor Follower + Progress Bar */}
        <ReviewsSlider
          reviews={reviews}
          onOpenRatingModal={handleOpenRatingModal}
          onVoteHelpful={handleVoteHelpful}
        />

        {/* Visual Climax: HAVE AN IDEA? LET'S TALK */}
        <FinalCTA onOpenRatingModal={handleOpenRatingModal} />
      </main>

      {/* Minimal Monochrome Integrated Footer */}
      <Footer onOpenRatingModal={handleOpenRatingModal} />

      {/* Floating Action Button Desk */}
      <DynamicActionButton
        onOpenRatingModal={handleOpenRatingModal}
        selectedCategoryName={currentCategoryName}
      />

      {/* Rate Photography Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseRatingModal}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
