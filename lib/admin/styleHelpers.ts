import type { CSSProperties } from "react";
import type { TypographyConfig, ImageCustomStyleConfig } from "./types";

export function getTypographyStyles(t?: TypographyConfig): CSSProperties {
  if (!t) return {};
  const styles: CSSProperties = {};

  // Font Family
  if (t.fontFamily === "serif") {
    styles.fontFamily = "'Cinzel', 'Playfair Display', Georgia, serif";
  } else if (t.fontFamily === "editorial") {
    styles.fontFamily = "'Cormorant Garamond', 'Didot', 'Playfair Display', serif";
  } else if (t.fontFamily === "sans") {
    styles.fontFamily = "'Neue Montreal', 'Inter', -apple-system, sans-serif";
  } else if (t.fontFamily === "mono") {
    styles.fontFamily = "'JetBrains Mono', 'Courier New', monospace";
  } else if (t.fontFamily === "playfair") {
    styles.fontFamily = "'Playfair Display', 'Newsreader', Georgia, serif";
  }

  // Font Weight
  if (t.fontWeight) {
    styles.fontWeight = Number(t.fontWeight);
  }

  // Font Size Multiplier (Scale)
  if (t.fontSizeScale && t.fontSizeScale !== 1) {
    styles.fontSize = `calc(1em * ${t.fontSizeScale})`;
  }

  // Letter Spacing
  if (t.letterSpacing === "tighter") {
    styles.letterSpacing = "-0.04em";
  } else if (t.letterSpacing === "tight") {
    styles.letterSpacing = "-0.02em";
  } else if (t.letterSpacing === "normal") {
    styles.letterSpacing = "normal";
  } else if (t.letterSpacing === "wide") {
    styles.letterSpacing = "0.18em";
  } else if (t.letterSpacing === "widest") {
    styles.letterSpacing = "0.32em";
  }

  // Text Transform
  if (t.textTransform) {
    styles.textTransform = t.textTransform;
  }

  // Text Effect / Shadows
  if (t.textEffect === "subtle") {
    styles.textShadow = "0 2px 10px rgba(0,0,0,0.35)";
  } else if (t.textEffect === "cinematic") {
    styles.textShadow = "0 4px 24px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.9)";
  } else if (t.textEffect === "glow") {
    styles.textShadow = "0 0 20px rgba(220,185,130,0.7), 0 0 6px rgba(255,255,255,0.85)";
  } else if (t.textEffect === "deep") {
    styles.textShadow = "0 10px 35px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.8)";
  }

  // Color Override
  if (t.color) {
    styles.color = t.color;
  }

  return styles;
}

export function getImageFilterStyles(img?: Partial<ImageCustomStyleConfig>): CSSProperties {
  if (!img) return {};
  const filters: string[] = [];

  if (img.grayscale) {
    filters.push("grayscale(100%)");
  }
  if (img.contrast !== undefined && img.contrast !== 100) {
    filters.push(`contrast(${img.contrast}%)`);
  }
  if (img.brightness !== undefined && img.brightness !== 100) {
    filters.push(`brightness(${img.brightness}%)`);
  }
  if (img.saturation !== undefined && img.saturation !== 100 && !img.grayscale) {
    filters.push(`saturate(${img.saturation}%)`);
  }
  if (img.blur !== undefined && img.blur > 0) {
    filters.push(`blur(${img.blur}px)`);
  }
  if (img.sepia !== undefined && img.sepia > 0) {
    filters.push(`sepia(${img.sepia}%)`);
  }

  const styles: CSSProperties = {};

  if (filters.length > 0) {
    styles.filter = filters.join(" ");
  }
  if (img.scale !== undefined && img.scale !== 1) {
    styles.transform = `scale(${img.scale})`;
  }
  if (img.borderRadius !== undefined) {
    styles.borderRadius = `${img.borderRadius}px`;
  }
  if (img.aspectRatio && img.aspectRatio !== "natural") {
    styles.aspectRatio = img.aspectRatio;
  }

  return styles;
}
