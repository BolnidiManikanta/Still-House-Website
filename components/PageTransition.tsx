"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

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
  const [activePersonality, setActivePersonality] = useState<TransitionPersonality>("default");

  // Pre-fetch all core navigation targets on mount for instantaneous, zero-delay loads
  useEffect(() => {
    const routes = ["/", "/work", "/project/blueyard", "/portfolio", "/film", "/krishna", "/contact-reviews"];
    routes.forEach((route) => {
      try {
        router.prefetch(route);
      } catch {
        // Ignore prefetch error on initial mount
      }
    });
  }, [router]);

  // When pathname changes, immediately conclude the transition state
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  const determinePersonality = (currentPath: string, targetHref: string): TransitionPersonality => {
    const cleanTarget = targetHref === "/dreamscapes" ? "/work" : targetHref;

    if (cleanTarget === "/work") return "to_work";
    if (cleanTarget.startsWith("/project")) return "to_project";
    if (cleanTarget === "/portfolio") return "to_portfolio";
    if (cleanTarget === "/film") return "to_film";
    if (cleanTarget === "/krishna") return "to_krishna";
    if (cleanTarget === "/") return "to_home";

    return "default";
  };

  const triggerTransition = (
    targetHref: string,
    customPersonality?: TransitionPersonality
  ) => {
    // Normalize target href
    const destination = targetHref === "/dreamscapes" ? "/work" : targetHref;

    // Don't transition to identical route
    if (destination === pathname) return;

    const personality = customPersonality || determinePersonality(pathname, destination);
    setActivePersonality(personality);
    setIsTransitioning(true);

    // Call router.push immediately with ZERO artificial delay for instant loading
    router.push(destination);

    // Safety timeout in case route is already cached and pathname doesn't re-trigger effect
    const safetyTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 250);

    return () => clearTimeout(safetyTimer);
  };

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        activePersonality,
        transitionStage: isTransitioning ? 2 : 0,
        triggerTransition,
      }}
    >
      {/* Sleek, non-blocking hairline progress bar giving instant feedback without hiding page content */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="instant-nav-indicator"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 0.95, opacity: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ transformOrigin: "0% 50%" }}
            className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#110F0E] z-[999999] pointer-events-none shadow-sm"
          />
        )}
      </AnimatePresence>
      {children}
    </PageTransitionContext.Provider>
  );
}
