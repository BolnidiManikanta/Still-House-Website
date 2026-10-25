"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useNavigation } from "./InstantViewRouter";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentPath, navigateTo } = useNavigation();
  const activePath = currentPath || pathname;

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let scrollRaf: number | null = null;
    let lastScrolled = false;
    let lastVisible = true;

    const handleScroll = () => {
      if (scrollRaf !== null) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = null;
        const currentScrollY = window.scrollY;
        const newScrolled = currentScrollY > 40;
        if (newScrolled !== lastScrolled) {
          lastScrolled = newScrolled;
          setScrolled(newScrolled);
        }

        const isHomepageHero = activePath === "/" && currentScrollY < window.innerHeight * 2.5;
        let newVisible = true;
        if (isHomepageHero) {
          newVisible = true;
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
          newVisible = false;
        } else {
          newVisible = true;
        }
        lastScrollY.current = currentScrollY;

        if (newVisible !== lastVisible) {
          lastVisible = newVisible;
          setVisible(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activePath]);

  if (activePath === "/admin") {
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
      <div className="flex items-center" data-cursor="OPEN">
        <Link
          id="nav-logo-btn"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/");
          }}
          className="glass-capsule px-5 py-2.5 rounded-full text-left group focus:outline-none active:scale-95 transition-transform duration-150 cursor-pointer block"
        >
          <span className="block text-[12px] uppercase tracking-[0.12em] font-medium text-[rgba(45,45,45,0.88)]">
            STILL <span className="text-[rgba(45,45,45,0.60)] font-normal">/ STUDIO</span>
          </span>
        </Link>
      </div>

      {/* Navigation Pills: Accessible across all monograph pages for instantaneous 0ms page switching */}
      <nav className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 overflow-x-auto py-1 max-w-[82vw]">
        <Link
          id="nav-work-btn"
          href="/work"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/work");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath === "/work" || activePath === "/dreamscapes"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          WORK
        </Link>

        <Link
          id="nav-project-btn"
          href="/project/blueyard"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/project/blueyard");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath.startsWith("/project")
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          PROJECT
        </Link>

        <Link
          id="nav-portfolio-btn"
          href="/portfolio"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/portfolio");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath === "/portfolio"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          PORTFOLIO
        </Link>

        <Link
          id="nav-film-btn"
          href="/film"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/film");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath === "/film"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          FILM
        </Link>

        <Link
          id="nav-krishna-btn"
          href="/krishna"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/krishna");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath === "/krishna"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          KRISHNA
        </Link>

        <Link
          id="nav-contact-reviews-btn"
          href="/contact-reviews"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("/contact-reviews");
          }}
          className={`glass-capsule px-4 md:px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer ${
            activePath.startsWith("/contact") || activePath === "/reviews"
              ? "opacity-100 ring-1 ring-black/20"
              : "opacity-85 hover:opacity-100"
          }`}
          data-cursor="OPEN"
        >
          CONTACT & REVIEW
        </Link>

        <Link
          id="nav-admin-btn"
          href="/admin"
          onClick={() => navigateTo("/admin")}
          className="glass-capsule px-3.5 md:px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.14em] font-mono font-medium focus:outline-none transition-all active:scale-95 duration-150 cursor-pointer opacity-75 hover:opacity-100 border border-black/10 hover:border-black/30"
          data-cursor="ADMIN"
        >
          ADMIN ⚙
        </Link>
      </nav>
    </header>
  );
}
