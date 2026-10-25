"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export type TransitionPersonality =
  | "to_work"
  | "to_project"
  | "to_portfolio"
  | "to_film"
  | "to_krishna"
  | "to_home"
  | "default";

interface PageTransitionContextType {
  isTransitioning: boolean;
  activePersonality: TransitionPersonality;
  transitionStage: number;
  triggerTransition: (targetHref: string, customPersonality?: TransitionPersonality) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
  activePersonality: "default",
  transitionStage: 0,
  triggerTransition: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  // Pre-fetch all core navigation targets on mount for instantaneous, zero-delay loads
  useEffect(() => {
    const routes = [
      "/",
      "/work",
      "/project/blueyard",
      "/portfolio",
      "/film",
      "/krishna",
      "/contact-reviews",
      "/admin",
    ];
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {
        // Safe ignore
      }
    });
  }, [router]);

  // When pathname changes, immediately conclude any progress indicator
  useEffect(() => {
    setIsTransitioning(false);
    if (barRef.current) {
      barRef.current.style.transform = "scaleX(1)";
      barRef.current.style.opacity = "0";
      setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.transform = "scaleX(0)";
        }
      }, 150);
    }
  }, [pathname]);

  const triggerTransition = useCallback(
    (targetHref: string) => {
      const destination = targetHref === "/dreamscapes" ? "/work" : targetHref;

      // Don't transition to identical route
      if (destination === pathname) return;

      // Fast hairline loading indicator via direct DOM style (zero React re-render lag)
      if (barRef.current) {
        barRef.current.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease";
        barRef.current.style.opacity = "1";
        barRef.current.style.transform = "scaleX(0.75)";
      }

      // Call router.push immediately with prefetching
      try {
        router.prefetch(destination);
      } catch {}
      router.push(destination);
    },
    [pathname, router]
  );

  const contextValue = useMemo<PageTransitionContextType>(
    () => ({
      isTransitioning,
      activePersonality: "default",
      transitionStage: isTransitioning ? 2 : 0,
      triggerTransition,
    }),
    [isTransitioning, triggerTransition]
  );

  return (
    <PageTransitionContext.Provider value={contextValue}>
      {/* Sleek hairline progress bar giving instant feedback without layout or re-render overhead */}
      <div
        ref={barRef}
        aria-hidden="true"
        style={{ transform: "scaleX(0)", transformOrigin: "0% 50%", opacity: 0 }}
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#110F0E] z-[999999] pointer-events-none transition-transform"
      />
      {children}
    </PageTransitionContext.Provider>
  );
}
