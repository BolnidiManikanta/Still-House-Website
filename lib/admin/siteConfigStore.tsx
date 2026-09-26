"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  SiteConfig,
  GlobalEffectsConfig,
  HomeConfig,
  WorkConfig,
  WorkPlateItem,
  ProjectConfig,
  FilmConfig,
  KrishnaConfig,
  ContactReviewsConfig,
} from "./types";
import { DEFAULT_SITE_CONFIG } from "./defaultConfig";

const STORAGE_KEY = "still_studio_site_config_v1";
const ADMIN_AUTH_KEY = "still_studio_admin_auth";

interface SiteConfigContextType {
  config: SiteConfig;
  updateEffects: (effects: Partial<GlobalEffectsConfig>) => void;
  updateHome: (homeUpdates: Partial<HomeConfig>) => void;
  updateHomeHero: (heroUpdates: Partial<HomeConfig["hero"]>) => void;
  updateHomeCuratorial: (curatorialUpdates: Partial<HomeConfig["curatorial"]>) => void;
  updateHomeNextMonograph: (nextUpdates: Partial<HomeConfig["nextMonograph"]>) => void;
  updateWork: (workUpdates: Partial<WorkConfig>) => void;
  updateWorkPlate: (plateId: string, updates: Partial<WorkPlateItem>) => void;
  updateProject: (projectUpdates: Partial<ProjectConfig>) => void;
  updateFilm: (filmUpdates: Partial<FilmConfig>) => void;
  updateKrishna: (krishnaUpdates: Partial<KrishnaConfig>) => void;
  updateContactReviews: (crUpdates: Partial<ContactReviewsConfig>) => void;
  resetToDefaults: () => void;
  resetSection: (section: keyof SiteConfig) => void;
  importConfig: (jsonString: string) => { success: boolean; message: string };
  exportConfig: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  lastSaved: string | null;
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null);

function applyDomEffects(effects: GlobalEffectsConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Apply CSS custom variables
  root.style.setProperty("--studio-contrast", `${effects.contrast}%`);
  root.style.setProperty("--studio-brightness", `${effects.brightness}%`);
  root.style.setProperty("--studio-saturation", `${effects.saturation}%`);
  root.style.setProperty("--studio-sepia", `${effects.sepia}%`);
  root.style.setProperty("--studio-grain-opacity", `${effects.grainOpacity}`);
  root.style.setProperty("--studio-vignette-opacity", `${effects.vignetteIntensity}`);
  root.style.setProperty("--studio-fog-opacity", `${effects.fogOpacity}`);
  root.style.setProperty("--studio-glass-blur", `${effects.glassBlur}px`);
  root.style.setProperty("--studio-accent", effects.accentColor);
  root.style.setProperty("--studio-ambient", effects.ambientTint);

  // Apply root filter for global atmospheric color tone
  const filterVal = `contrast(${effects.contrast}%) brightness(${effects.brightness}%) saturate(${effects.saturation}%) sepia(${effects.sepia}%)`;
  root.style.setProperty("--studio-filter-composite", filterVal);
}

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load persisted config and admin session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // Sanitize broken/404 image URLs in previously saved configs
        const sanitized = stored
          .replaceAll('1541888946425-d0fbb186c5f7', '1509316975850-ff9c5deb0cd9')
          .replaceAll('1541888946425-d0fbb18086f6', '1509316975850-ff9c5deb0cd9');
        const parsed = JSON.parse(sanitized);
        // Deep merge with defaults so newly introduced keys are never undefined
        setConfig({
          effects: { ...DEFAULT_SITE_CONFIG.effects, ...(parsed.effects || {}) },
          home: {
            hero: { ...DEFAULT_SITE_CONFIG.home.hero, ...(parsed.home?.hero || {}) },
            curatorial: { ...DEFAULT_SITE_CONFIG.home.curatorial, ...(parsed.home?.curatorial || {}) },
            nextMonograph: { ...DEFAULT_SITE_CONFIG.home.nextMonograph, ...(parsed.home?.nextMonograph || {}) },
          },
          work: {
            ...DEFAULT_SITE_CONFIG.work,
            ...(parsed.work || {}),
            titleTypography: { ...DEFAULT_SITE_CONFIG.work.titleTypography, ...(parsed.work?.titleTypography || {}) },
            heroImageStyle: { ...DEFAULT_SITE_CONFIG.work.heroImageStyle, ...(parsed.work?.heroImageStyle || {}) },
            plates:
              parsed.work?.plates && parsed.work.plates.length > 0
                ? DEFAULT_SITE_CONFIG.work.plates.map((defaultPlate, idx) => {
                    const saved = parsed.work.plates.find((p: any) => p.id === defaultPlate.id) || parsed.work.plates[idx];
                    return saved
                      ? {
                          ...defaultPlate,
                          ...saved,
                          style: { ...defaultPlate.style, ...(saved.style || {}) },
                        }
                      : defaultPlate;
                  })
                : DEFAULT_SITE_CONFIG.work.plates,
          },
          project: {
            ...DEFAULT_SITE_CONFIG.project,
            ...(parsed.project || {}),
            titleTypography: { ...DEFAULT_SITE_CONFIG.project.titleTypography, ...(parsed.project?.titleTypography || {}) },
            primaryImageStyle: { ...DEFAULT_SITE_CONFIG.project.primaryImageStyle, ...(parsed.project?.primaryImageStyle || {}) },
            secondaryImageStyle: { ...DEFAULT_SITE_CONFIG.project.secondaryImageStyle, ...(parsed.project?.secondaryImageStyle || {}) },
          },
          film: {
            hero: { ...DEFAULT_SITE_CONFIG.film.hero, ...(parsed.film?.hero || {}) },
            projects: parsed.film?.projects || DEFAULT_SITE_CONFIG.film.projects,
          },
          krishna: {
            ...DEFAULT_SITE_CONFIG.krishna,
            ...(parsed.krishna || {}),
            categories: parsed.krishna?.categories || DEFAULT_SITE_CONFIG.krishna.categories,
          },
          contactReviews: {
            ...DEFAULT_SITE_CONFIG.contactReviews,
            ...(parsed.contactReviews || {}),
            categories: parsed.contactReviews?.categories || DEFAULT_SITE_CONFIG.contactReviews.categories,
            addons: parsed.contactReviews?.addons || DEFAULT_SITE_CONFIG.contactReviews.addons,
            reviews: parsed.contactReviews?.reviews || DEFAULT_SITE_CONFIG.contactReviews.reviews,
          },
        });
      }
    } catch (e) {
      console.warn("Failed to parse saved site config", e);
    }

    try {
      const auth = localStorage.getItem(ADMIN_AUTH_KEY);
      if (auth === "true") {
        setIsAdminState(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update DOM styles whenever effects change
  useEffect(() => {
    applyDomEffects(config.effects);
  }, [config.effects]);

  // Persist helper
  const persist = useCallback((nextConfig: SiteConfig) => {
    setConfig(nextConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
    } catch (e) {
      console.error("Failed to save site config to localStorage", e);
    }
  }, []);

  const setIsAdmin = useCallback((val: boolean) => {
    setIsAdminState(val);
    try {
      if (val) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const updateEffects = useCallback(
    (updates: Partial<GlobalEffectsConfig>) => {
      persist({
        ...config,
        effects: { ...config.effects, ...updates },
      });
    },
    [config, persist]
  );

  const updateHome = useCallback(
    (updates: Partial<HomeConfig>) => {
      persist({
        ...config,
        home: { ...config.home, ...updates },
      });
    },
    [config, persist]
  );

  const updateHomeHero = useCallback(
    (heroUpdates: Partial<HomeConfig["hero"]>) => {
      persist({
        ...config,
        home: {
          ...config.home,
          hero: { ...config.home.hero, ...heroUpdates },
        },
      });
    },
    [config, persist]
  );

  const updateHomeCuratorial = useCallback(
    (curatorialUpdates: Partial<HomeConfig["curatorial"]>) => {
      persist({
        ...config,
        home: {
          ...config.home,
          curatorial: { ...config.home.curatorial, ...curatorialUpdates },
        },
      });
    },
    [config, persist]
  );

  const updateHomeNextMonograph = useCallback(
    (nextUpdates: Partial<HomeConfig["nextMonograph"]>) => {
      persist({
        ...config,
        home: {
          ...config.home,
          nextMonograph: { ...config.home.nextMonograph, ...nextUpdates },
        },
      });
    },
    [config, persist]
  );

  const updateWork = useCallback(
    (workUpdates: Partial<WorkConfig>) => {
      persist({
        ...config,
        work: { ...config.work, ...workUpdates },
      });
    },
    [config, persist]
  );

  const updateWorkPlate = useCallback(
    (plateId: string, updates: Partial<WorkPlateItem>) => {
      const currentPlates = config.work.plates || DEFAULT_SITE_CONFIG.work.plates;
      const updatedPlates = currentPlates.map((plate) => {
        if (plate.id === plateId) {
          return {
            ...plate,
            ...updates,
            style: updates.style ? { ...plate.style, ...updates.style } : plate.style,
          };
        }
        return plate;
      });
      persist({
        ...config,
        work: {
          ...config.work,
          plates: updatedPlates,
        },
      });
    },
    [config, persist]
  );

  const updateProject = useCallback(
    (projectUpdates: Partial<ProjectConfig>) => {
      persist({
        ...config,
        project: { ...config.project, ...projectUpdates },
      });
    },
    [config, persist]
  );

  const updateFilm = useCallback(
    (updates: Partial<FilmConfig>) => {
      persist({
        ...config,
        film: { ...config.film, ...updates },
      });
    },
    [config, persist]
  );

  const updateKrishna = useCallback(
    (updates: Partial<KrishnaConfig>) => {
      persist({
        ...config,
        krishna: { ...config.krishna, ...updates },
      });
    },
    [config, persist]
  );

  const updateContactReviews = useCallback(
    (updates: Partial<ContactReviewsConfig>) => {
      persist({
        ...config,
        contactReviews: { ...config.contactReviews, ...updates },
      });
    },
    [config, persist]
  );

  const resetToDefaults = useCallback(() => {
    persist(DEFAULT_SITE_CONFIG);
  }, [persist]);

  const resetSection = useCallback(
    (section: keyof SiteConfig) => {
      persist({
        ...config,
        [section]: DEFAULT_SITE_CONFIG[section],
      });
    },
    [config, persist]
  );

  const importConfig = useCallback(
    (jsonString: string): { success: boolean; message: string } => {
      try {
        const sanitized = jsonString
          .replaceAll('1541888946425-d0fbb186c5f7', '1509316975850-ff9c5deb0cd9')
          .replaceAll('1541888946425-d0fbb18086f6', '1509316975850-ff9c5deb0cd9');
        const parsed = JSON.parse(sanitized);
        if (!parsed || typeof parsed !== "object") {
          return { success: false, message: "Invalid JSON format: must be an object" };
        }
        // Merge with defaults to prevent corrupted partial configs
        const merged: SiteConfig = {
          effects: { ...DEFAULT_SITE_CONFIG.effects, ...(parsed.effects || {}) },
          home: {
            hero: { ...DEFAULT_SITE_CONFIG.home.hero, ...(parsed.home?.hero || {}) },
            curatorial: { ...DEFAULT_SITE_CONFIG.home.curatorial, ...(parsed.home?.curatorial || {}) },
            nextMonograph: { ...DEFAULT_SITE_CONFIG.home.nextMonograph, ...(parsed.home?.nextMonograph || {}) },
          },
          work: {
            ...DEFAULT_SITE_CONFIG.work,
            ...(parsed.work || {}),
          },
          project: {
            ...DEFAULT_SITE_CONFIG.project,
            ...(parsed.project || {}),
          },
          film: {
            hero: { ...DEFAULT_SITE_CONFIG.film.hero, ...(parsed.film?.hero || {}) },
            projects: parsed.film?.projects || DEFAULT_SITE_CONFIG.film.projects,
          },
          krishna: {
            ...DEFAULT_SITE_CONFIG.krishna,
            ...(parsed.krishna || {}),
            categories: parsed.krishna?.categories || DEFAULT_SITE_CONFIG.krishna.categories,
          },
          contactReviews: {
            ...DEFAULT_SITE_CONFIG.contactReviews,
            ...(parsed.contactReviews || {}),
            categories: parsed.contactReviews?.categories || DEFAULT_SITE_CONFIG.contactReviews.categories,
            addons: parsed.contactReviews?.addons || DEFAULT_SITE_CONFIG.contactReviews.addons,
            reviews: parsed.contactReviews?.reviews || DEFAULT_SITE_CONFIG.contactReviews.reviews,
          },
        };
        persist(merged);
        return { success: true, message: "Configuration successfully imported & live synced" };
      } catch (e: any) {
        return { success: false, message: `JSON Parse error: ${e?.message || "unknown"}` };
      }
    },
    [persist]
  );

  const exportConfig = useCallback(() => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `still-studio-site-config-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error("Export failed", e);
    }
  }, [config]);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateEffects,
        updateHome,
        updateHomeHero,
        updateHomeCuratorial,
        updateHomeNextMonograph,
        updateWork,
        updateWorkPlate,
        updateProject,
        updateFilm,
        updateKrishna,
        updateContactReviews,
        resetToDefaults,
        resetSection,
        importConfig,
        exportConfig,
        isAdmin,
        setIsAdmin,
        lastSaved,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return ctx;
};
