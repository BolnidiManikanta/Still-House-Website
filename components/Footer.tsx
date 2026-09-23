"use client";

import Link from "next/link";
import { usePageTransition } from "@/components/PageTransition";

export default function Footer() {
  const { triggerTransition } = usePageTransition();

  return (
    <footer className="w-full bg-[#EBE7E1] py-16 px-[24px] md:px-[48px] lg:px-[80px] border-t border-[#110F0E]/15">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end text-[12px] uppercase tracking-[0.25em] text-[rgba(30,30,30,0.85)] font-light">
        <div className="mb-6 sm:mb-0">
          <span className="block font-medium text-[#110F0E] mb-1">STILL STUDIO MONOGRAPH</span>
          <span className="museum-label block">© 2026 — UNSEEN STUDIO RECREATION</span>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <Link
            href="/contact-reviews"
            prefetch={true}
            id="footer-contact-reviews-btn"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#110F0E]/20 bg-white/70 hover:bg-[#110F0E] hover:text-[#EBE7E1] text-[#110F0E] text-[10px] font-mono uppercase tracking-[0.22em] transition-all cursor-pointer shadow-xs"
          >
            <span>Contact &amp; Collector Reviews</span>
            <span>↗</span>
          </Link>
          <div className="text-left sm:text-right">
            <span className="block mb-1">FINE ART PHOTOGRAPHY &amp; ARCHITECTURE</span>
            <span className="museum-label block">NEUE MONTREAL &amp; CORMORANT GARAMOND</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
