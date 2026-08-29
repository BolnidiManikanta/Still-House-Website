"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";

export default function Navbar() {
  const { triggerTransition } = usePageTransition();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 px-[24px] md:px-[48px] lg:px-[80px] flex justify-between items-center ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      } ${
        scrolled ? "py-4" : "py-6 md:py-8"
      }`}
    >
      {/* Brand / Logo Floating Glass Capsule */}
      <div className="flex items-center" data-cursor="OPEN" data-magnetic>
        <button
          onClick={() => triggerTransition("/")}
          className="glass-capsule px-5 py-2.5 rounded-full text-left group focus:outline-none"
        >
          <span className="block text-[12px] uppercase tracking-[0.12em] font-medium text-[rgba(45,45,45,0.88)]">
            STILL <span className="text-[rgba(45,45,45,0.60)] font-normal">/ STUDIO</span>
          </span>
        </button>
      </div>

      {/* Navigation Pills: WORK, PROJECT, PORTFOLIO */}
      <nav className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={() => triggerTransition("/work")}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-opacity ${
            pathname === "/work" || pathname === "/dreamscapes"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
          data-magnetic
        >
          WORK
        </button>

        <button
          onClick={() => triggerTransition("/project/blueyard")}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-opacity ${
            pathname.startsWith("/project")
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
          data-magnetic
        >
          PROJECT
        </button>

        <button
          onClick={() => triggerTransition("/portfolio")}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-opacity ${
            pathname === "/portfolio"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
          data-magnetic
        >
          PORTFOLIO
        </button>
      </nav>
    </header>
  );
}
