"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-[#EBE7E1] py-16 px-[24px] md:px-[48px] lg:px-[80px] border-t border-[#110F0E]/15">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end text-[12px] uppercase tracking-[0.25em] text-[rgba(30,30,30,0.85)] font-light">
        <div className="mb-4 sm:mb-0">
          <span className="block font-medium text-[#110F0E] mb-1">STILL STUDIO MONOGRAPH</span>
          <span className="museum-label block">© 2026 — UNSEEN STUDIO RECREATION</span>
        </div>
        <div className="text-left sm:text-right">
          <span className="block mb-1">FINE ART PHOTOGRAPHY & ARCHITECTURE</span>
          <span className="museum-label block">NEUE MONTREAL & CORMORANT GARAMOND</span>
        </div>
      </div>
    </footer>
  );
}
