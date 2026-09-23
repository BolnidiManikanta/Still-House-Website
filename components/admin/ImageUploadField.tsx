"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Image as ImageIcon, Link as LinkIcon, Sparkles, Check, RefreshCw } from "lucide-react";
import { PRESET_IMAGE_GALLERY } from "@/lib/admin/defaultConfig";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  aspectRatioHint?: string;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  aspectRatioHint = "16:9 or 4:3 recommended",
  description,
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [inputUrl, setInputUrl] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when external value changes
  React.useEffect(() => {
    setInputUrl(value);
  }, [value]);

  const handleUrlBlur = () => {
    if (inputUrl.trim() && inputUrl !== value) {
      onChange(inputUrl.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g., 5MB)
    if (file.size > 8 * 1024 * 1024) {
      alert("Please choose an image under 8MB for optimal browser performance.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setInputUrl(reader.result);
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const selectPreset = (url: string) => {
    setInputUrl(url);
    onChange(url);
    setShowPresets(false);
  };

  return (
    <div className="space-y-3 rounded-xl border border-black/10 bg-black/[0.02] p-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#111111]">
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-[#666666] mt-0.5">{description}</p>
          )}
        </div>
        <span className="text-[10px] font-mono text-[#888888]">{aspectRatioHint}</span>
      </div>

      {/* Preview Card */}
      <div className="relative group overflow-hidden rounded-lg border border-black/15 bg-[#EAE8E4] h-48 w-full flex items-center justify-center">
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            unoptimized={value.startsWith("data:")}
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#888888]">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs font-mono">No Image Configured</span>
          </div>
        )}

        {/* Overlay Action Bar */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-100 transition-all cursor-pointer shadow-md"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-1.5 rounded-full bg-black/80 text-white border border-white/30 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 hover:bg-black transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Manual URL Input & Controls */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
            <LinkIcon className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={inputUrl.startsWith("data:") ? "[Local Uploaded Image File]" : inputUrl}
            disabled={inputUrl.startsWith("data:")}
            onChange={(e) => setInputUrl(e.target.value)}
            onBlur={handleUrlBlur}
            onKeyDown={(e) => e.key === "Enter" && handleUrlBlur()}
            placeholder="Paste image URL (Unsplash, HTTPS, etc.)..."
            className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg border border-black/15 bg-white text-[#111111] focus:outline-none focus:ring-1 focus:ring-black placeholder:text-neutral-400"
          />
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload image from computer"
          className="px-3 py-2 rounded-lg border border-black/15 bg-white hover:bg-neutral-50 text-xs font-mono text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          title="Pick from studio preset library"
          className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
            showPresets
              ? "border-black bg-black text-white"
              : "border-black/15 bg-white hover:bg-neutral-50 text-[#111111]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Presets</span>
        </button>
      </div>

      {/* Presets Gallery Drawer */}
      {showPresets && (
        <div className="mt-3 p-3 rounded-lg border border-black/10 bg-white/80 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-500">
            <span>Fine-Art Presets Bank</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-neutral-400 hover:text-black cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_IMAGE_GALLERY.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectPreset(preset.url)}
                className={`group relative h-20 rounded-md overflow-hidden border text-left cursor-pointer transition-all ${
                  value === preset.url ? "ring-2 ring-black border-transparent" : "border-black/10 hover:border-black/30"
                }`}
              >
                <Image
                  src={preset.url}
                  alt={preset.label}
                  fill
                  sizes="120px"
                  className="object-cover object-center group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-1.5">
                  <span className="text-[9px] font-mono text-white font-medium truncate">
                    {preset.label}
                  </span>
                  <span className="text-[8px] font-mono text-white/70">
                    {preset.category}
                  </span>
                </div>
                {value === preset.url && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
