"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { ImageCustomStyleConfig } from "@/lib/admin/types";
import { getImageFilterStyles } from "@/lib/admin/styleHelpers";
import { PRESET_IMAGE_GALLERY } from "@/lib/admin/defaultConfig";
import { ImageIcon, Upload, Sparkles, Sliders, Maximize2, Crop } from "lucide-react";

interface ImageEffectsEditorProps {
  label: string;
  imageUrl: string;
  styleValue?: Partial<ImageCustomStyleConfig>;
  onImageChange: (url: string) => void;
  onStyleChange: (updated: Partial<ImageCustomStyleConfig>) => void;
  defaultUrl?: string;
}

const DEFAULT_STYLE_VALUES: ImageCustomStyleConfig = {
  url: "",
  scale: 1.0,
  aspectRatio: "natural",
  borderRadius: 0,
  contrast: 100,
  brightness: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  grayscale: false,
};

const ASPECT_RATIOS: { key: ImageCustomStyleConfig["aspectRatio"]; label: string; desc: string }[] = [
  { key: "natural", label: "Natural", desc: "Original file aspect" },
  { key: "16/9", label: "16:9 Wide", desc: "Cinematic horizontal" },
  { key: "4/5", label: "4:5 Medium", desc: "Fine art editorial" },
  { key: "3/4", label: "3:4 Tall", desc: "Gallery portraiture" },
  { key: "1/1", label: "1:1 Square", desc: "Monolith balance" },
  { key: "21/9", label: "21:9 Cinema", desc: "Ultra-wide panoramic" },
];

export const ImageEffectsEditor: React.FC<ImageEffectsEditorProps> = ({
  label,
  imageUrl,
  styleValue,
  onImageChange,
  onStyleChange,
  defaultUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresetDrawer, setShowPresetDrawer] = useState(false);
  const current = { ...DEFAULT_STYLE_VALUES, ...(styleValue || {}) };

  const update = (patch: Partial<ImageCustomStyleConfig>) => {
    onStyleChange({ ...current, ...patch });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onImageChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const filterStyles = getImageFilterStyles(current);

  return (
    <div className="bg-[#181818] border border-white/10 rounded-xl p-5 space-y-5 text-white/90">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-white/90">
            {label} — Image, Resize &amp; Effects
          </span>
        </div>
        <div className="flex items-center gap-2">
          {defaultUrl && (
            <button
              type="button"
              onClick={() => {
                onImageChange(defaultUrl);
                onStyleChange(DEFAULT_STYLE_VALUES);
              }}
              className="text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-wider"
            >
              Reset Image &amp; FX
            </button>
          )}
        </div>
      </div>

      {/* Image Source & Upload Control */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={imageUrl.startsWith("data:") ? "[Local Uploaded Image File Active]" : imageUrl}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-example or paste image URL"
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400 font-mono transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-xs font-mono uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors cursor-pointer text-white"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => setShowPresetDrawer(!showPresetDrawer)}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border transition-colors cursor-pointer ${
                showPresetDrawer
                  ? "bg-amber-400/20 border-amber-400 text-amber-300"
                  : "bg-white/10 hover:bg-white/20 border-white/15 text-white"
              }`}
            >
              Presets
            </button>
          </div>
        </div>

        {/* Preset Drawer */}
        {showPresetDrawer && (
          <div className="p-3 bg-black/50 border border-white/10 rounded-lg space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
              Curated Architectural Gallery Presets (Click to apply)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGE_GALLERY.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    onImageChange(preset.url);
                    setShowPresetDrawer(false);
                  }}
                  className="group relative h-16 rounded overflow-hidden border border-white/10 hover:border-amber-400 transition-all text-left"
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono text-white/90 truncate leading-tight">
                      {preset.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Live Preview & Resize Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        {/* Live Visual Preview */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-black/70 border border-white/10 rounded-xl p-4 min-h-[220px] overflow-hidden relative">
          <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 absolute top-2 left-3">
            Real-Time Output Preview
          </span>
          <div className="w-full max-w-[280px] max-h-[260px] overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                style={filterStyles}
                className="max-h-[200px] w-auto object-cover transition-all duration-150"
              />
            ) : (
              <div className="text-center py-10 text-white/30 text-xs font-mono">
                No image source specified
              </div>
            )}
          </div>
          <div className="mt-3 text-[10px] font-mono text-white/50 text-center">
            Aspect: {current.aspectRatio} • Scale: {Math.round(current.scale * 100)}% • Radius: {current.borderRadius}px
          </div>
        </div>

        {/* Resize Controls */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-white/10 pb-2">
            <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/80">
              Image Resize &amp; Dimensions
            </span>
          </div>

          {/* Scale Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span className="uppercase tracking-wider">Image Scale / Zoom</span>
              <span className="text-emerald-400 font-semibold">{Math.round(current.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.05"
              value={current.scale}
              onChange={(e) => update({ scale: parseFloat(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Aspect Ratio Buttons */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-white/60 block">
              Aspect Ratio Crop
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.key}
                  type="button"
                  onClick={() => update({ aspectRatio: ratio.key })}
                  className={`py-1.5 px-2 rounded text-[10px] font-mono transition-all border text-left flex flex-col ${
                    current.aspectRatio === ratio.key
                      ? "bg-emerald-400/20 border-emerald-400/60 text-white font-semibold"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <span>{ratio.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span className="uppercase tracking-wider">Corner Rounding (Radius)</span>
              <span className="text-emerald-400 font-semibold">{current.borderRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              step="2"
              value={current.borderRadius}
              onChange={(e) => update({ borderRadius: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
            <div className="flex gap-1">
              {[0, 6, 12, 20, 32].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update({ borderRadius: r })}
                  className={`flex-1 py-1 text-[9px] font-mono rounded border transition-colors ${
                    current.borderRadius === r
                      ? "bg-emerald-400/20 border-emerald-400/50 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {r === 0 ? "Sharp (0px)" : `${r}px`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Effects (Filters) */}
      <div className="pt-3 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/80">
              Image Visual Effects &amp; Filters
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              update({
                contrast: 100,
                brightness: 100,
                saturation: 100,
                blur: 0,
                sepia: 0,
                grayscale: false,
              })
            }
            className="text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>Contrast</span>
              <span className="text-emerald-400 font-mono">{current.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="180"
              step="5"
              value={current.contrast}
              onChange={(e) => update({ contrast: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>Brightness</span>
              <span className="text-emerald-400 font-mono">{current.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="160"
              step="5"
              value={current.brightness}
              onChange={(e) => update({ brightness: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Saturation & Grayscale */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>Saturation</span>
              <span className="text-emerald-400 font-mono">{current.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={current.saturation}
              onChange={(e) => update({ saturation: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Soft Blur */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>Soft Focus (Blur)</span>
              <span className="text-emerald-400 font-mono">{current.blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={current.blur}
              onChange={(e) => update({ blur: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Sepia Warmth */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-white/60">
              <span>Warm Tone (Sepia)</span>
              <span className="text-emerald-400 font-mono">{current.sepia}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="5"
              value={current.sepia}
              onChange={(e) => update({ sepia: parseInt(e.target.value) })}
              className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
          </div>

          {/* Grayscale Toggle */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/70">
              Monochrome B&amp;W
            </span>
            <button
              type="button"
              onClick={() => update({ grayscale: !current.grayscale })}
              className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                current.grayscale
                  ? "bg-emerald-400/20 border-emerald-400 text-white font-bold"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
              }`}
            >
              {current.grayscale ? "ENABLED" : "OFF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
