"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Play,
  Save,
  ImageIcon,
  MousePointer,
  Upload,
} from "lucide-react";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";
import {
  SUPPORTED_PAGES,
  PRESET_PAGE_ELEMENTS,
  PageQuickElement,
} from "@/lib/admin/visualEditorBridge";
import { PRESET_IMAGE_GALLERY } from "@/lib/admin/defaultConfig";
import { VisualElementOverride } from "@/lib/admin/types";
import { safeClone } from "@/lib/admin/safeJson";

type DeviceMode = "desktop" | "tablet" | "mobile";
type InspectorTab = "content" | "effects" | "hover" | "scroll";

export default function AdminVisualEditor() {
  const {
    draftConfig,
    updateElementOverride,
    resetElementOverride,
    saveDraft,
    publishLive,
    resetToDefaults,
    hasUnpublishedChanges,
  } = useSiteConfig();

  // Page Selection state
  const [selectedPagePath, setSelectedPagePath] = useState<string>("/");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [isInteractMode, setIsInteractMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<InspectorTab>("content");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected element state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementData, setSelectedElementData] = useState<{
    tagName: string;
    selector: string;
    elementType: "text" | "image" | "button" | "section" | "link";
    text: string;
    src: string;
    href: string;
    styles: Record<string, any>;
  } | null>(null);

  // Preset gallery modal state
  const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset elements for the current page
  const pagePresets = useMemo(() => {
    return PRESET_PAGE_ELEMENTS[selectedPagePath] || [];
  }, [selectedPagePath]);

  // Current active override for the selected element
  const currentOverride: VisualElementOverride | undefined = useMemo(() => {
    if (!selectedElementId) return undefined;
    return (draftConfig.elementOverrides || {})[selectedElementId];
  }, [draftConfig.elementOverrides, selectedElementId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Enforce white-grey studio background on document body for admin route
  useEffect(() => {
    if (typeof document !== "undefined") {
      const origBg = document.body.style.backgroundColor;
      document.body.style.backgroundColor = "#F4F4F6";
      return () => {
        document.body.style.backgroundColor = origBg;
      };
    }
  }, []);

  // Listen for element selection from inside iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = event.data;
        if (!msg || typeof msg !== "object") return;

        if (msg.type === "ADMIN_ELEMENT_SELECTED" && msg.data) {
          const data = safeClone(msg.data);
          // Generate a stable ID based on selector or tag
          const id = `${selectedPagePath}::${String(data.selector || "el").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
          setSelectedElementId(id);
          setSelectedElementData(data);

          // Prepopulate override if none exists
          if (!(draftConfig.elementOverrides || {})[id]) {
            updateElementOverride(id, {
              id,
              page: selectedPagePath,
              name: `${String(data.tagName || "ELEMENT").toUpperCase()} (${data.elementType || "element"})`,
              elementType: data.elementType || "text",
              selector: data.selector || "div",
              text: data.text || "",
              src: data.src || "",
              linkUrl: data.href || "",
              styles: {
                color: data.styles?.color,
                fontSize: data.styles?.fontSize,
                fontFamily: data.styles?.fontFamily,
                fontWeight: data.styles?.fontWeight,
                lineHeight: data.styles?.lineHeight,
                letterSpacing: data.styles?.letterSpacing,
                textAlign: data.styles?.textAlign,
                backgroundColor: data.styles?.backgroundColor,
                opacity: data.styles?.opacity,
                borderRadius: data.styles?.borderRadius,
                paddingTop: data.styles?.paddingTop,
                paddingBottom: data.styles?.paddingBottom,
                paddingLeft: data.styles?.paddingLeft,
                paddingRight: data.styles?.paddingRight,
              },
            });
          }
        }
      } catch (err: any) {
        console.warn("Error processing editor message:", String(err?.message || err));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selectedPagePath, draftConfig.elementOverrides, updateElementOverride]);

  // Send interact mode toggle to iframe safely
  const toggleInteractMode = () => {
    const next = !isInteractMode;
    setIsInteractMode(next);
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          safeClone({ type: "ADMIN_SET_INTERACT_MODE", interact: next }),
          "*"
        );
      } catch {
        // ignore
      }
    }
  };

  // Select a preset element from the quick list
  const handleSelectPreset = (preset: PageQuickElement) => {
    setSelectedElementId(preset.id);
    setSelectedElementData({
      tagName: preset.elementType === "image" ? "img" : preset.elementType === "button" ? "button" : preset.elementType === "section" ? "section" : "h2",
      selector: preset.selector,
      elementType: preset.elementType,
      text: "",
      src: "",
      href: "",
      styles: {},
    });

    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          safeClone({ type: "ADMIN_SELECT_BY_SELECTOR", selector: preset.selector }),
          "*"
        );
      } catch {
        // ignore
      }
    }

    // Ensure entry exists in draft overrides
    if (!(draftConfig.elementOverrides || {})[preset.id]) {
      updateElementOverride(preset.id, {
        id: preset.id,
        page: selectedPagePath,
        name: preset.name,
        elementType: preset.elementType,
        selector: preset.selector,
        styles: {},
      });
    }
  };

  // Send live update to iframe for instant feedback
  const sendLiveUpdate = useCallback(
    (updates: { text?: string; src?: string; styles?: any; animation?: any }) => {
      if (iframeRef.current?.contentWindow && selectedElementData?.selector) {
        try {
          iframeRef.current.contentWindow.postMessage(
            safeClone({
              type: "ADMIN_LIVE_UPDATE_ELEMENT",
              selector: selectedElementData.selector,
              ...updates,
            }),
            "*"
          );
        } catch {
          // ignore
        }
      }
    },
    [selectedElementData?.selector]
  );

  // Update element style helper
  const handleStyleChange = (styleKey: string, value: any) => {
    if (!selectedElementId) return;
    const nextStyles = {
      ...(currentOverride?.styles || {}),
      [styleKey]: value,
    };
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      styles: nextStyles,
    });
    sendLiveUpdate({ styles: nextStyles });
  };

  // Update text helper
  const handleTextChange = (text: string) => {
    if (!selectedElementId) return;
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      text,
    });
    sendLiveUpdate({ text });
  };

  // Update image src helper
  const handleImageChange = (src: string) => {
    if (!selectedElementId) return;
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      src,
    });
    sendLiveUpdate({ src });
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast("File size too large. Please select an image under 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleImageChange(dataUrl);
        showToast("Custom image uploaded successfully");
      }
    };
    reader.readAsDataURL(file);
  };

  // Update animation helper
  const handleAnimationChange = (animKey: string, value: any) => {
    if (!selectedElementId) return;
    const nextAnim = {
      ...(currentOverride?.animation || {
        type: "none",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        trigger: "load",
        repeat: "once",
        intensity: 50,
      }),
      [animKey]: value,
    };
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      animation: nextAnim,
    });
    sendLiveUpdate({ animation: nextAnim });
  };

  // Update hover helper
  const handleHoverChange = (hoverKey: string, value: any) => {
    if (!selectedElementId) return;
    const nextHover = {
      ...(currentOverride?.hoverStyles || {}),
      [hoverKey]: value,
    };
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      hoverStyles: nextHover,
    });
  };

  // Update scroll effect helper
  const handleScrollChange = (scrollKey: string, value: any) => {
    if (!selectedElementId) return;
    const nextScroll = {
      ...(currentOverride?.scrollEffect || {
        type: "none",
        triggerPosition: "center",
        start: "top bottom",
        end: "bottom top",
        speed: 1.0,
        intensity: 50,
        direction: "up",
      }),
      [scrollKey]: value,
    };
    updateElementOverride(selectedElementId, {
      id: selectedElementId,
      page: selectedPagePath,
      scrollEffect: nextScroll,
    });
  };

  // Preview Effect button (replays animation)
  const handleTriggerPreviewEffect = () => {
    if (!selectedElementId || !currentOverride?.animation) {
      showToast("Select an effect type first to preview");
      return;
    }
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          safeClone({
            type: "ADMIN_TRIGGER_PREVIEW_EFFECT",
            animation: currentOverride.animation,
          }),
          "*"
        );
        showToast(`Previewing ${currentOverride.animation.type} effect`);
      } catch {
        // ignore
      }
    }
  };

  // Reset Effect button (returns element to original effect)
  const handleResetEffect = () => {
    if (!selectedElementId) return;
    updateElementOverride(selectedElementId, {
      animation: {
        type: "none",
        duration: 800,
        delay: 0,
        easing: "ease-out",
        trigger: "load",
        repeat: "once",
        intensity: 50,
      },
    });
    sendLiveUpdate({
      animation: { type: "none" },
    });
    showToast("Effect reset to website default");
  };

  // Reset Element (clears all customizations for this element)
  const handleResetElement = () => {
    if (!selectedElementId) return;
    resetElementOverride(selectedElementId);
    if (iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          safeClone({ type: "ADMIN_RESET_ELEMENT_STYLES" }),
          "*"
        );
      } catch {
        // ignore
      }
    }
    showToast("Element customizations reset to default");
  };

  // Reset All Changes
  const handleResetAll = () => {
    if (confirm("Reset ALL changes across the website back to original defaults?")) {
      resetToDefaults();
      if (iframeRef.current) {
        iframeRef.current.src = `${selectedPagePath}?admin_inspector=1&t=${Date.now()}`;
      }
      showToast("All changes reset to original defaults");
    }
  };

  // Save Draft
  const handleSave = () => {
    saveDraft();
    showToast(`Draft saved at ${new Date().toLocaleTimeString()}`);
  };

  // Publish Live
  const handlePublish = () => {
    publishLive();
    showToast("✨ Published successfully! Changes are now live on the public website.");
  };

  // Determine element type for contextual UI
  const currentType = currentOverride?.elementType || selectedElementData?.elementType || "text";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F4F4F6] text-[#18181B] font-sans antialiased overflow-hidden select-none">
      {/* 1. TOP HEADER / CONTROL BAR (White Grey Clean Theme) */}
      <header className="h-14 border-b border-[#E2E2E6] bg-[#FFFFFF] px-4 flex items-center justify-between gap-4 shrink-0 z-20 shadow-xs">
        {/* Brand & Page Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-[#E2E2E6]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#18181B] font-bold hidden sm:inline">
              STUDIO ADMIN
            </span>
          </div>

          {/* PAGE SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#71717A] hidden md:inline">Page:</span>
            <select
              value={selectedPagePath}
              onChange={(e) => {
                setSelectedPagePath(e.target.value);
                setSelectedElementId(null);
                setSelectedElementData(null);
              }}
              className="bg-white text-[#18181B] text-xs font-mono font-medium py-1.5 px-3 rounded-md border border-[#D1D1D6] focus:outline-none focus:border-amber-500 cursor-pointer shadow-xs"
            >
              {SUPPORTED_PAGES.map((page) => (
                <option key={page.id} value={page.path}>
                  {page.name} ({page.path})
                </option>
              ))}
            </select>
          </div>

          {/* INTERACT VS INSPECT MODE TOGGLE */}
          <button
            type="button"
            onClick={toggleInteractMode}
            className={`px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
              isInteractMode
                ? "bg-amber-100 text-amber-900 border-amber-400 font-semibold"
                : "bg-white text-[#3F3F46] border-[#D1D1D6] hover:bg-zinc-50 hover:text-black shadow-xs"
            }`}
            title={isInteractMode ? "Clicking links will navigate the page" : "Clicking elements selects them for editing"}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{isInteractMode ? "Live Browse" : "Click to Edit"}</span>
          </button>
        </div>

        {/* Center: Device Viewport Switcher */}
        <div className="hidden md:flex items-center bg-[#E4E4E7] p-0.5 rounded-lg border border-[#D4D4D8]">
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === "desktop" ? "bg-white text-[#18181B] font-semibold shadow-xs" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("tablet")}
            className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === "tablet" ? "bg-white text-[#18181B] font-semibold shadow-xs" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceMode === "mobile" ? "bg-white text-[#18181B] font-semibold shadow-xs" : "text-[#71717A] hover:text-[#18181B]"
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Mobile</span>
          </button>
        </div>

        {/* Right Action Workflow: Reset, Save, Preview, Publish */}
        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2 text-[11px] font-mono">
            {hasUnpublishedChanges ? (
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Unpublished
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Published
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetAll}
            className="p-1.5 text-[#71717A] hover:text-rose-600 rounded-md border border-[#D4D4D8] hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer bg-white"
            title="Reset all changes to original"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-zinc-50 text-[#18181B] text-xs font-mono font-medium flex items-center gap-1.5 border border-[#D4D4D8] shadow-2xs transition-all cursor-pointer"
            title="Save draft changes"
          >
            <Save className="w-3.5 h-3.5 text-[#52525B]" />
            <span className="hidden sm:inline">Save</span>
          </button>

          <Link
            href={selectedPagePath}
            target="_blank"
            className="p-1.5 text-[#52525B] hover:text-black rounded-md border border-[#D4D4D8] bg-white hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Open Live Public Page in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handlePublish}
            className="px-4 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN BODY: PREVIEW CANVAS (LEFT) + CONTEXTUAL INSPECTOR (RIGHT) */}
      <div className="flex-1 flex overflow-hidden">
        {/* PREVIEW CANVAS CONTAINER (White Grey Stage Backdrop) */}
        <section aria-label="Page preview canvas" className="flex-1 flex flex-col bg-[#ECECED] overflow-hidden relative">
          {/* Quick Element Selectors Toolbar */}
          <div className="h-9 border-b border-[#E2E2E6] bg-[#F7F7F9] px-3 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <span className="text-[10px] font-mono uppercase text-[#71717A] shrink-0 font-medium">Quick Select:</span>
            {pagePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-mono shrink-0 transition-all cursor-pointer ${
                  selectedElementId === preset.id
                    ? "bg-amber-500 text-black font-semibold shadow-xs"
                    : "bg-white text-[#3F3F46] hover:bg-zinc-50 hover:text-black border border-[#D4D4D8]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* IFRAME VIEWPORT */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 bg-white rounded-lg shadow-xl overflow-hidden border border-[#D4D4D8] flex flex-col ${
                deviceMode === "desktop"
                  ? "w-full"
                  : deviceMode === "tablet"
                  ? "w-[768px]"
                  : "w-[375px]"
              }`}
            >
              {/* Iframe Frame Top Mock Browser Bar */}
              <div className="h-6 bg-[#F4F4F6] px-3 flex items-center justify-between border-b border-[#E2E2E6] text-[10px] font-mono text-[#71717A] shrink-0 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-[#52525B] font-mono truncate max-w-[280px]">
                    https://stillstudio.atelier{selectedPagePath}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold">
                    {isInteractMode ? "BROWSE MODE" : "CLICK-TO-EDIT ACTIVE"}
                  </span>
                </div>
              </div>

              {/* LIVE EMBEDDED IFRAME */}
              <iframe
                ref={iframeRef}
                key={`${selectedPagePath}-${deviceMode}`}
                src={`${selectedPagePath}?admin_inspector=1`}
                className="w-full flex-1 border-none bg-[#EBE7E1]"
                title="Page Live Visual Preview"
              />
            </div>
          </div>
        </section>

        {/* 3. RIGHT INSPECTOR PANEL: DYNAMIC EDITING CONTROLS (White Grey Clean Theme) */}
        <aside aria-label="Element inspector and design controls" className="w-80 md:w-96 border-l border-[#E2E2E6] bg-[#FFFFFF] flex flex-col shrink-0 overflow-hidden z-10 shadow-lg">
          {/* Inspector Header */}
          <div className="p-3 border-b border-[#E2E2E6] bg-[#F8F8FA] shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                Selected Element
              </span>
              {selectedElementId && (
                <span className="px-2 py-0.5 rounded bg-white border border-[#D4D4D8] text-[#18181B] font-mono text-[10px] uppercase font-bold shadow-2xs">
                  {currentType}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#18181B] truncate font-medium">
                {currentOverride?.name || (selectedElementData ? `${selectedElementData.tagName.toUpperCase()} (${selectedElementData.selector})` : "Click anything to edit")}
              </span>
            </div>
          </div>

          {/* INSPECTOR TABS: Content / Effects / Hover / Scroll */}
          <div className="flex border-b border-[#D6D6D8] bg-[#ECECEF] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "content"
                  ? "border-amber-500 text-amber-900 font-bold bg-white"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Content & Design
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("effects")}
              className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "effects"
                  ? "border-amber-500 text-amber-900 font-bold bg-white"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Effects
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hover")}
              className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "hover"
                  ? "border-amber-500 text-amber-900 font-bold bg-white"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Hover
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scroll")}
              className={`flex-1 py-2 text-[11px] font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "scroll"
                  ? "border-amber-500 text-amber-900 font-bold bg-white"
                  : "border-transparent text-[#71717A] hover:text-[#18181B]"
              }`}
            >
              Scroll
            </button>
          </div>

          {/* INSPECTOR CONTROLS BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs font-mono bg-[#FAFAFB]">
            {/* If no element is selected */}
            {!selectedElementId && (
              <div className="py-12 text-center text-[#71717A] space-y-3">
                <MousePointer className="w-8 h-8 mx-auto text-amber-600 animate-bounce" />
                <p className="text-xs font-medium text-[#3F3F46]">
                  Click any text, image, button, or section inside the live preview.
                </p>
                <p className="text-[11px] text-[#71717A]">
                  Or pick a key section from the <span className="text-[#18181B] font-semibold">Quick Select</span> bar above.
                </p>
              </div>
            )}

            {/* TAB 1: CONTENT & DESIGN (CONTEXTUAL) */}
            {selectedElementId && activeTab === "content" && (
              <div className="space-y-4">
                {/* 1. TEXT EDITING */}
                {(currentType === "text" || currentType === "button" || currentType === "link") && (
                  <div className="space-y-3 border-b border-[#E2E2E6] pb-4">
                    <label className="text-[11px] uppercase tracking-wider text-[#52525B] font-semibold block">
                      Text Content
                    </label>
                    <textarea
                      rows={3}
                      value={currentOverride?.text ?? selectedElementData?.text ?? ""}
                      onChange={(e) => handleTextChange(e.target.value)}
                      placeholder="Enter new text..."
                      className="w-full bg-white text-[#18181B] p-2.5 rounded border border-[#D4D4D8] focus:outline-none focus:border-amber-500 font-sans text-sm resize-y shadow-2xs"
                    />

                    {/* Font Family */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#71717A]">Font Family</span>
                        <span className="text-amber-700 font-medium">{currentOverride?.styles?.fontFamily || "Default"}</span>
                      </div>
                      <select
                        value={currentOverride?.styles?.fontFamily || ""}
                        onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                        className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                      >
                        <option value="">Original Website Font</option>
                        <option value="editorial">Cormorant Garamond (Editorial Serif)</option>
                        <option value="serif">Cinzel / Playfair (Luxury Serif)</option>
                        <option value="sans">Neue Montreal / Inter (Modern Sans)</option>
                        <option value="mono">JetBrains Mono (Technical Mono)</option>
                      </select>
                    </div>

                    {/* Font Size & Weight */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Font Size</span>
                        <input
                          type="text"
                          placeholder="e.g. 24px, 2.5rem"
                          value={currentOverride?.styles?.fontSize || ""}
                          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Font Weight</span>
                        <select
                          value={currentOverride?.styles?.fontWeight || ""}
                          onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                        >
                          <option value="">Inherit</option>
                          <option value="200">200 (Thin)</option>
                          <option value="300">300 (Light)</option>
                          <option value="400">400 (Regular)</option>
                          <option value="500">500 (Medium)</option>
                          <option value="600">600 (Semibold)</option>
                          <option value="700">700 (Bold)</option>
                        </select>
                      </div>
                    </div>

                    {/* Text Color & Alignment */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Text Color</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="color"
                            value={currentOverride?.styles?.color || "#110F0E"}
                            onChange={(e) => handleStyleChange("color", e.target.value)}
                            className="w-7 h-7 rounded border border-[#D4D4D8] bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={currentOverride?.styles?.color || ""}
                            onChange={(e) => handleStyleChange("color", e.target.value)}
                            placeholder="#110F0E"
                            className="w-full bg-white text-[#18181B] p-1 rounded border border-[#D4D4D8] text-[11px] shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Alignment</span>
                        <select
                          value={currentOverride?.styles?.textAlign || ""}
                          onChange={(e) => handleStyleChange("textAlign", e.target.value)}
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                        >
                          <option value="">Default</option>
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                          <option value="justify">Justify</option>
                        </select>
                      </div>
                    </div>

                    {/* Letter Spacing & Transform */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Letter Spacing</span>
                        <select
                          value={currentOverride?.styles?.letterSpacing || ""}
                          onChange={(e) => handleStyleChange("letterSpacing", e.target.value)}
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                        >
                          <option value="">Default</option>
                          <option value="-0.04em">Tighter (-0.04em)</option>
                          <option value="-0.02em">Tight (-0.02em)</option>
                          <option value="normal">Normal (0)</option>
                          <option value="0.15em">Wide (0.15em)</option>
                          <option value="0.30em">Widest (0.30em)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Transform / Style</span>
                        <select
                          value={currentOverride?.styles?.textTransform || ""}
                          onChange={(e) => handleStyleChange("textTransform", e.target.value)}
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                        >
                          <option value="">Original</option>
                          <option value="uppercase">Uppercase</option>
                          <option value="lowercase">Lowercase</option>
                          <option value="capitalize">Capitalize</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. IMAGE EDITING & OPTICAL CONTROLS */}
                {currentType === "image" && (
                  <div className="space-y-3 border-b border-[#E2E2E6] pb-4">
                    <label className="text-[11px] uppercase tracking-wider text-[#52525B] font-semibold block">
                      Image Source
                    </label>

                    {/* Image Preview & URL */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentOverride?.src ?? selectedElementData?.src ?? ""}
                          onChange={(e) => handleImageChange(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded bg-white hover:bg-zinc-50 text-[#18181B] text-xs flex items-center gap-1 border border-[#D4D4D8] cursor-pointer shadow-2xs"
                          title="Upload file from disk"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Preset Gallery Picker Button */}
                      <button
                        type="button"
                        onClick={() => setShowGalleryModal(true)}
                        className="w-full py-1.5 rounded bg-white hover:bg-zinc-50 text-[#18181B] border border-[#D4D4D8] text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pick From Curated Atelier Gallery</span>
                      </button>
                    </div>

                    {/* Optical Sliders: Contrast, Brightness, Saturation, Blur */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#71717A]">Contrast</span>
                        <span className="font-semibold">{currentOverride?.styles?.contrast ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={currentOverride?.styles?.contrast ?? 100}
                        onChange={(e) => handleStyleChange("contrast", parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#71717A]">Brightness</span>
                        <span className="font-semibold">{currentOverride?.styles?.brightness ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="180"
                        value={currentOverride?.styles?.brightness ?? 100}
                        onChange={(e) => handleStyleChange("brightness", parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#71717A]">Saturation</span>
                        <span className="font-semibold">{currentOverride?.styles?.saturation ?? 100}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={currentOverride?.styles?.saturation ?? 100}
                        onChange={(e) => handleStyleChange("saturation", parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      <div className="flex justify-between text-[10px]">
                        <span className="text-[#71717A]">Blur</span>
                        <span className="font-semibold">{currentOverride?.styles?.blur ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={currentOverride?.styles?.blur ?? 0}
                        onChange={(e) => handleStyleChange("blur", parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    {/* Grayscale & Filter Presets */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStyleChange("grayscale", !currentOverride?.styles?.grayscale)}
                        className={`p-1.5 rounded border text-xs cursor-pointer ${
                          currentOverride?.styles?.grayscale
                            ? "bg-amber-100 text-amber-900 border-amber-400 font-semibold"
                            : "bg-white text-[#52525B] border-[#D4D4D8] hover:bg-zinc-50"
                        }`}
                      >
                        {currentOverride?.styles?.grayscale ? "✓ Grayscale On" : "Grayscale Off"}
                      </button>

                      <select
                        value={currentOverride?.styles?.objectFit || ""}
                        onChange={(e) => handleStyleChange("objectFit", e.target.value)}
                        className="bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                      >
                        <option value="">Fit: Cover</option>
                        <option value="contain">Contain</option>
                        <option value="fill">Fill</option>
                        <option value="none">Natural</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. SECTION EDITING (BACKGROUND, SPACING, BORDERS) */}
                {currentType === "section" && (
                  <div className="space-y-3 border-b border-[#E2E2E6] pb-4">
                    <label className="text-[11px] uppercase tracking-wider text-[#52525B] font-semibold block">
                      Section Appearance
                    </label>

                    {/* Background Color */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#71717A]">Background Color</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={currentOverride?.styles?.backgroundColor || "#EBE7E1"}
                          onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                          className="w-7 h-7 rounded border border-[#D4D4D8] bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={currentOverride?.styles?.backgroundColor || ""}
                          onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                          placeholder="#EBE7E1 or transparent"
                          className="w-full bg-white text-[#18181B] p-1 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Padding & Spacing */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Padding Top (px)</span>
                        <input
                          type="number"
                          value={currentOverride?.styles?.paddingTop ?? ""}
                          onChange={(e) => handleStyleChange("paddingTop", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 80"
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Padding Bottom (px)</span>
                        <input
                          type="number"
                          value={currentOverride?.styles?.paddingBottom ?? ""}
                          onChange={(e) => handleStyleChange("paddingBottom", parseInt(e.target.value) || 0)}
                          placeholder="e.g. 80"
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Border & Radius */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Border Radius (px)</span>
                        <input
                          type="number"
                          value={currentOverride?.styles?.borderRadius ?? ""}
                          onChange={(e) => handleStyleChange("borderRadius", parseInt(e.target.value) || 0)}
                          placeholder="0 to 40"
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#71717A]">Border Width (px)</span>
                        <input
                          type="number"
                          value={currentOverride?.styles?.borderWidth ?? ""}
                          onChange={(e) => handleStyleChange("borderWidth", parseInt(e.target.value) || 0)}
                          placeholder="0 to 8"
                          className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: EFFECTS & ANIMATIONS */}
            {selectedElementId && activeTab === "effects" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block">
                    Visual Effect / Animation
                  </label>
                  <button
                    type="button"
                    onClick={handleTriggerPreviewEffect}
                    className="px-2 py-1 rounded bg-amber-500 text-black text-[10px] font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors cursor-pointer shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Animation Type */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#71717A]">Effect Type</span>
                  <select
                    value={currentOverride?.animation?.type || "none"}
                    onChange={(e) => handleAnimationChange("type", e.target.value)}
                    className="w-full bg-white text-[#18181B] p-2 rounded border border-[#D4D4D8] text-xs cursor-pointer font-medium shadow-2xs"
                  >
                    <option value="none">None (Original Effect)</option>
                    <option value="fade-in">Fade In</option>
                    <option value="fade-out">Fade Out</option>
                    <option value="slide-up">Slide Up</option>
                    <option value="slide-down">Slide Down</option>
                    <option value="slide-left">Slide Left</option>
                    <option value="slide-right">Slide Right</option>
                    <option value="scale-in">Scale In</option>
                    <option value="scale-out">Scale Out</option>
                    <option value="reveal">Monograph Clip Reveal</option>
                    <option value="blur-reveal">Blur Reveal</option>
                    <option value="character-reveal">Character Reveal</option>
                    <option value="ken-burns">Ken Burns (Slow Motion Pan)</option>
                    <option value="zoom">Optical Zoom</option>
                  </select>
                </div>

                {/* Duration & Delay */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Duration (ms)</span>
                    <input
                      type="number"
                      step="50"
                      min="100"
                      max="4000"
                      value={currentOverride?.animation?.duration ?? 800}
                      onChange={(e) => handleAnimationChange("duration", parseInt(e.target.value) || 800)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Delay (ms)</span>
                    <input
                      type="number"
                      step="50"
                      min="0"
                      max="3000"
                      value={currentOverride?.animation?.delay ?? 0}
                      onChange={(e) => handleAnimationChange("delay", parseInt(e.target.value) || 0)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                    />
                  </div>
                </div>

                {/* Easing & Trigger */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Easing</span>
                    <select
                      value={currentOverride?.animation?.easing || "ease-out"}
                      onChange={(e) => handleAnimationChange("easing", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="ease-out">Ease Out</option>
                      <option value="ease-in-out">Ease In Out</option>
                      <option value="ease-in">Ease In</option>
                      <option value="linear">Linear</option>
                      <option value="cubic-bezier(0.16, 1, 0.3, 1)">Cubic Smooth</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Trigger</span>
                    <select
                      value={currentOverride?.animation?.trigger || "load"}
                      onChange={(e) => handleAnimationChange("trigger", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="load">On Page Load</option>
                      <option value="in-view">When In View</option>
                      <option value="hover">On Hover</option>
                      <option value="click">On Click</option>
                    </select>
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#71717A]">Intensity</span>
                    <span className="font-semibold">{currentOverride?.animation?.intensity ?? 50}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentOverride?.animation?.intensity ?? 50}
                    onChange={(e) => handleAnimationChange("intensity", parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: HOVER EFFECTS */}
            {selectedElementId && activeTab === "hover" && (
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block">
                  Hover State Controls
                </label>

                {/* Hover Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#71717A]">Hover Scale</span>
                    <span className="font-semibold">{currentOverride?.hoverStyles?.scale ?? 1.05}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="1.3"
                    step="0.01"
                    value={currentOverride?.hoverStyles?.scale ?? 1.05}
                    onChange={(e) => handleHoverChange("scale", parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Hover Text Color & Background */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Hover Text Color</span>
                    <input
                      type="text"
                      placeholder="#000000"
                      value={currentOverride?.hoverStyles?.color || ""}
                      onChange={(e) => handleHoverChange("color", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Hover Background</span>
                    <input
                      type="text"
                      placeholder="#FFFFFF"
                      value={currentOverride?.hoverStyles?.backgroundColor || ""}
                      onChange={(e) => handleHoverChange("backgroundColor", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                    />
                  </div>
                </div>

                {/* Hover Shadow & Duration */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Hover Shadow</span>
                    <select
                      value={currentOverride?.hoverStyles?.shadow || ""}
                      onChange={(e) => handleHoverChange("shadow", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="">Default</option>
                      <option value="0 10px 25px rgba(0,0,0,0.15)">Subtle Lift</option>
                      <option value="0 15px 35px rgba(0,0,0,0.3)">Elevated</option>
                      <option value="0 0 20px rgba(0,0,0,0.1)">Soft Glow</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Transition (ms)</span>
                    <input
                      type="number"
                      value={currentOverride?.hoverStyles?.duration ?? 300}
                      onChange={(e) => handleHoverChange("duration", parseInt(e.target.value) || 300)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SCROLL EFFECTS & PAGE TRANSITIONS */}
            {selectedElementId && activeTab === "scroll" && (
              <div className="space-y-4">
                <label className="text-[11px] uppercase tracking-wider text-amber-700 font-bold block">
                  Scroll-Triggered Behavior
                </label>

                {/* Scroll Effect Type */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#71717A]">Scroll Effect</span>
                  <select
                    value={currentOverride?.scrollEffect?.type || "none"}
                    onChange={(e) => handleScrollChange("type", e.target.value)}
                    className="w-full bg-white text-[#18181B] p-2 rounded border border-[#D4D4D8] text-xs cursor-pointer font-medium shadow-2xs"
                  >
                    <option value="none">None (Keep existing)</option>
                    <option value="parallax">Parallax Drift</option>
                    <option value="fade-on-scroll">Fade On Scroll</option>
                    <option value="reveal-on-scroll">Reveal On Scroll</option>
                    <option value="scale-on-scroll">Scale On Scroll</option>
                    <option value="sticky">Sticky Pinning</option>
                  </select>
                </div>

                {/* Speed & Direction */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Scroll Speed</span>
                    <select
                      value={currentOverride?.scrollEffect?.speed || 1.0}
                      onChange={(e) => handleScrollChange("speed", parseFloat(e.target.value))}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="0.5">0.5x (Subtle)</option>
                      <option value="1.0">1.0x (Standard)</option>
                      <option value="1.5">1.5x (Fast)</option>
                      <option value="2.0">2.0x (Aggressive)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#71717A]">Direction</span>
                    <select
                      value={currentOverride?.scrollEffect?.direction || "up"}
                      onChange={(e) => handleScrollChange("direction", e.target.value)}
                      className="w-full bg-white text-[#18181B] p-1.5 rounded border border-[#D4D4D8] text-xs cursor-pointer shadow-2xs"
                    >
                      <option value="up">Upward</option>
                      <option value="down">Downward</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                {/* Page Transitions Info */}
                <div className="pt-3 border-t border-[#E2E2E6] space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-semibold">
                    Website Page Transitions
                  </span>
                  <div className="p-2.5 rounded bg-white border border-[#D4D4D8] text-[11px] text-[#52525B] space-y-1 shadow-2xs">
                    <p>• Hairline instant route choreography active.</p>
                    <p>• All 7 pages pre-fetched on mount for zero latency.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* INSPECTOR FOOTER: RESET / SAVE / PUBLISH ACTIONS */}
          {selectedElementId && (
            <div className="p-3 border-t border-[#D6D6D8] bg-[#F2F2F5] shrink-0 space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleResetEffect}
                  className="flex-1 py-1.5 rounded bg-white hover:bg-zinc-50 text-[#3F3F46] hover:text-black border border-[#D4D4D8] text-[11px] font-mono transition-colors cursor-pointer shadow-2xs"
                  title="Return element to original website effect"
                >
                  Reset Effect
                </button>
                <button
                  type="button"
                  onClick={handleResetElement}
                  className="flex-1 py-1.5 rounded bg-white hover:bg-rose-50 text-[#71717A] hover:text-rose-600 border border-[#D4D4D8] text-[11px] font-mono transition-colors cursor-pointer shadow-2xs"
                  title="Remove all custom edits on this element"
                >
                  Reset Element
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 py-2 rounded bg-white hover:bg-zinc-50 text-[#18181B] text-xs font-mono font-medium border border-[#D4D4D8] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#52525B]" />
                  <span>Save Draft</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="flex-1 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Publish</span>
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* CURATED PRESET GALLERY MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#D4D4D8] rounded-xl max-w-2xl w-full p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#E2E2E6] pb-3">
              <div>
                <h3 className="font-mono text-sm text-[#18181B] font-bold">Curated Atelier Gallery</h3>
                <p className="font-mono text-[11px] text-[#71717A]">Select a high-resolution plate for replacement</p>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="text-[#71717A] hover:text-black font-mono text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-y-auto flex-1 p-1">
              {PRESET_IMAGE_GALLERY.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleImageChange(img.url);
                    setShowGalleryModal(false);
                    showToast(`Selected "${img.label}"`);
                  }}
                  className="group relative aspect-4/5 rounded-lg overflow-hidden border border-[#D4D4D8] hover:border-amber-500 cursor-pointer transition-all shadow-xs"
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 p-2 flex flex-col justify-end">
                    <span className="text-[10px] text-amber-300 font-mono font-semibold">{img.category}</span>
                    <span className="text-[11px] text-white font-mono leading-tight">{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#18181B] text-white border border-zinc-700 rounded-full px-5 py-2.5 shadow-2xl font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
