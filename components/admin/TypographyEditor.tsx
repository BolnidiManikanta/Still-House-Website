"use client";

import React from "react";
import { TypographyConfig } from "@/lib/admin/types";
import { getTypographyStyles } from "@/lib/admin/styleHelpers";
import { Type, Sparkles, Sliders, Palette } from "lucide-react";

interface TypographyEditorProps {
  label: string;
  value?: TypographyConfig;
  onChange: (updated: TypographyConfig) => void;
  sampleText?: string;
}

const DEFAULT_TYPOGRAPHY_VALUES: TypographyConfig = {
  fontFamily: "serif",
  fontWeight: "400",
  fontSizeScale: 1.0,
  letterSpacing: "normal",
  textTransform: "uppercase",
  textEffect: "none",
  color: "#151515",
};

const FONT_FAMILIES: { key: TypographyConfig["fontFamily"]; label: string; sample: string }[] = [
  { key: "serif", label: "Luxury Serif", sample: "Cinzel / Garamond" },
  { key: "editorial", label: "High Editorial", sample: "Cormorant / Didot" },
  { key: "playfair", label: "Playfair Display", sample: "Playfair Headline" },
  { key: "sans", label: "Modern Sans", sample: "Neue Montreal" },
  { key: "mono", label: "Technical Mono", sample: "JetBrains Mono" },
];

const FONT_WEIGHTS: { key: TypographyConfig["fontWeight"]; label: string }[] = [
  { key: "300", label: "Light 300" },
  { key: "400", label: "Regular 400" },
  { key: "500", label: "Medium 500" },
  { key: "600", label: "SemiBold 600" },
  { key: "700", label: "Bold 700" },
];

const LETTER_SPACINGS: { key: TypographyConfig["letterSpacing"]; label: string }[] = [
  { key: "tighter", label: "Tighter (-0.04)" },
  { key: "tight", label: "Tight (-0.02)" },
  { key: "normal", label: "Normal (0)" },
  { key: "wide", label: "Wide (+0.18)" },
  { key: "widest", label: "Widest (+0.32)" },
];

const TEXT_TRANSFORMS: { key: TypographyConfig["textTransform"]; label: string }[] = [
  { key: "uppercase", label: "UPPERCASE" },
  { key: "none", label: "Normal case" },
  { key: "capitalize", label: "Capitalize Words" },
  { key: "lowercase", label: "lowercase" },
];

const TEXT_EFFECTS: { key: TypographyConfig["textEffect"]; label: string; desc: string }[] = [
  { key: "none", label: "None", desc: "Crisp Flat" },
  { key: "subtle", label: "Subtle Ambient", desc: "Soft diffuse shadow" },
  { key: "cinematic", label: "Cinematic Noir", desc: "Deep multi-layer shadow" },
  { key: "glow", label: "Amber Halation", desc: "Warm gold luminescent edge" },
  { key: "deep", label: "Monumental Void", desc: "Heavy architectural drop" },
];

const COLOR_PRESETS = [
  { label: "Obsidian", color: "#151515" },
  { label: "Pure White", color: "#FFFFFF" },
  { label: "Warm Cream", color: "#F5F2ED" },
  { label: "Muted Sand", color: "#D7D7D2" },
  { label: "Amber Gold", color: "#D97706" },
  { label: "Charcoal Slate", color: "#44403C" },
  { label: "Crimson Rust", color: "#991B1B" },
];

export const TypographyEditor: React.FC<TypographyEditorProps> = ({
  label,
  value,
  onChange,
  sampleText = "STILL STUDIO ARCHIVE · SCULPTED LIGHT",
}) => {
  const current = { ...DEFAULT_TYPOGRAPHY_VALUES, ...(value || {}) };

  const update = (patch: Partial<TypographyConfig>) => {
    onChange({ ...current, ...patch });
  };

  const previewStyles = getTypographyStyles(current);

  return (
    <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-5 text-white/90">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-white/90">
            {label} — Typography &amp; Font Styling
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_TYPOGRAPHY_VALUES)}
          className="text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-wider"
        >
          Reset Typography
        </button>
      </div>

      {/* Live Sample Preview Box */}
      <div className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-hidden flex flex-col justify-center min-h-[90px] relative">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 absolute top-2 right-3">
          Live Dynamic Render
        </span>
        <p
          style={previewStyles}
          className="transition-all duration-200 select-none text-center truncate max-w-full"
        >
          {sampleText}
        </p>
      </div>

      {/* Grid of Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
            1. Font Style (Typeface Family)
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {FONT_FAMILIES.map((font) => (
              <button
                key={font.key}
                type="button"
                onClick={() => update({ fontFamily: font.key })}
                className={`px-3 py-2 rounded-lg text-left transition-all border flex items-center justify-between ${
                  current.fontFamily === font.key
                    ? "bg-amber-400/20 border-amber-400/60 text-white font-medium shadow-sm"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{font.label}</span>
                <span className="text-[10px] font-mono opacity-50">{font.sample}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Weight & Size Scale */}
        <div className="space-y-5">
          {/* Font Weight */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
              2. Font Weight (Thickness)
            </label>
            <div className="grid grid-cols-5 gap-1">
              {FONT_WEIGHTS.map((weight) => (
                <button
                  key={weight.key}
                  type="button"
                  onClick={() => update({ fontWeight: weight.key })}
                  className={`py-2 px-1 text-center rounded text-[11px] font-mono transition-all border ${
                    current.fontWeight === weight.key
                      ? "bg-amber-400/20 border-amber-400/60 text-white font-bold"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {weight.key}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Scale */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono text-white/60">
              <span className="uppercase tracking-wider">3. Font Size Scale</span>
              <span className="text-amber-400 font-semibold font-mono">
                {Math.round(current.fontSizeScale * 100)}% ({current.fontSizeScale}x)
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="2.2"
              step="0.05"
              value={current.fontSizeScale}
              onChange={(e) => update({ fontSizeScale: parseFloat(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
            <div className="flex gap-1">
              {[0.8, 1.0, 1.25, 1.5, 1.8, 2.0].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ fontSizeScale: s })}
                  className={`flex-1 py-1 text-[9px] font-mono rounded border transition-colors ${
                    current.fontSizeScale === s
                      ? "bg-amber-400/20 border-amber-400/50 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
              4. Letter Spacing (Tracking)
            </label>
            <div className="grid grid-cols-5 gap-1">
              {LETTER_SPACINGS.map((sp) => (
                <button
                  key={sp.key}
                  type="button"
                  onClick={() => update({ letterSpacing: sp.key })}
                  className={`py-1.5 px-1 text-center rounded text-[10px] font-mono transition-all border ${
                    current.letterSpacing === sp.key
                      ? "bg-amber-400/20 border-amber-400/60 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {sp.key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Font Effects & Color Section */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Text Effect / Atmospheric Shadows */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>5. Font Effect (Shadow / Halation Glow)</span>
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {TEXT_EFFECTS.map((fx) => (
              <button
                key={fx.key}
                type="button"
                onClick={() => update({ textEffect: fx.key })}
                className={`px-3 py-2 rounded-lg text-left transition-all border flex items-center justify-between ${
                  current.textEffect === fx.key
                    ? "bg-amber-400/20 border-amber-400/60 text-white font-medium"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                <span className="font-medium">{fx.label}</span>
                <span className="text-[10px] font-mono opacity-50">{fx.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Transform & Color Palette */}
        <div className="space-y-4">
          {/* Text Transform */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
              6. Text Casing (Transform)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TEXT_TRANSFORMS.map((tr) => (
                <button
                  key={tr.key}
                  type="button"
                  onClick={() => update({ textTransform: tr.key })}
                  className={`py-2 px-2 text-center rounded text-[11px] font-mono transition-all border ${
                    current.textTransform === tr.key
                      ? "bg-amber-400/20 border-amber-400/60 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>7. Text Color</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.color}
                  type="button"
                  onClick={() => update({ color: preset.color })}
                  title={preset.label}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center ${
                    current.color === preset.color
                      ? "border-amber-400 ring-2 ring-amber-400/40 scale-110"
                      : "border-white/20"
                  }`}
                  style={{ backgroundColor: preset.color }}
                />
              ))}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[10px] font-mono text-white/50">Custom:</span>
                <input
                  type="color"
                  value={current.color || "#151515"}
                  onChange={(e) => update({ color: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-white/20 bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
