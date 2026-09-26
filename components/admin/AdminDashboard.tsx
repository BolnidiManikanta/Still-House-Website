"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Sliders,
  Home,
  Layers,
  Compass,
  Film,
  Camera,
  MessageSquareQuote,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  Eye,
  EyeOff,
  Unlock,
  CheckCircle2,
  Plus,
  Trash2,
  Type,
  ImageIcon,
  FileText,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
} from "lucide-react";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";
import { TypographyEditor } from "./TypographyEditor";
import { ImageEffectsEditor } from "./ImageEffectsEditor";
import { PRESET_IMAGE_GALLERY, DEFAULT_SITE_CONFIG } from "@/lib/admin/defaultConfig";
import { WorkPlateItem } from "@/lib/admin/types";
import { getImageFilterStyles } from "@/lib/admin/styleHelpers";

export type AdminPageTab = "home" | "work" | "project" | "film" | "krishna" | "contactReviews" | "effects" | "backup";
export type EditFacet = "matter" | "typography" | "imagery";

export default function AdminDashboard() {
  const {
    config,
    updateEffects,
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
  } = useSiteConfig();

  // Sidebar Page Selection
  const [activeTab, setActiveTab] = useState<AdminPageTab>("home");

  // Granular Sub-facet for the selected page
  const [activeFacet, setActiveFacet] = useState<EditFacet>("matter");

  // Home page sub-section
  const [homeSection, setHomeSection] = useState<"hero" | "curatorial" | "next">("hero");

  // Work page imagery selection
  const [selectedWorkPlateId, setSelectedWorkPlateId] = useState<string>("work-plate-01");
  const [workImageryMode, setWorkImageryMode] = useState<"plates" | "hero">("plates");

  // PIN gate state
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Live preview drawer state
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);

  // Import JSON Modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "still2026" || pinInput.trim() === "admin") {
      setIsAdmin(true);
      setAuthError(false);
      showToast("Admin session unlocked.");
    } else {
      setAuthError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAdmin(true);
    setAuthError(false);
    showToast("Quick reviewer access granted.");
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const res = importConfig(importJsonText.trim());
    if (res.success) {
      setShowImportModal(false);
      setImportJsonText("");
      showToast(res.message);
      setPreviewKey((k) => k + 1);
    } else {
      setImportStatus(res.message);
    }
  };

  const getPreviewUrl = () => {
    switch (activeTab) {
      case "home":
        return "/";
      case "work":
        return "/work";
      case "project":
        return "/project/blueyard";
      case "film":
        return "/film";
      case "krishna":
        return "/krishna";
      case "contactReviews":
        return "/contact-reviews";
      default:
        return "/";
    }
  };

  // --- RENDER PIN GATE IF NOT AUTHENTICATED ---
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#110F0E] text-[#EDEAE4] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        <div className="w-full max-w-md bg-[#1C1A18] border border-white/15 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-white/50 block mb-2">
              STILL STUDIO · ARCHITECTURAL CMS
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-white mb-2">
              Studio Admin Portal
            </h1>
            <p className="text-xs text-white/60 font-sans">
              Dynamic page editor: matter, font styles, font sizes, font effects, image resize &amp; filters.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase font-mono tracking-wider text-white/70 mb-1.5">
                Passcode / PIN (Default: still2026)
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter PIN..."
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-rose-400 text-xs mt-1.5 font-mono">
                  Incorrect PIN. Please use: still2026
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Unlock Admin Access</span>
            </button>
          </form>

          {/* Quick Reviewer One-Click Bypass */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-white/50 mb-3 font-mono">
              Reviewer or Testing Mode?
            </p>
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full py-2.5 rounded-lg border border-white/20 hover:border-white/40 text-white/80 hover:text-white text-xs font-mono tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Click Instant Access</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NAVIGATION CONFIGURATION FOR SIDEBAR ---
  const PAGES = [
    { id: "home", label: "Home", path: "/", icon: Home, desc: "Hero, Curatorial & Next Monograph" },
    { id: "work", label: "Work", path: "/work", icon: Layers, desc: "Dreamscapes Monograph Volume 01" },
    { id: "project", label: "Project", path: "/project/blueyard", icon: Compass, desc: "Blueyard & Constellation Void" },
    { id: "film", label: "Film", path: "/film", icon: Film, desc: "Architectural Reliefs & Creative Studio" },
    { id: "krishna", label: "Krishna", path: "/krishna", icon: Camera, desc: "Visual Archive, Monographs & Stories" },
    { id: "contactReviews", label: "Contact & Review", path: "/contact-reviews", icon: MessageSquareQuote, desc: "Atelier Rates, Booking & Testimonials" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#EDEAE4] flex flex-col font-sans">
      {/* TOP NOTIFICATION TOAST */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-400 text-black px-4 py-2.5 rounded-lg shadow-xl font-mono text-xs flex items-center gap-2 border border-black/20 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ADMIN BAR */}
      <header className="h-16 border-b border-white/10 bg-[#141414] px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-light tracking-wide text-white uppercase">
                STILL STUDIO
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                Dynamic CMS
              </span>
            </div>
            {lastSaved && (
              <span className="text-[9px] font-mono text-white/40 block">
                Live sync active · Saved at {lastSaved}
              </span>
            )}
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Live Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
              showLivePreview
                ? "bg-amber-400 text-black border-amber-300 font-semibold shadow-md"
                : "bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            {showLivePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showLivePreview ? "Hide Preview" : "Split Live Preview"}</span>
          </button>

          {/* Direct Link to Current Page */}
          <Link
            href={getPreviewUrl()}
            target="_blank"
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Live Page</span>
          </Link>

          {/* Lock Admin */}
          <button
            type="button"
            onClick={() => {
              setIsAdmin(false);
              showToast("Admin session locked.");
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors uppercase tracking-wider"
          >
            Lock
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT: LEFT SIDEBAR + MAIN EDITOR + OPTIONAL LIVE PREVIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* =================================================================== */}
        {/* LEFT DASHBOARD SIDEBAR (All Pages Cleanly Listed)                   */}
        {/* =================================================================== */}
        <aside className="w-64 md:w-72 bg-[#121212] border-r border-white/10 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Sidebar Label */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block mb-3 px-2">
                All Studio Pages
              </span>
              <nav className="space-y-1">
                {PAGES.map((page) => {
                  const Icon = page.icon;
                  const isActive = activeTab === page.id;
                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(page.id as AdminPageTab);
                        setPreviewKey((k) => k + 1);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-start gap-3 border ${
                        isActive
                          ? "bg-amber-400/15 border-amber-400/50 text-white shadow-sm"
                          : "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-amber-400" : "text-white/40"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wider font-mono">
                            {page.label}
                          </span>
                          <span className="text-[9px] font-mono text-white/30 truncate ml-1">{page.path}</span>
                        </div>
                        <p className="text-[10px] text-white/40 truncate mt-0.5 font-sans">
                          {page.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Studio Tools / Atmosphere */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 block mb-2 px-2">
                Global Atmosphere &amp; Tools
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("effects")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                    activeTab === "effects"
                      ? "bg-amber-400/15 border-amber-400/50 text-white"
                      : "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider block">
                      Global Atmosphere
                    </span>
                    <span className="text-[10px] text-white/40 block">Grain, Fog, Glass Blur &amp; Tint</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("backup")}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                    activeTab === "backup"
                      ? "bg-amber-400/15 border-amber-400/50 text-white"
                      : "bg-transparent border-transparent text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider block">
                      Backup &amp; Presets
                    </span>
                    <span className="text-[10px] text-white/40 block">Export JSON, Import, Reset</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Quick status footnote */}
          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
              <span>Dynamic Binding</span>
              <span className="text-emerald-400">100% Real-Time</span>
            </div>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* CENTER COLUMN: DYNAMIC FACET EDITOR                                 */}
        {/* =================================================================== */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
          {/* Header Title for Current Page */}
          {activeTab !== "effects" && activeTab !== "backup" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                      Editing Page
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-[10px] font-mono text-white/50">{getPreviewUrl()}</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light text-white capitalize mt-1">
                    {activeTab === "contactReviews" ? "Contact & Review" : activeTab}
                  </h2>
                </div>

                {/* Granular Editing Facet Tabs: Matter, Typography, Imagery */}
                <div className="flex items-center p-1 bg-black/60 border border-white/15 rounded-xl self-start">
                  <button
                    type="button"
                    onClick={() => setActiveFacet("matter")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeFacet === "matter"
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Matter (Copy)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFacet("typography")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeFacet === "typography"
                        ? "bg-amber-400 text-black font-semibold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Typography (Font)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveFacet("imagery")}
                    className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
                      activeFacet === "imagery"
                        ? "bg-emerald-400 text-black font-semibold shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Imagery &amp; FX</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 1. HOME PAGE EDITOR                                               */}
          {/* ================================================================= */}
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* Home Sub-sections */}
              <div className="flex gap-2 border-b border-white/10 pb-3">
                {[
                  { key: "hero", label: "Scene 01 · Hero Monolith" },
                  { key: "curatorial", label: "Scene 02 · Curatorial Overview" },
                  { key: "next", label: "Scene 07 · Next Monograph" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setHomeSection(s.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                      homeSection === s.key
                        ? "bg-white/15 text-white font-medium border border-white/20"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* HOME - SCENE 01 HERO */}
              {homeSection === "hero" && (
                <div className="space-y-6">
                  {/* FACET: MATTER */}
                  {activeFacet === "matter" && (
                    <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                        Hero Titles &amp; Metadata
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Main Monograph Title
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.monographTitle}
                            onChange={(e) => updateHomeHero({ monographTitle: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Volume Tag
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.volumeTag}
                            onChange={(e) => updateHomeHero({ volumeTag: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Published Date
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.publishedDate}
                            onChange={(e) => updateHomeHero({ publishedDate: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Locations Archive
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.locationArchive}
                            onChange={(e) => updateHomeHero({ locationArchive: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.ctaButtonText}
                            onChange={(e) => updateHomeHero({ ctaButtonText: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            CTA Button Destination
                          </label>
                          <input
                            type="text"
                            value={config.home.hero.ctaButtonLink}
                            onChange={(e) => updateHomeHero({ ctaButtonLink: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FACET: TYPOGRAPHY */}
                  {activeFacet === "typography" && (
                    <div className="space-y-6">
                      <TypographyEditor
                        label="Hero Display Monograph Title (DREAMSCAPES)"
                        value={config.home.hero.titleTypography}
                        onChange={(updated) => updateHomeHero({ titleTypography: updated })}
                        sampleText={config.home.hero.monographTitle}
                      />
                    </div>
                  )}

                  {/* FACET: IMAGERY */}
                  {activeFacet === "imagery" && (
                    <div className="space-y-6">
                      <ImageEffectsEditor
                        label="Plate 01 — Kyoto Monolith Hero Plate"
                        imageUrl={config.home.hero.plate01Image}
                        styleValue={config.home.hero.plate01Style}
                        onImageChange={(url) => updateHomeHero({ plate01Image: url })}
                        onStyleChange={(style) => updateHomeHero({ plate01Style: style })}
                      />

                      <ImageEffectsEditor
                        label="Plate 02 — Concrete Sanctuary Transition Plate"
                        imageUrl={config.home.hero.plate02Image}
                        styleValue={config.home.hero.plate02Style}
                        onImageChange={(url) => updateHomeHero({ plate02Image: url })}
                        onStyleChange={(style) => updateHomeHero({ plate02Style: style })}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* HOME - SCENE 02 CURATORIAL */}
              {homeSection === "curatorial" && (
                <div className="space-y-6">
                  {activeFacet === "matter" && (
                    <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                        Curatorial Text &amp; Editorial Body
                      </span>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-white/50">
                              Eyebrow Title
                            </label>
                            <input
                              type="text"
                              value={config.home.curatorial.eyebrowTitle}
                              onChange={(e) => updateHomeCuratorial({ eyebrowTitle: e.target.value })}
                              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono uppercase text-white/50">
                              Eyebrow Subtitle
                            </label>
                            <input
                              type="text"
                              value={config.home.curatorial.eyebrowSub}
                              onChange={(e) => updateHomeCuratorial({ eyebrowSub: e.target.value })}
                              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Editorial Paragraph 1
                          </label>
                          <textarea
                            rows={3}
                            value={config.home.curatorial.paragraph1}
                            onChange={(e) => updateHomeCuratorial({ paragraph1: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Editorial Paragraph 2
                          </label>
                          <textarea
                            rows={3}
                            value={config.home.curatorial.paragraph2}
                            onChange={(e) => updateHomeCuratorial({ paragraph2: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFacet === "typography" && (
                    <TypographyEditor
                      label="Curatorial Statement Headline"
                      value={config.home.curatorial.headlineTypography}
                      onChange={(updated) => updateHomeCuratorial({ headlineTypography: updated })}
                      sampleText={config.home.curatorial.headlineWords.join(" ")}
                    />
                  )}

                  {activeFacet === "imagery" && (
                    <ImageEffectsEditor
                      label="Curatorial Architectural Specimen Plate"
                      imageUrl={config.home.hero.plate01Image}
                      styleValue={config.home.curatorial.plateStyle}
                      onImageChange={(url) => updateHomeHero({ plate01Image: url })}
                      onStyleChange={(style) => updateHomeCuratorial({ plateStyle: style })}
                    />
                  )}
                </div>
              )}

              {/* HOME - SCENE 07 NEXT */}
              {homeSection === "next" && (
                <div className="space-y-6">
                  {activeFacet === "matter" && (
                    <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                        Next Monograph Teaser (Blueyard)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Title
                          </label>
                          <input
                            type="text"
                            value={config.home.nextMonograph.title}
                            onChange={(e) => updateHomeNextMonograph({ title: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-white/50">
                            Launch Date
                          </label>
                          <input
                            type="text"
                            value={config.home.nextMonograph.launchDate}
                            onChange={(e) => updateHomeNextMonograph({ launchDate: e.target.value })}
                            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-white/50">
                          Teaser Paragraph
                        </label>
                        <textarea
                          rows={2}
                          value={config.home.nextMonograph.teaserParagraph}
                          onChange={(e) => updateHomeNextMonograph({ teaserParagraph: e.target.value })}
                          className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  )}

                  {activeFacet === "typography" && (
                    <TypographyEditor
                      label="Next Monograph Title Typography"
                      value={config.home.nextMonograph.titleTypography}
                      onChange={(updated) => updateHomeNextMonograph({ titleTypography: updated })}
                      sampleText={config.home.nextMonograph.title}
                    />
                  )}

                  {activeFacet === "imagery" && (
                    <ImageEffectsEditor
                      label="Next Monograph Banner Image &amp; Effects"
                      imageUrl={config.home.nextMonograph.bannerImage}
                      styleValue={config.home.nextMonograph.bannerStyle}
                      onImageChange={(url) => updateHomeNextMonograph({ bannerImage: url })}
                      onStyleChange={(style) => updateHomeNextMonograph({ bannerStyle: style })}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 2. WORK PAGE EDITOR                                               */}
          {/* ================================================================= */}
          {activeTab === "work" && (
            <div className="space-y-6">
              {activeFacet === "matter" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Work Hero Typography &amp; Overview
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={config.work.heroTitleLine1}
                        onChange={(e) => updateWork({ heroTitleLine1: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Title Slash
                      </label>
                      <input
                        type="text"
                        value={config.work.heroSlash}
                        onChange={(e) => updateWork({ heroSlash: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Title Line 2
                      </label>
                      <input
                        type="text"
                        value={config.work.heroTitleLine2}
                        onChange={(e) => updateWork({ heroTitleLine2: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Overview Tag
                      </label>
                      <input
                        type="text"
                        value={config.work.overviewTag}
                        onChange={(e) => updateWork({ overviewTag: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Volume Title
                      </label>
                      <input
                        type="text"
                        value={config.work.volumeTitle}
                        onChange={(e) => updateWork({ volumeTitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-white/50">
                      Overview Description
                    </label>
                    <textarea
                      rows={2}
                      value={config.work.overviewDescription}
                      onChange={(e) => updateWork({ overviewDescription: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {activeFacet === "typography" && (
                <TypographyEditor
                  label="Work Page Display Title (DREAM / SCAPES)"
                  value={config.work.titleTypography}
                  onChange={(updated) => updateWork({ titleTypography: updated })}
                  sampleText={`${config.work.heroTitleLine1} ${config.work.heroSlash} ${config.work.heroTitleLine2}`}
                />
              )}

              {activeFacet === "imagery" && (() => {
                const workPlates: WorkPlateItem[] = (config.work.plates && config.work.plates.length > 0)
                  ? config.work.plates
                  : DEFAULT_SITE_CONFIG.work.plates;

                const currentPlate = workPlates.find((p) => p.id === selectedWorkPlateId) || workPlates[0];

                const applyDistinctEffectsToAll = () => {
                  const DISTINCT_RECIPES = [
                    { contrast: 104, brightness: 100, saturation: 96, blur: 0, sepia: 0, grayscale: false, scale: 1.0 },
                    { contrast: 120, brightness: 94, saturation: 90, blur: 0, sepia: 4, grayscale: false, scale: 1.02 },
                    { contrast: 126, brightness: 102, saturation: 0, blur: 0, sepia: 0, grayscale: true, scale: 1.0 },
                    { contrast: 110, brightness: 104, saturation: 112, blur: 0, sepia: 20, grayscale: false, scale: 1.0 },
                    { contrast: 116, brightness: 98, saturation: 120, blur: 0, sepia: 6, grayscale: false, scale: 1.04 },
                    { contrast: 108, brightness: 102, saturation: 80, blur: 0, sepia: 0, grayscale: false, scale: 1.0 },
                    { contrast: 124, brightness: 95, saturation: 108, blur: 0, sepia: 14, grayscale: false, scale: 1.03 },
                    { contrast: 116, brightness: 100, saturation: 88, blur: 0, sepia: 2, grayscale: false, scale: 1.0 },
                    { contrast: 112, brightness: 102, saturation: 94, blur: 0, sepia: 26, grayscale: false, scale: 1.0 },
                    { contrast: 132, brightness: 94, saturation: 0, blur: 0, sepia: 0, grayscale: true, scale: 1.02 },
                    { contrast: 114, brightness: 100, saturation: 106, blur: 0, sepia: 8, grayscale: false, scale: 1.0 },
                    { contrast: 118, brightness: 102, saturation: 104, blur: 0, sepia: 16, grayscale: false, scale: 1.0 },
                  ];

                  const updated = workPlates.map((plate, index) => {
                    const recipe = DISTINCT_RECIPES[index % DISTINCT_RECIPES.length];
                    return {
                      ...plate,
                      style: {
                        ...plate.style,
                        ...recipe,
                      },
                    };
                  });

                  updateWork({ plates: updated });
                  showToast("12 distinct photographic filter recipes applied across all Work images.");
                };

                const resetPlatesToDefaults = () => {
                  updateWork({ plates: DEFAULT_SITE_CONFIG.work.plates });
                  showToast("Work page images reset to default curated effects.");
                };

                return (
                  <div className="space-y-6">
                    {/* Header Switcher: 12 Monograph Plates vs Work Hero */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWorkImageryMode("plates")}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${
                            workImageryMode === "plates"
                              ? "bg-amber-400 text-black font-semibold shadow-sm"
                              : "bg-white/10 text-white/70 hover:text-white"
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>12 Monograph Image Plates (Individual Effects)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setWorkImageryMode("hero")}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors ${
                            workImageryMode === "hero"
                              ? "bg-amber-400 text-black font-semibold shadow-sm"
                              : "bg-white/10 text-white/70 hover:text-white"
                          }`}
                        >
                          <span>Work Hero Cover</span>
                        </button>
                      </div>

                      {workImageryMode === "plates" && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={applyDistinctEffectsToAll}
                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                            title="Automatically assign 12 distinctly styled effects across each image"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Apply 12 Distinct Effects</span>
                          </button>

                          <button
                            type="button"
                            onClick={resetPlatesToDefaults}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors"
                            title="Reset all 12 images to default monograph styles"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* HERO MODE */}
                    {workImageryMode === "hero" && (
                      <ImageEffectsEditor
                        label="Work Page Hero Cover Specimen"
                        imageUrl={config.work.heroImage}
                        styleValue={config.work.heroImageStyle}
                        onImageChange={(url) => updateWork({ heroImage: url })}
                        onStyleChange={(style) => updateWork({ heroImageStyle: style })}
                      />
                    )}

                    {/* 12 PLATES MODE */}
                    {workImageryMode === "plates" && (
                      <div className="space-y-6">
                        {/* Interactive Selector of 12 Images with Live Filter Preview */}
                        <div className="bg-[#181818] border border-white/10 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <div>
                              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold block">
                                Select Image to Edit Individual Effects
                              </span>
                              <span className="text-[11px] text-white/50 block">
                                Each image plate has its own unique contrast, brightness, saturation, sepia, blur &amp; black/white settings.
                              </span>
                            </div>
                            <span className="text-[10px] font-mono uppercase tracking-widest bg-white/10 text-white/70 px-2 py-0.5 rounded">
                              {workPlates.length} Plates Active
                            </span>
                          </div>

                          {/* 12 Plates Thumbnail Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
                            {workPlates.map((plate, idx) => {
                              const isSelected = plate.id === currentPlate.id;
                              const effectSummary = plate.style.grayscale
                                ? "B&W Monolith"
                                : (plate.style.sepia || 0) > 10
                                ? `Sepia ${plate.style.sepia}%`
                                : (plate.style.contrast || 100) > 115
                                ? `Contrast ${plate.style.contrast}%`
                                : (plate.style.saturation || 100) > 110
                                ? `Vivid Sat ${plate.style.saturation}%`
                                : "Natural Pure";

                              return (
                                <button
                                  key={plate.id}
                                  type="button"
                                  onClick={() => setSelectedWorkPlateId(plate.id)}
                                  className={`relative group flex flex-col text-left p-1.5 rounded-lg border transition-all overflow-hidden ${
                                    isSelected
                                      ? "bg-amber-400/20 border-amber-400 ring-1 ring-amber-400/50 shadow-md"
                                      : "bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5"
                                  }`}
                                >
                                  {/* Thumbnail with Live Filter Preview */}
                                  <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-neutral-900 border border-black/30">
                                    <img
                                      src={plate.src}
                                      alt={plate.alt}
                                      className="w-full h-full object-cover transition-transform duration-300"
                                      style={getImageFilterStyles(plate.style)}
                                    />
                                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[9px] font-mono text-white/90">
                                      #{idx + 1}
                                    </span>
                                    {isSelected && (
                                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
                                    )}
                                  </div>

                                  <div className="mt-1.5 space-y-0.5">
                                    <span className="text-[10px] font-mono text-white/90 truncate block font-medium leading-tight">
                                      {plate.title.replace(/^\d+\s*\/\s*/, "")}
                                    </span>
                                    <div className="flex items-center justify-between text-[9px] font-mono text-white/40">
                                      <span className="truncate">{plate.section.split("—")[0]}</span>
                                      <span className={`px-1 rounded text-[8px] ${
                                        plate.style.grayscale
                                          ? "bg-white/20 text-white"
                                          : (plate.style.sepia || 0) > 10
                                          ? "bg-amber-900/60 text-amber-200"
                                          : "bg-white/10 text-white/60"
                                      }`}>
                                        {effectSummary}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selected Plate Metadata & Filter Controls */}
                        <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                                  Currently Editing: {currentPlate.title}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                                  {currentPlate.section}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/50 block mt-0.5">
                                Adjusting filters and scale below affects ONLY this specific photograph.
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const defaultVersion = DEFAULT_SITE_CONFIG.work.plates.find((p) => p.id === currentPlate.id);
                                if (defaultVersion) {
                                  updateWorkPlate(currentPlate.id, { style: defaultVersion.style, src: defaultVersion.src });
                                  showToast(`Reset ${currentPlate.title} to default.`);
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-mono text-white/60 hover:text-white border border-white/10 rounded hover:bg-white/5 flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset This Image</span>
                            </button>
                          </div>

                          {/* Plate Title and Alt Text Inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase text-white/50">
                                Plate Display Label
                              </label>
                              <input
                                type="text"
                                value={currentPlate.title}
                                onChange={(e) => updateWorkPlate(currentPlate.id, { title: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono uppercase text-white/50">
                                Image Alt / Architectural Specimen Description
                              </label>
                              <input
                                type="text"
                                value={currentPlate.alt}
                                onChange={(e) => updateWorkPlate(currentPlate.id, { alt: e.target.value })}
                                className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                              />
                            </div>
                          </div>

                          {/* Live Image Effects Editor for this plate */}
                          <ImageEffectsEditor
                            label={`Fine-tune Effects for Plate #${workPlates.findIndex(p => p.id === currentPlate.id) + 1}`}
                            imageUrl={currentPlate.src}
                            styleValue={currentPlate.style}
                            onImageChange={(newUrl) => updateWorkPlate(currentPlate.id, { src: newUrl })}
                            onStyleChange={(newStyle) => updateWorkPlate(currentPlate.id, { style: { ...currentPlate.style, ...newStyle } })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================================================================= */}
          {/* 3. PROJECT PAGE EDITOR                                            */}
          {/* ================================================================= */}
          {activeTab === "project" && (
            <div className="space-y-6">
              {activeFacet === "matter" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Project Titles &amp; Narrative Statement
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={config.project.title}
                        onChange={(e) => updateProject({ title: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Subtitle / Eyebrow
                      </label>
                      <input
                        type="text"
                        value={config.project.eyebrow}
                        onChange={(e) => updateProject({ eyebrow: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Statement Line 1
                      </label>
                      <input
                        type="text"
                        value={config.project.statementLine1}
                        onChange={(e) => updateProject({ statementLine1: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Statement Line 2
                      </label>
                      <input
                        type="text"
                        value={config.project.statementLine2}
                        onChange={(e) => updateProject({ statementLine2: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-white/50">
                      Narrative Body Description
                    </label>
                    <textarea
                      rows={3}
                      value={config.project.narrativeBody}
                      onChange={(e) => updateProject({ narrativeBody: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {activeFacet === "typography" && (
                <TypographyEditor
                  label="Project Title Typography"
                  value={config.project.titleTypography}
                  onChange={(updated) => updateProject({ titleTypography: updated })}
                  sampleText={config.project.title}
                />
              )}

              {activeFacet === "imagery" && (
                <div className="space-y-6">
                  <ImageEffectsEditor
                    label="Primary Monumental Image Plate"
                    imageUrl={config.project.primaryImage}
                    styleValue={config.project.primaryImageStyle}
                    onImageChange={(url) => updateProject({ primaryImage: url })}
                    onStyleChange={(style) => updateProject({ primaryImageStyle: style })}
                  />

                  <ImageEffectsEditor
                    label="Secondary Spatial Volume Image Plate"
                    imageUrl={config.project.secondaryImage}
                    styleValue={config.project.secondaryImageStyle}
                    onImageChange={(url) => updateProject({ secondaryImage: url })}
                    onStyleChange={(style) => updateProject({ secondaryImageStyle: style })}
                  />
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 4. FILM PAGE EDITOR                                               */}
          {/* ================================================================= */}
          {activeTab === "film" && (
            <div className="space-y-6">
              {activeFacet === "matter" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Film Hero Typography &amp; Badge
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Main Title Line 1
                      </label>
                      <input
                        type="text"
                        value={config.film.hero.mainTitleLine1}
                        onChange={(e) =>
                          updateFilm({
                            hero: { ...config.film.hero, mainTitleLine1: e.target.value },
                          })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Main Title Line 2
                      </label>
                      <input
                        type="text"
                        value={config.film.hero.mainTitleLine2}
                        onChange={(e) =>
                          updateFilm({
                            hero: { ...config.film.hero, mainTitleLine2: e.target.value },
                          })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Subtitle Italic
                      </label>
                      <input
                        type="text"
                        value={config.film.hero.subtitleItalic}
                        onChange={(e) =>
                          updateFilm({
                            hero: { ...config.film.hero, subtitleItalic: e.target.value },
                          })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={config.film.hero.badgeText}
                        onChange={(e) =>
                          updateFilm({
                            hero: { ...config.film.hero, badgeText: e.target.value },
                          })
                        }
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFacet === "typography" && (
                <TypographyEditor
                  label="Film Main Display Title Typography"
                  value={config.film.hero.titleTypography}
                  onChange={(updated) =>
                    updateFilm({
                      hero: { ...config.film.hero, titleTypography: updated },
                    })
                  }
                  sampleText={`${config.film.hero.mainTitleLine1} ${config.film.hero.mainTitleLine2}`}
                />
              )}

              {activeFacet === "imagery" && (
                <ImageEffectsEditor
                  label="Film Hero Bas-Relief Poster &amp; Filters"
                  imageUrl={config.film.hero.heroPosterImage}
                  styleValue={config.film.hero.posterStyle}
                  onImageChange={(url) =>
                    updateFilm({
                      hero: { ...config.film.hero, heroPosterImage: url },
                    })
                  }
                  onStyleChange={(style) =>
                    updateFilm({
                      hero: { ...config.film.hero, posterStyle: style },
                    })
                  }
                />
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 5. KRISHNA PAGE EDITOR                                            */}
          {/* ================================================================= */}
          {activeTab === "krishna" && (
            <div className="space-y-6">
              {activeFacet === "matter" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Krishna Wordmark &amp; Brand Philosophy
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Brand Wordmark
                      </label>
                      <input
                        type="text"
                        value={config.krishna.brandTitle}
                        onChange={(e) => updateKrishna({ brandTitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Brand Subtitle
                      </label>
                      <input
                        type="text"
                        value={config.krishna.brandSubtitle}
                        onChange={(e) => updateKrishna({ brandSubtitle: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-white/50">
                      Exhibition Quote
                    </label>
                    <textarea
                      rows={2}
                      value={config.krishna.quote}
                      onChange={(e) => updateKrishna({ quote: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {activeFacet === "typography" && (
                <TypographyEditor
                  label="Krishna Brand Title Typography"
                  value={config.krishna.titleTypography}
                  onChange={(updated) => updateKrishna({ titleTypography: updated })}
                  sampleText={config.krishna.brandTitle}
                />
              )}

              {activeFacet === "imagery" && (
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block">
                    Krishna Exhibition Photographic Chapters
                  </span>
                  {config.krishna.categories.map((cat, idx) => (
                    <ImageEffectsEditor
                      key={cat.key}
                      label={`Chapter ${cat.num}: ${cat.label} — ${cat.subtitle}`}
                      imageUrl={cat.heroImage || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85"}
                      styleValue={cat.heroImageStyle}
                      onImageChange={(url) => {
                        const next = [...config.krishna.categories];
                        next[idx] = { ...next[idx], heroImage: url };
                        updateKrishna({ categories: next });
                      }}
                      onStyleChange={(style) => {
                        const next = [...config.krishna.categories];
                        next[idx] = { ...next[idx], heroImageStyle: style };
                        updateKrishna({ categories: next });
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 6. CONTACT & REVIEW PAGE EDITOR                                   */}
          {/* ================================================================= */}
          {activeTab === "contactReviews" && (
            <div className="space-y-6">
              {activeFacet === "matter" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Studio Desk Information &amp; Hours
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.headline || "CONTACT US."}
                        onChange={(e) => updateContactReviews({ headline: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Studio Name
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.studioName}
                        onChange={(e) => updateContactReviews({ studioName: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Email Address
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.email}
                        onChange={(e) => updateContactReviews({ email: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Direct Phone
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.phone}
                        onChange={(e) => updateContactReviews({ phone: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.location || "PUNE, MAHARASHTRA, INDIA"}
                        onChange={(e) => updateContactReviews({ location: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-white/50">
                        Office / Operating Hours
                      </label>
                      <input
                        type="text"
                        value={config.contactReviews.hours}
                        onChange={(e) => updateContactReviews({ hours: e.target.value })}
                        className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-white/50">
                      Description Intro
                    </label>
                    <textarea
                      rows={2}
                      value={config.contactReviews.description || ""}
                      onChange={(e) => updateContactReviews({ description: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {activeFacet === "typography" && (
                <TypographyEditor
                  label="Contact &amp; Review Display Headline"
                  value={config.contactReviews.titleTypography}
                  onChange={(updated) => updateContactReviews({ titleTypography: updated })}
                  sampleText={config.contactReviews.headline || "CONTACT US."}
                />
              )}

              {activeFacet === "imagery" && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-4">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/60 block border-b border-white/10 pb-2">
                    Client Review Verification &amp; Highlights
                  </span>
                  <div className="space-y-3">
                    {config.contactReviews.reviews.map((rev, i) => (
                      <div key={rev.id} className="p-3 bg-black/40 border border-white/10 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-white block">{rev.clientName}</span>
                          <span className="text-[10px] font-mono text-white/50">{rev.roleOrTag}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400">★ {rev.overallRating}.0 Rating</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* 7. GLOBAL ATMOSPHERE & EFFECTS                                    */}
          {/* ================================================================= */}
          {activeTab === "effects" && (
            <div className="bg-[#181818] border border-white/10 rounded-xl p-6 space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono uppercase tracking-widest text-white">
                    Atmospheric Optical Effects &amp; Color Grading
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Real-time global CSS variables controlling cinematic grain, fog, glass blur, and ambient tone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resetSection("effects")}
                  className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-wider transition-colors"
                >
                  Reset Atmosphere
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Contrast */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Overall Contrast</span>
                    <span className="text-amber-400 font-semibold">{config.effects.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="140"
                    value={config.effects.contrast}
                    onChange={(e) => updateEffects({ contrast: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Brightness */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Overall Brightness</span>
                    <span className="text-amber-400 font-semibold">{config.effects.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="130"
                    value={config.effects.brightness}
                    onChange={(e) => updateEffects({ brightness: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Atmospheric Saturation</span>
                    <span className="text-amber-400 font-semibold">{config.effects.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={config.effects.saturation}
                    onChange={(e) => updateEffects({ saturation: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Grain Opacity */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Analog 35mm Grain Intensity</span>
                    <span className="text-amber-400 font-semibold">
                      {(config.effects.grainOpacity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.15"
                    step="0.005"
                    value={config.effects.grainOpacity}
                    onChange={(e) => updateEffects({ grainOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Glass Blur */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Frosted Glass Capsule Blur</span>
                    <span className="text-amber-400 font-semibold">{config.effects.glassBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="2"
                    value={config.effects.glassBlur}
                    onChange={(e) => updateEffects({ glassBlur: parseInt(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>

                {/* Fog Density */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-white/60">
                    <span>Volumetric Atmospheric Fog</span>
                    <span className="text-amber-400 font-semibold">
                      {(config.effects.fogOpacity * 100).toFixed(1)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.08"
                    step="0.005"
                    value={config.effects.fogOpacity}
                    onChange={(e) => updateEffects({ fogOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 8. BACKUP & PRESETS                                               */}
          {/* ================================================================= */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="bg-[#181818] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-white">
                  Backup, Export &amp; Restore
                </h3>
                <p className="text-xs text-white/60">
                  Export your entire configured studio site into an architectural JSON file, or restore from a previous export.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      exportConfig();
                      showToast("Configuration JSON exported.");
                    }}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors text-white"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Configuration JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors text-white"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import JSON Backup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Reset all customizations back to factory defaults?")) {
                        resetToDefaults();
                        showToast("Reset to factory defaults.");
                      }
                    }}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Factory Reset All Pages</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* =================================================================== */}
        {/* RIGHT DRAWER: SPLIT LIVE PREVIEW (Optional side-by-side view)       */}
        {/* =================================================================== */}
        {showLivePreview && (
          <aside className="w-[480px] lg:w-[600px] border-l border-white/10 bg-[#0A0A0A] flex flex-col shrink-0">
            {/* Preview Device Switcher */}
            <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-[#141414]">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-white/40 uppercase">Viewport:</span>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded ${previewDevice === "desktop" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                  title="Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  className={`p-1.5 rounded ${previewDevice === "tablet" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                  title="Tablet"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded ${previewDevice === "mobile" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
                  title="Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewKey((k) => k + 1)}
                  className="p-1.5 text-white/50 hover:text-white transition-colors"
                  title="Reload Preview Frame"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowLivePreview(false)}
                  className="text-[10px] font-mono text-white/40 hover:text-white uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>

            {/* iFrame Container */}
            <div className="flex-1 p-3 bg-black flex items-center justify-center overflow-hidden">
              <div
                className={`transition-all duration-300 h-full border border-white/20 rounded-lg overflow-hidden bg-black ${
                  previewDevice === "mobile"
                    ? "w-[375px]"
                    : previewDevice === "tablet"
                    ? "w-[440px]"
                    : "w-full"
                }`}
              >
                <iframe
                  key={previewKey}
                  src={getPreviewUrl()}
                  className="w-full h-full border-0"
                  title="Live Preview"
                />
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1C1A18] border border-white/20 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-mono uppercase tracking-widest text-white">
              Import Configuration JSON
            </h3>
            <p className="text-xs text-white/60 font-sans">
              Paste the exported JSON string below to restore matter, font styles, and image settings.
            </p>
            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full bg-black/60 border border-white/20 rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
            />
            {importStatus && (
              <p className="text-rose-400 text-xs font-mono">{importStatus}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportStatus(null);
                }}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="px-4 py-2 bg-amber-400 text-black text-xs font-mono uppercase tracking-widest font-semibold rounded-lg hover:bg-amber-300"
              >
                Apply JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
