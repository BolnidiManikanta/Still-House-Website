"use client";

/**
 * Krishna Photography — Fine Art Visual Archive & Monograph Experience
 * Inspired by 25 Residences / Unseen Studio luxury editorial exhibition design.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { CentralExhibitionShowcase } from './components/CentralExhibitionShowcase';
import { CategoryStoryView } from './components/CategoryStoryView';
import { ExhibitionHeader } from './components/ExhibitionHeader';
import { LeftChaptersControl } from './components/LeftChaptersControl';
import { ExhibitionPeripherals } from './components/ExhibitionPeripherals';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Lightbox } from './components/Lightbox';
import { InquiryModal } from './components/InquiryModal';
import {
  CATEGORIES,
  PORTFOLIO_IMAGES,
  PortfolioImage,
} from './data/portfolioData';

export default function KrishnaExperience() {
  // Navigation & View State ('installation' = 3D scattered gallery, 'story' = full category editorial)
  const [currentView, setCurrentView] = useState<'installation' | 'story'>('installation');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('wedding');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Menu drawer state
  const [menuOpen, setMenuOpen] = useState(false);

  // Lightbox viewer state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Studio booking inquiry state
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>('WEDDING');

  // Handle URL hash on initial load and change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validCategory = CATEGORIES.find(
        (c) => c.key === hash || c.label.toLowerCase() === hash
      );

      if (validCategory) {
        setSelectedCategoryKey(validCategory.key);
        setCurrentView('story');
      } else {
        setCurrentView('installation');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Select category and enter the photographic story
  const handleSelectCategory = (categoryKey: string) => {
    setSelectedCategoryKey(categoryKey);
    setCurrentView('story');
    window.history.pushState(null, '', `#${categoryKey}`);
  };

  // Return from category story back to the 3D sculpture
  const handleBackToSculpture = () => {
    setCurrentView('installation');
    window.history.pushState(null, '', '#');
  };

  // Open Lightbox
  const handleOpenLightbox = (image: PortfolioImage) => {
    const pool = PORTFOLIO_IMAGES;
    const index = pool.findIndex((item) => item.id === image.id);
    setActiveImageIndex(index !== -1 ? index : 0);
    setLightboxOpen(true);
  };

  // Open Inquiry modal
  const handleOpenInquiry = (categoryName?: string) => {
    if (categoryName) {
      setInquiryCategory(categoryName);
    } else {
      const activeCat = CATEGORIES.find((c) => c.key === selectedCategoryKey);
      setInquiryCategory(activeCat ? activeCat.label : 'WEDDING');
    }
    setInquiryOpen(true);
  };

  // Active category index (0-7)
  const currentCategoryIndex = useMemo(() => {
    const idx = CATEGORIES.findIndex((c) => c.key === (hoveredCategory || selectedCategoryKey));
    return idx !== -1 ? idx : 0;
  }, [hoveredCategory, selectedCategoryKey]);

  // Active category object
  const activeCategoryInfo = useMemo(() => {
    return (
      CATEGORIES.find((c) => c.key === selectedCategoryKey) || CATEGORIES[0]
    );
  }, [selectedCategoryKey]);

  // Images for the active category
  const activeCategoryImages = useMemo(() => {
    return PORTFOLIO_IMAGES.filter((img) => img.category === selectedCategoryKey);
  }, [selectedCategoryKey]);

  return (
    <div
      className="krishna-page min-h-screen bg-[#ECE8E8] text-[#1F1F1F] overflow-x-hidden select-none font-sans relative"
    >
      {/* 25 Residences Inspired White-Grey Atmospheric Background with subtle drafting grid & inertia wash */}
      <AtmosphericBackground />

      {/* Exhibition Header (KRISHNA PHOTOGRAPHY | INQUIRE ↗ | Hamburger Menu) */}
      <ExhibitionHeader
        onOpenInquiry={() => handleOpenInquiry()}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        isMenuOpen={menuOpen}
        isInsideStory={currentView === 'story'}
        onBackToSculpture={handleBackToSculpture}
      />

      {/* Main Exhibition Stage */}
      <main className="relative z-10">
        {currentView === 'installation' ? (
          /* GALLERY EXHIBITION STAGE */
          <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            {/* Left-Side Chapters 08 Navigation */}
            <LeftChaptersControl
              activeCategory={selectedCategoryKey}
              onSelectCategory={handleSelectCategory}
              hoveredCategory={hoveredCategory}
              setHoveredCategory={setHoveredCategory}
            />

            {/* Central Archival Exhibition Showcase (7 Floating Floating Frames with Arch & Museum Placards) */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
              <CentralExhibitionShowcase
                selectedCategoryKey={selectedCategoryKey}
                onSelectCategory={handleSelectCategory}
                hoveredCategory={hoveredCategory}
                onOpenLightbox={handleOpenLightbox}
                onEnterStory={handleSelectCategory}
              />
            </div>

            {/* Editorial Links, Visual Archive Caption, and 01/08 Counter */}
            <ExhibitionPeripherals
              currentCategoryIndex={currentCategoryIndex}
              totalCategories={CATEGORIES.length}
              onNavigateSection={(sec) => {
                if (sec === 'photographs' || sec === 'stories') {
                  handleSelectCategory('wedding');
                } else if (sec === 'people') {
                  handleSelectCategory('portraits');
                } else if (sec === 'places') {
                  handleSelectCategory('pre-wedding');
                }
              }}
            />
          </div>
        ) : (
          /* CINEMATIC CATEGORY STORY EXPERIENCE */
          <div className="pt-20">
            <CategoryStoryView
              category={activeCategoryInfo}
              images={activeCategoryImages}
              onBack={handleBackToSculpture}
              onSelectCategory={handleSelectCategory}
              onImageClick={handleOpenLightbox}
              onInquire={handleOpenInquiry}
            />
          </div>
        )}
      </main>

      {/* Fullscreen Navigation Drawer (Opened via hamburger button) */}
      <NavigationDrawer
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={handleSelectCategory}
        onOpenInquiry={() => handleOpenInquiry()}
      />

      {/* Full-Screen High-Resolution Lightbox */}
      <Lightbox
        images={PORTFOLIO_IMAGES}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
        onInquireImage={(img) => handleOpenInquiry(img.categoryName.toUpperCase())}
      />

      {/* Studio Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultCategory={inquiryCategory}
      />
    </div>
  );
}
