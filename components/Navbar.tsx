"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { usePageTransition } from "./PageTransition";

export default function Navbar() {
  const router = useRouter();
  const { triggerTransition } = usePageTransition();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      // On homepage, remain visible throughout hero scroll-scrubbed transformation
      const isHomepageHero = pathname === "/" && currentScrollY < window.innerHeight * 2.5;

      if (isHomepageHero) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isWorkPage = pathname === "/work" || pathname === "/dreamscapes";
  const isProjectPage = pathname.startsWith("/project");
  const isPortfolioPage = pathname === "/portfolio";
  const isFilmPage = pathname === "/film";
  const hideNavButtons = isWorkPage || isProjectPage || isPortfolioPage || isFilmPage;

  if (pathname === "/krishna" || pathname.startsWith("/contact") || pathname === "/reviews" || pathname === "/admin") {
    return null;
  }

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
        <Link
          id="nav-logo-btn"
          href="/"
          prefetch={true}
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              triggerTransition("/");
            }
          }}
          className="glass-capsule px-5 py-2.5 rounded-full text-left group focus:outline-none active:scale-95 transition-transform duration-150 cursor-pointer block"
        >
          <span className="block text-[12px] uppercase tracking-[0.12em] font-medium text-[rgba(45,45,45,0.88)]">
            STILL <span className="text-[rgba(45,45,45,0.60)] font-normal">/ STUDIO</span>
          </span>
        </Link>
      </div>

      {/* Navigation Pills: Hidden on work, project, portfolio, and film pages so only Still Studio button remains */}
      {!hideNavButtons && (
        <nav className="flex items-center space-x-2 md:space-x-3">
          <Link
            id="nav-work-btn"
            href="/work"
            prefetch={true}
            onClick={() => triggerTransition("/work")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname === "/work" || pathname === "/dreamscapes"
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            WORK
          </Link>

          <Link
            id="nav-project-btn"
            href="/project/blueyard"
            prefetch={true}
            onClick={() => triggerTransition("/project/blueyard")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname.startsWith("/project")
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            PROJECT
          </Link>

          <Link
            id="nav-portfolio-btn"
            href="/portfolio"
            prefetch={true}
            onClick={() => triggerTransition("/portfolio")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname === "/portfolio"
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            PORTFOLIO
          </Link>

          <Link
            id="nav-film-btn"
            href="/film"
            prefetch={true}
            onClick={() => triggerTransition("/film")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname === "/film"
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            FILM
          </Link>

          <Link
            id="nav-krishna-btn"
            href="/krishna"
            prefetch={true}
            onClick={() => triggerTransition("/krishna")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname === "/krishna"
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            KRISHNA
          </Link>

          <Link
            id="nav-contact-reviews-btn"
            href="/contact-reviews"
            prefetch={true}
            onClick={() => triggerTransition("/contact-reviews")}
            className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
              pathname.startsWith("/contact") || pathname === "/reviews"
                ? "opacity-100 ring-1 ring-black/20"
                : "opacity-85 hover:opacity-100"
            }`}
            data-cursor="OPEN"
            data-magnetic
          >
            CONTACT & REVIEW
          </Link>

          <Link
            id="nav-admin-btn"
            href="/admin"
            prefetch={true}
            onClick={() => triggerTransition("/admin")}
            className="glass-capsule px-3.5 md:px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-mono font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer opacity-75 hover:opacity-100 border border-black/10 hover:border-black/30"
            data-cursor="ADMIN"
            data-magnetic
          >
            ADMIN ⚙
          </Link>
        </nav>
      )}
    </header>
  );
}
