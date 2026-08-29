"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type TransitionPersonality =
  | "home_to_work"
  | "home_to_project"
  | "home_to_portfolio"
  | "work_to_project"
  | "work_to_portfolio"
  | "work_to_home"
  | "project_to_work"
  | "project_to_home"
  | "project_to_portfolio"
  | "portfolio_to_home"
  | "portfolio_to_work"
  | "portfolio_to_project"
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
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const determinePersonality = (currentPath: string, targetHref: string): TransitionPersonality => {
    const cleanCurrent = currentPath === "/dreamscapes" ? "/work" : currentPath;
    const cleanTarget = targetHref === "/dreamscapes" ? "/work" : targetHref;

    if (cleanCurrent === "/" && cleanTarget === "/work") return "home_to_work";
    if (cleanCurrent === "/" && cleanTarget.startsWith("/project")) return "home_to_project";
    if (cleanCurrent === "/" && cleanTarget === "/portfolio") return "home_to_portfolio";

    if (cleanCurrent === "/work" && cleanTarget.startsWith("/project")) return "work_to_project";
    if (cleanCurrent === "/work" && cleanTarget === "/portfolio") return "work_to_portfolio";
    if (cleanCurrent === "/work" && cleanTarget === "/") return "work_to_home";

    if (cleanCurrent.startsWith("/project") && cleanTarget === "/work") return "project_to_work";
    if (cleanCurrent.startsWith("/project") && cleanTarget === "/") return "project_to_home";
    if (cleanCurrent.startsWith("/project") && cleanTarget === "/portfolio") return "project_to_portfolio";

    if (cleanCurrent === "/portfolio" && cleanTarget === "/") return "portfolio_to_home";
    if (cleanCurrent === "/portfolio" && cleanTarget === "/work") return "portfolio_to_work";
    if (cleanCurrent === "/portfolio" && cleanTarget.startsWith("/project")) return "portfolio_to_project";

    return "default";
  };

  const triggerTransition = (
    targetHref: string,
    customPersonality?: TransitionPersonality
  ) => {
    if (isTransitioning) return;
    
    // Normalize target href
    const destination = targetHref === "/dreamscapes" ? "/work" : targetHref;
    
    // Don't transition to identical route
    if (destination === pathname) return;

    const personality = customPersonality || determinePersonality(pathname, destination);
    setActivePersonality(personality);
    setIsTransitioning(true);

    const durationOut = reducedMotion ? 200 : 550;

    setTimeout(() => {
      router.push(destination);

      setTimeout(() => {
        setIsTransitioning(false);
      }, reducedMotion ? 200 : 450);
    }, durationOut);
  };

  // Render transition overlay per personality
  const renderOverlayContent = () => {
    if (reducedMotion) {
      return (
        <motion.div
          key="reduced-motion-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1]"
        />
      );
    }

    switch (activePersonality) {
      case "home_to_work":
        // EDITORIAL / SLIDE
        return (
          <motion.div
            key="home_to_work"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1] flex flex-col justify-between p-12 md:p-20 text-[#0A0A0A]"
          >
            <div className="flex justify-between items-center border-b border-[#0A0A0A]/15 pb-4 font-mono text-[11px] uppercase tracking-[0.25em]">
              <span>STILL STUDIO</span>
              <span>EDITORIAL SLIDE → WORK</span>
            </div>
            <div className="my-auto text-center">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#0A0A0A]/60 block mb-3"
              >
                MONOGRAPH VOL. 01
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]"
              >
                WORK GALLERY
              </motion.h2>
            </div>
            <div className="flex justify-between items-center border-t border-[#0A0A0A]/15 pt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#0A0A0A]/60">
              <span>FINE ART PHOTOGRAPHY</span>
              <span>2026</span>
            </div>
          </motion.div>
        );

      case "home_to_project":
        // IMAGE / PORTAL
        return (
          <motion.div
            key="home_to_project"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#E8E8E8] flex flex-col justify-between p-12 md:p-20 text-[#030303]"
          >
            <div className="flex justify-between items-center border-b border-black/10 pb-4 font-mono text-[11px] uppercase tracking-[0.25em]">
              <span>PROJECT PORTAL</span>
              <span>IMMERSIVE-G ENVIRONMENT</span>
            </div>
            <div className="my-auto text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1.0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block px-8 py-10 border border-black/15 bg-white/40 backdrop-blur-md mb-6"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/50 block mb-2">
                  CASE STUDY 01
                </span>
                <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl tracking-[-0.03em] uppercase">
                  BLUEYARD
                </h2>
              </motion.div>
            </div>
            <div className="flex justify-between items-center border-t border-black/10 pt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-black/50">
              <span>PROCEDURAL WEBGL</span>
              <span>ENTERING ENVIRONMENT ↓</span>
            </div>
          </motion.div>
        );

      case "home_to_portfolio":
        // LIGHT / EXPOSURE
        return (
          <motion.div
            key="home_to_portfolio"
            initial={{ opacity: 0, filter: "brightness(1)" }}
            animate={{ opacity: 1, filter: "brightness(1.15)" }}
            exit={{ opacity: 0, filter: "brightness(1)" }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#F5F5F2] flex flex-col justify-between p-12 md:p-20 text-[#080808]"
          >
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
              <span>EXPOSURE TRANSITION</span>
              <span>LIGHT EDITORIAL</span>
            </div>
            <div className="my-auto text-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="font-sans text-[11px] uppercase tracking-[0.4em] opacity-60 block mb-4"
              >
                PHOTOGRAPHY & VISUAL STORIES
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-serif font-light text-5xl md:text-7xl lg:text-9xl tracking-[-0.05em] uppercase"
              >
                ELENA VOSS
              </motion.h2>
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              <span>PORTFOLIO ARCHIVE</span>
              <span>2026</span>
            </div>
          </motion.div>
        );

      case "work_to_project":
        // MEDIA EXPANSION
        return (
          <motion.div
            key="work_to_project"
            initial={{ opacity: 0, clipPath: "inset(12% 12% 12% 12%)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#E8E8E8] flex items-center justify-center p-8 text-[#030303]"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] opacity-60 block mb-3">
                MEDIA EXPANSION → CASE STUDY
              </span>
              <h2 className="font-serif font-light text-5xl md:text-8xl tracking-[-0.04em] uppercase">
                BLUEYARD
              </h2>
            </div>
          </motion.div>
        );

      case "work_to_portfolio":
        // EDITORIAL WIPE
        return (
          <motion.div
            key="work_to_portfolio"
            initial={{ clipPath: "inset(0 0 0 100%)" }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            exit={{ clipPath: "inset(0 100% 0 0%)" }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#E8E8E5] flex flex-col justify-between p-12 md:p-20 text-[#080808]"
          >
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
              <span>EDITORIAL WIPE</span>
              <span>WORK → PORTFOLIO</span>
            </div>
            <div className="my-auto text-center">
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em] uppercase">
                PORTFOLIO ARCHIVE
              </h2>
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              <span>REYKJAVÍK · 2026</span>
              <span>EXPLORE</span>
            </div>
          </motion.div>
        );

      case "project_to_work":
        // REVERSE PORTAL
        return (
          <motion.div
            key="project_to_work"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1] flex items-center justify-center text-[#0A0A0A]"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#0A0A0A]/60 block mb-3">
                REVERSE PORTAL → GALLERY
              </span>
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]">
                WORK MONOGRAPH
              </h2>
            </div>
          </motion.div>
        );

      case "project_to_home":
        // FADE / ATMOSPHERIC RESET
        return (
          <motion.div
            key="project_to_home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-gradient-to-b from-[#EBE7E1] via-[#EBE7E1]/95 to-[#EBE7E1] flex items-center justify-center text-[#0A0A0A]"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#0A0A0A]/60 block mb-3">
                ATMOSPHERIC RESET
              </span>
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]">
                STILL STUDIO
              </h2>
            </div>
          </motion.div>
        );

      case "project_to_portfolio":
        // DARK -> LIGHT
        return (
          <motion.div
            key="project_to_portfolio"
            initial={{ backgroundColor: "#080808", color: "#e8e8e5", opacity: 0 }}
            animate={{ backgroundColor: "#e8e8e5", color: "#080808", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] opacity-60 block mb-3">
                SHADOW TO LIGHT
              </span>
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]">
                PORTFOLIO
              </h2>
            </div>
          </motion.div>
        );

      case "portfolio_to_home":
        // LIGHT EDITORIAL REVEAL
        return (
          <motion.div
            key="portfolio_to_home"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1] flex items-center justify-center text-[#0A0A0A]"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-[#0A0A0A]/60 block mb-3">
                LIGHT EDITORIAL REVEAL
              </span>
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]">
                HOMEPAGE
              </h2>
            </div>
          </motion.div>
        );

      case "portfolio_to_work":
        // DIRECTIONAL WIPE
        return (
          <motion.div
            key="portfolio_to_work"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            exit={{ clipPath: "inset(0 0% 0 100%)" }}
            transition={{ duration: 0.55, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1] flex flex-col justify-between p-12 md:p-20 text-[#0A0A0A]"
          >
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-70">
              <span>DIRECTIONAL WIPE</span>
              <span>PORTFOLIO → WORK</span>
            </div>
            <div className="my-auto text-center">
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl tracking-[-0.04em] uppercase">
                WORK GALLERY
              </h2>
            </div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">
              <span>MONOGRAPH VOL. 01</span>
              <span>2026</span>
            </div>
          </motion.div>
        );

      case "portfolio_to_project":
        // LIGHT -> IMMERSIVE
        return (
          <motion.div
            key="portfolio_to_project"
            initial={{ backgroundColor: "#E8E8E5", opacity: 0 }}
            animate={{ backgroundColor: "#E8E8E8", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none flex items-center justify-center text-[#030303]"
          >
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] opacity-60 block mb-3">
                LIGHT TO IMMERSIVE
              </span>
              <h2 className="font-serif font-light text-5xl md:text-7xl lg:text-8xl uppercase tracking-[-0.04em]">
                BLUEYARD
              </h2>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            key="default_transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
            className="fixed inset-0 z-[999999] pointer-events-none bg-[#EBE7E1] flex items-center justify-center text-[#0A0A0A]"
          >
            <div className="text-center">
              <h2 className="font-serif font-light text-5xl md:text-7xl uppercase tracking-[-0.04em]">
                STILL STUDIO
              </h2>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, activePersonality, transitionStage: isTransitioning ? 2 : 0, triggerTransition }}>
      <AnimatePresence mode="wait">
        {isTransitioning && renderOverlayContent()}
      </AnimatePresence>
      {children}
    </PageTransitionContext.Provider>
  );
}
