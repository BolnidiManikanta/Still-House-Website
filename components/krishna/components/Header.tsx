"use client";

import React, { useState } from 'react';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onOpenInquiry: (category?: string) => void;
  activeCategory: string;
  onSelectCategory: (key: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInquiry, activeCategory, onSelectCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-black/5 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a
          id="brand-logo"
          href="#top"
          className="group flex flex-col focus:outline-none"
        >
          <span className="text-[10px] tracking-[0.35em] font-semibold uppercase text-black/60 group-hover:text-black transition-colors">
            Krishna Photography
          </span>
          <span
            className="text-2xl font-normal tracking-tight font-serif italic text-[#1A1A1A]"
          >
            Studio & Stories
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav
          id="desktop-nav"
          className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.22em] uppercase font-medium"
        >
          <a
            id="nav-portfolio"
            href="#portfolio"
            className="text-black border-b border-black pb-0.5"
          >
            Portfolio
          </a>
          <a
            id="nav-featured"
            href="#featured"
            className="text-black/50 hover:text-black transition-colors"
          >
            Featured
          </a>
          <a
            id="nav-stories"
            href="#categories"
            className="text-black/50 hover:text-black transition-colors"
          >
            Categories
          </a>
          <a
            id="nav-about"
            href="#about-studio"
            className="text-black/50 hover:text-black transition-colors"
          >
            About
          </a>
          <a
            id="nav-contact"
            href="#contact-cta"
            className="text-black/50 hover:text-black transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-5">
          <a
            id="header-phone-link"
            href="tel:+919030943166"
            className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-black/60 hover:text-black transition-colors"
          >
            <Phone className="w-3 h-3 text-black/40" />
            <span>+91 90309 43166</span>
          </a>
          <button
            id="btn-header-enquire"
            onClick={() => onOpenInquiry()}
            className="text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#1A1A1A] text-white hover:bg-black transition-all rounded-none cursor-pointer flex items-center gap-1.5"
          >
            <span>Enquire</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            id="btn-mobile-enquire-quick"
            onClick={() => onOpenInquiry()}
            className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 bg-[#1A1A1A] text-white text-xs"
          >
            Enquire
          </button>
          <button
            id="btn-mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black/70 hover:text-black transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden border-t border-black/5 bg-[#FDFCFB] px-6 py-6 flex flex-col gap-4 text-[12px] tracking-[0.2em] uppercase font-medium animate-fadeIn"
        >
          <a
            id="mobile-nav-portfolio"
            href="#portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-black border-b border-black/10"
          >
            Portfolio Home
          </a>
          <a
            id="mobile-nav-featured"
            href="#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-black/60 hover:text-black border-b border-black/5"
          >
            Featured Works
          </a>
          <a
            id="mobile-nav-categories"
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-black/60 hover:text-black border-b border-black/5"
          >
            All 8 Categories
          </a>
          <a
            id="mobile-nav-contact"
            href="#contact-cta"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-black/60 hover:text-black border-b border-black/5"
          >
            Contact Studio
          </a>
          <div className="pt-3 flex flex-col gap-3">
            <a
              href="tel:+919030943166"
              className="text-[11px] tracking-[0.15em] text-black/60 flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 90309 43166</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInquiry();
              }}
              className="w-full py-3 bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase text-center"
            >
              Book A Session / Enquire
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
