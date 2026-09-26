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
  VisualElementOverride,
  PageTransitionConfig,
} from "./types";
import { DEFAULT_SITE_CONFIG } from "./defaultConfig";

const STORAGE_KEY = "still_studio_site_config_v1";
const DRAFT_STORAGE_KEY = "still_studio_admin_draft_v1";
const ADMIN_AUTH_KEY = "still_studio_admin_auth";

interface SiteConfigContextType {
  config: SiteConfig;
  draftConfig: SiteConfig;
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
  updateElementOverride: (id: string, override: Partial<VisualElementOverride>) => void;
  resetElementOverride: (id: string) => void;
  resetPageOverrides: (page: string) => void;
  saveDraft: () => void;
  publishLive: () => void;
  resetToDefaults: () => void;
  resetSection: (section: keyof SiteConfig) => void;
  importConfig: (jsonString: string) => { success: boolean; message: string };
  exportConfig: () => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  lastSaved: string | null;
  lastPublished: string | null;
  hasUnpublishedChanges: boolean;
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
  const [draftConfig, setDraftConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isAdmin, setIsAdminState] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(false);

  // Load persisted config and admin session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let publishedParsed: SiteConfig | null = null;
      if (stored) {
        const sanitized = stored
          .replaceAll('1541888946425-d0fbb186c5f7', '1509316975850-ff9c5deb0cd9')
          .replaceAll('1541888946425-d0fbb18086f6', '1509316975850-ff9c5deb0cd9');
        const parsed = JSON.parse(sanitized);
        publishedParsed = {
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
          elementOverrides: parsed.elementOverrides || {},
          pageTransitions: parsed.pageTransitions || { type: "fade", duration: 300, easing: "easeOut", direction: "forward" },
          publishedAt: parsed.publishedAt || null,
        };
        setConfig(publishedParsed);
        if (publishedParsed.publishedAt) {
          setLastPublished(new Date(publishedParsed.publishedAt).toLocaleTimeString());
        }
      }

      // Check draft storage
      const draftStored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draftStored) {
        const draftParsed = JSON.parse(draftStored);
        const base = publishedParsed || DEFAULT_SITE_CONFIG;
        const mergedDraft: SiteConfig = {
          ...base,
          ...draftParsed,
          elementOverrides: { ...(base.elementOverrides || {}), ...(draftParsed.elementOverrides || {}) },
        };
        setDraftConfig(mergedDraft);
        setHasUnpublishedChanges(true);
      } else {
        setDraftConfig(publishedParsed || DEFAULT_SITE_CONFIG);
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

  // Working update helper: updates both draft and live memory config for seamless instant preview
  const updateDraft = useCallback((nextConfig: SiteConfig) => {
    setDraftConfig(nextConfig);
    setConfig(nextConfig);
    setHasUnpublishedChanges(true);
  }, []);

  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftConfig));
      const now = new Date();
      setLastSaved(now.toLocaleTimeString());
    } catch (e) {
      console.error("Failed to save draft to localStorage", e);
    }
  }, [draftConfig]);

  const publishLive = useCallback(() => {
    try {
      const published = {
        ...draftConfig,
        publishedAt: new Date().toISOString(),
      };
      setConfig(published);
      setDraftConfig(published);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(published));
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasUnpublishedChanges(false);
      const timeStr = new Date().toLocaleTimeString();
      setLastSaved(timeStr);
      setLastPublished(timeStr);
      // Dispatch storage event to sync any open tabs
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to publish site config", e);
    }
  }, [draftConfig]);

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
      updateDraft({
        ...draftConfig,
        effects: { ...draftConfig.effects, ...updates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateHome = useCallback(
    (updates: Partial<HomeConfig>) => {
      updateDraft({
        ...draftConfig,
        home: { ...draftConfig.home, ...updates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateHomeHero = useCallback(
    (heroUpdates: Partial<HomeConfig["hero"]>) => {
      updateDraft({
        ...draftConfig,
        home: {
          ...draftConfig.home,
          hero: { ...draftConfig.home.hero, ...heroUpdates },
        },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateHomeCuratorial = useCallback(
    (curatorialUpdates: Partial<HomeConfig["curatorial"]>) => {
      updateDraft({
        ...draftConfig,
        home: {
          ...draftConfig.home,
          curatorial: { ...draftConfig.home.curatorial, ...curatorialUpdates },
        },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateHomeNextMonograph = useCallback(
    (nextUpdates: Partial<HomeConfig["nextMonograph"]>) => {
      updateDraft({
        ...draftConfig,
        home: {
          ...draftConfig.home,
          nextMonograph: { ...draftConfig.home.nextMonograph, ...nextUpdates },
        },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateWork = useCallback(
    (workUpdates: Partial<WorkConfig>) => {
      updateDraft({
        ...draftConfig,
        work: { ...draftConfig.work, ...workUpdates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateWorkPlate = useCallback(
    (plateId: string, updates: Partial<WorkPlateItem>) => {
      const currentPlates = draftConfig.work.plates || DEFAULT_SITE_CONFIG.work.plates;
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
      updateDraft({
        ...draftConfig,
        work: {
          ...draftConfig.work,
          plates: updatedPlates,
        },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateProject = useCallback(
    (projectUpdates: Partial<ProjectConfig>) => {
      updateDraft({
        ...draftConfig,
        project: { ...draftConfig.project, ...projectUpdates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateFilm = useCallback(
    (updates: Partial<FilmConfig>) => {
      updateDraft({
        ...draftConfig,
        film: { ...draftConfig.film, ...updates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateKrishna = useCallback(
    (updates: Partial<KrishnaConfig>) => {
      updateDraft({
        ...draftConfig,
        krishna: { ...draftConfig.krishna, ...updates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateContactReviews = useCallback(
    (updates: Partial<ContactReviewsConfig>) => {
      updateDraft({
        ...draftConfig,
        contactReviews: { ...draftConfig.contactReviews, ...updates },
      });
    },
    [draftConfig, updateDraft]
  );

  const updateElementOverride = useCallback(
    (id: string, override: Partial<VisualElementOverride>) => {
      const existing = (draftConfig.elementOverrides || {})[id] || {
        id,
        page: "/",
        name: id,
        elementType: "text",
        selector: `[data-admin-id="${id}"]`,
        styles: {},
      };

      const updatedOverrides = {
        ...(draftConfig.elementOverrides || {}),
        [id]: {
          ...existing,
          ...override,
          styles: {
            ...existing.styles,
            ...(override.styles || {}),
          },
          hoverStyles: {
            ...(existing.hoverStyles || {}),
            ...(override.hoverStyles || {}),
          },
          animation: {
            ...(existing.animation || {
              type: "none",
              duration: 800,
              delay: 0,
              easing: "ease-out",
              trigger: "load",
              repeat: "once",
              intensity: 50,
            }),
            ...(override.animation || {}),
          },
          scrollEffect: {
            ...(existing.scrollEffect || {
              type: "none",
              triggerPosition: "center",
              start: "top bottom",
              end: "bottom top",
              speed: 1.0,
              intensity: 50,
              direction: "up",
            }),
            ...(override.scrollEffect || {}),
          },
        },
      };

      updateDraft({
        ...draftConfig,
        elementOverrides: updatedOverrides,
      });
    },
    [draftConfig, updateDraft]
  );

  const resetElementOverride = useCallback(
    (id: string) => {
      const current = { ...(draftConfig.elementOverrides || {}) };
      delete current[id];
      updateDraft({
        ...draftConfig,
        elementOverrides: current,
      });
    },
    [draftConfig, updateDraft]
  );

  const resetPageOverrides = useCallback(
    (page: string) => {
      const current = { ...(draftConfig.elementOverrides || {}) };
      Object.keys(current).forEach((key) => {
        if (current[key]?.page === page) {
          delete current[key];
        }
      });
      updateDraft({
        ...draftConfig,
        elementOverrides: current,
      });
    },
    [draftConfig, updateDraft]
  );

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    setConfig(DEFAULT_SITE_CONFIG);
    setDraftConfig(DEFAULT_SITE_CONFIG);
    setHasUnpublishedChanges(false);
    setLastSaved(new Date().toLocaleTimeString());
    setLastPublished(new Date().toLocaleTimeString());
  }, []);

  const resetSection = useCallback(
    (section: keyof SiteConfig) => {
      updateDraft({
        ...draftConfig,
        [section]: DEFAULT_SITE_CONFIG[section],
      });
    },
    [draftConfig, updateDraft]
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
        updateDraft(merged);
        return { success: true, message: "Configuration successfully imported & live synced" };
      } catch (e: any) {
        return { success: false, message: `JSON Parse error: ${e?.message || "unknown"}` };
      }
    },
    [updateDraft]
  );

  const exportConfig = useCallback(() => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftConfig, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `still-studio-site-config-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error("Export failed", e);
    }
  }, [draftConfig]);

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        draftConfig,
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
        updateElementOverride,
        resetElementOverride,
        resetPageOverrides,
        saveDraft,
        publishLive,
        resetToDefaults,
        resetSection,
        importConfig,
        exportConfig,
        isAdmin,
        setIsAdmin,
        lastSaved,
        lastPublished,
        hasUnpublishedChanges,
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
