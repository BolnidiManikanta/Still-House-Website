"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sliders, Settings, Lock, Sparkles, X, ChevronUp, ChevronDown } from "lucide-react";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";

export default function AdminFloatingBar() {
  const pathname = usePathname();
  const { isAdmin, setIsAdmin, config, updateEffects } = useSiteConfig();
  const [collapsed, setCollapsed] = useState(false);
  const [showQuickEffects, setShowQuickEffects] = useState(false);

  // Do not render floating bar on the admin page itself
  if (pathname === "/admin") return null;

  // If not admin, show a tiny, elegant, non-intrusive watermark button in bottom corner for 1-click admin login
  if (!isAdmin) {
    return (
      <div className="fixed bottom-4 left-4 z-50 pointer-events-auto">
        <Link
          href="/admin"
          className="group px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white/70 hover:text-white backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] transition-all flex items-center gap-1.5 shadow-lg opacity-40 hover:opacity-100"
          title="Open Admin Studio CMS"
        >
          <Settings className="w-3 h-3 group-hover:rotate-45 transition-transform" />
          <span>ADMIN</span>
        </Link>
      </div>
    );
  }

  const getPageLabel = () => {
    if (pathname === "/") return "Home Exhibition";
    if (pathname === "/film") return "Film Showcase";
    if (pathname === "/krishna") return "Krishna Architecture";
    if (pathname.startsWith("/contact") || pathname === "/reviews") return "Contact & Reviews";
    return pathname;
  };

  return (
    <aside aria-label="Admin quick controls" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[94vw] w-auto">
      <div className="bg-[#151412]/90 text-white backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider text-white/90 font-medium hidden sm:inline">
            ADMIN ACTIVE
          </span>
          <span className="text-white/40 hidden md:inline">·</span>
          <span className="text-[11px] text-white/70 hidden md:inline">
            {getPageLabel()}
          </span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        {/* Jump to Full Admin Studio */}
        <Link
          href="/admin"
          className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-mono uppercase tracking-wider font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Settings className="w-3 h-3" />
          <span>EDIT IN ADMIN</span>
        </Link>

        {/* Quick Optical Tuning Toggle */}
        <button
          type="button"
          onClick={() => setShowQuickEffects(!showQuickEffects)}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            showQuickEffects ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
          }`}
          title="Quick Optical Tuning"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Lock / Exit Admin */}
        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className="p-1.5 rounded-full text-white/50 hover:text-rose-400 transition-colors cursor-pointer"
          title="Lock Admin Session"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Optical Tuning Popup */}
      {showQuickEffects && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-80 bg-[#1C1A18]/95 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3 font-mono text-white text-xs animate-fade-in">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-[10px] uppercase tracking-wider text-white/60">
              Live Atmosphere Tuning
            </span>
            <button
              type="button"
              onClick={() => setShowQuickEffects(false)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/70">Film Grain</span>
              <span>{(config.effects.grainOpacity * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.12"
              step="0.005"
              value={config.effects.grainOpacity}
              onChange={(e) => updateEffects({ grainOpacity: parseFloat(e.target.value) })}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/70">Contrast</span>
              <span>{config.effects.contrast}%</span>
            </div>
            <input
              type="range"
              min="85"
              max="135"
              step="1"
              value={config.effects.contrast}
              onChange={(e) => updateEffects({ contrast: parseInt(e.target.value) })}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-white/70">Saturation</span>
              <span>{config.effects.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="130"
              step="2"
              value={config.effects.saturation}
              onChange={(e) => updateEffects({ saturation: parseInt(e.target.value) })}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
