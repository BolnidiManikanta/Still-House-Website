"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./Navbar";
import AtmosphereOverlay from "./AtmosphereOverlay";
import AdminFloatingBar from "./admin/AdminFloatingBar";

import HomeView from "./views/HomeView";
import DreamscapesExperience from "./dreamscapes/DreamscapesExperience";
import ProjectExperience from "./project/experience";
import PortfolioExperience from "./portfolio/PortfolioExperience";
import FilmExperience from "./film/FilmExperience";
import KrishnaExperience from "./krishna/KrishnaExperience";
import ContactReviewsExperience from "./contact-reviews/ContactReviewsExperience";

interface NavigationContextType {
  currentPath: string;
  navigateTo: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentPath: "/",
  navigateTo: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export default function InstantViewRouter({ children }: { children: ReactNode }) {
  const router = useRouter();
  const nextPathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname || "/";
    }
    return nextPathname || "/";
  });

  // Sync with browser back/forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || "/";
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch {}
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update current path if Next.js router transitions (e.g. direct URL entry or admin)
  useEffect(() => {
    if (nextPathname && nextPathname === "/admin") {
      setCurrentPath("/admin");
    }
  }, [nextPathname]);

  const navigateTo = useCallback(
    (targetPath: string) => {
      let cleanPath = targetPath.split("#")[0].split("?")[0];
      if (cleanPath === "/dreamscapes") cleanPath = "/work";

      // If heading to admin, perform full router navigation
      if (cleanPath === "/admin" || cleanPath.startsWith("/admin")) {
        router.push("/admin");
        return;
      }

      // If already on this path, scroll to top
      if (cleanPath === currentPath) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Instantaneous Client Swap: Kill old scroll triggers, push state, reset scroll
      try {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      } catch {}

      window.history.pushState(null, "", cleanPath);
      setCurrentPath(cleanPath);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [currentPath, router]
  );

  // If inside admin editor, render children directly with standard admin layout
  if (currentPath === "/admin" || (nextPathname && nextPathname.startsWith("/admin"))) {
    return (
      <NavigationContext.Provider value={{ currentPath, navigateTo }}>
        <main className="relative w-full overflow-x-clip">
          {children}
        </main>
      </NavigationContext.Provider>
    );
  }

  // Instantaneous View Rendering in < 16ms (Zero server roundtrip, zero recompilation delays)
  const renderActiveView = () => {
    if (currentPath === "/work" || currentPath === "/dreamscapes") {
      return <DreamscapesExperience />;
    }
    if (currentPath.startsWith("/project")) {
      return <ProjectExperience slug="blueyard" />;
    }
    if (currentPath === "/portfolio") {
      return <PortfolioExperience />;
    }
    if (currentPath === "/film") {
      return <FilmExperience />;
    }
    if (currentPath === "/krishna") {
      return <KrishnaExperience />;
    }
    if (
      currentPath.startsWith("/contact") ||
      currentPath === "/reviews" ||
      currentPath === "/contact-reviews"
    ) {
      return <ContactReviewsExperience />;
    }
    // Default: Home Monograph
    return <HomeView />;
  };

  return (
    <NavigationContext.Provider value={{ currentPath, navigateTo }}>
      <AtmosphereOverlay />
      <Navbar />
      <main className="relative w-full overflow-x-clip">
        {renderActiveView()}
      </main>
      <AdminFloatingBar />
    </NavigationContext.Provider>
  );
}
