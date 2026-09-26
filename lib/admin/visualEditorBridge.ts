import { VisualElementOverride, ElementAnimationConfig, ElementHoverConfig } from "./types";

export interface PageDefinition {
  id: string;
  name: string;
  path: string;
  description: string;
}

export const SUPPORTED_PAGES: PageDefinition[] = [
  { id: "home", name: "Home", path: "/", description: "Dreamscapes main monograph exhibition and curatorial scenes" },
  { id: "work", name: "Work", path: "/work", description: "Photographic suites, isolation reflections & archive monographs" },
  { id: "project", name: "Project", path: "/project/blueyard", description: "Blueyard spatial monograph & brutalist light study" },
  { id: "portfolio", name: "Portfolio", path: "/portfolio", description: "Fine art editorial stories and visual gallery" },
  { id: "film", name: "Film", path: "/film", description: "Bas-relief tactile cinematics and spatial sound design" },
  { id: "krishna", name: "Krishna", path: "/krishna", description: "Grand visual archive, wedding ceremonies & milestone chapters" },
  { id: "contactReviews", name: "Contact & Review", path: "/contact-reviews", description: "Studio atelier bookings, inquiry calculator & verified client reviews" },
];

export interface PageQuickElement {
  id: string;
  name: string;
  page: string;
  elementType: 'text' | 'image' | 'button' | 'section' | 'link';
  selector: string;
  description: string;
}

export const PRESET_PAGE_ELEMENTS: Record<string, PageQuickElement[]> = {
  "/": [
    { id: "home-hero-title", name: "Hero Monograph Title", page: "/", elementType: "text", selector: ".hero-title, [data-admin='hero-title'], h1", description: "DREAMSCAPES large editorial serif title" },
    { id: "home-hero-subtitle", name: "Hero Subheading", page: "/", elementType: "text", selector: ".hero-subtitle, [data-admin='hero-subtitle'], h2", description: "Architectural monographs & atmospheric light phenomena" },
    { id: "home-hero-cta", name: "Hero Action Button", page: "/", elementType: "button", selector: ".hero-cta, [data-admin='hero-cta'], a.glass-capsule", description: "CONTACT & REVIEW glassmorphic button" },
    { id: "home-plate-01", name: "Hero Plate 01 (Kyoto Monolith)", page: "/", elementType: "image", selector: ".hero-plate-01 img, [data-admin='plate-01'] img, .art-image-museum", description: "Featured architectural museum plate" },
    { id: "home-plate-02", name: "Hero Plate 02 (Sanctuary Void)", page: "/", elementType: "image", selector: ".hero-plate-02 img, [data-admin='plate-02'] img", description: "Secondary architectural atmospheric plate" },
    { id: "home-curatorial-sec", name: "Curatorial Overview Section", page: "/", elementType: "section", selector: "section#curatorial, [data-admin='curatorial-section']", description: "Curatorial overview section container" },
    { id: "home-curatorial-h2", name: "Curatorial Heading", page: "/", elementType: "text", selector: "h2.font-editorial-serif, [data-admin='curatorial-heading']", description: "The Silence of Monumental Forms" },
    { id: "home-curatorial-p", name: "Curatorial Narrative", page: "/", elementType: "text", selector: ".curatorial-narrative, [data-admin='curatorial-text'] p", description: "Exhibition curatorial statement" },
    { id: "home-next-banner", name: "Continuing Monograph Banner", page: "/", elementType: "image", selector: ".next-monograph-banner img, [data-admin='next-banner'] img", description: "Blueyard next monograph teaser plate" },
    { id: "home-next-cta", name: "Next Monograph CTA", page: "/", elementType: "button", selector: ".next-monograph-cta, [data-admin='next-cta']", description: "EXPLORE CASE STUDY link button" },
  ],
  "/work": [
    { id: "work-hero-title", name: "Work Hero Title", page: "/work", elementType: "text", selector: "h1.font-editorial-serif, .work-hero-title", description: "DREAM / SCAPES volume title" },
    { id: "work-overview", name: "Project Overview Narrative", page: "/work", elementType: "text", selector: ".work-overview-text, [data-admin='work-overview']", description: "Detailed monograph exploration text" },
    { id: "work-hero-plate", name: "Hero Exhibition Plate", page: "/work", elementType: "image", selector: ".work-hero-plate img, [data-admin='work-hero-image'] img", description: "Kyoto Reykjavik duality centerpiece" },
    { id: "work-suites-section", name: "Photographic Suites Section", page: "/work", elementType: "section", selector: "section#photographic-suites, .suites-container", description: "Architectural suite plates container" },
    { id: "work-plate-suite-01", name: "Suite Plate 01 (Isolation)", page: "/work", elementType: "image", selector: "[data-admin='work-plate-0'] img, .suite-plate-0 img", description: "Isolation reflections plate" },
  ],
  "/project/blueyard": [
    { id: "project-title", name: "Project Title", page: "/project/blueyard", elementType: "text", selector: "h1.font-editorial-serif, [data-admin='project-title']", description: "BLUEYARD brutalist spatial study title" },
    { id: "project-eyebrow", name: "Project Tag / Eyebrow", page: "/project/blueyard", elementType: "text", selector: ".project-eyebrow, [data-admin='project-eyebrow']", description: "Brutalist void & lightwells metadata" },
    { id: "project-statement", name: "Project Statement Headline", page: "/project/blueyard", elementType: "text", selector: "h2.font-editorial-serif, [data-admin='project-statement']", description: "Where concrete holds the silence" },
    { id: "project-image-main", name: "Primary Brutalist Plate", page: "/project/blueyard", elementType: "image", selector: ".project-main-plate img, [data-admin='project-primary'] img", description: "Central concrete lightwell plate" },
    { id: "project-image-sec", name: "Secondary Architectural Plate", page: "/project/blueyard", elementType: "image", selector: ".project-secondary-plate img, [data-admin='project-secondary'] img", description: "Shadow alignment detail plate" },
  ],
  "/portfolio": [
    { id: "portfolio-header", name: "Portfolio Header Title", page: "/portfolio", elementType: "text", selector: "h1, [data-admin='portfolio-title']", description: "Elena Voss — Visual Stories" },
    { id: "portfolio-hero-img", name: "Portfolio Hero Image", page: "/portfolio", elementType: "image", selector: ".portfolio-hero img, [data-admin='portfolio-hero'] img", description: "Featured editorial centerpiece portrait" },
    { id: "portfolio-cta", name: "Portfolio Inquire CTA", page: "/portfolio", elementType: "button", selector: "a[href*='contact'], button.portfolio-cta", description: "Inquiry & Commission button" },
    { id: "portfolio-gallery-sec", name: "Gallery Grid Section", page: "/portfolio", elementType: "section", selector: "section.gallery-grid, [data-admin='portfolio-gallery']", description: "Grid container for visual stories" },
  ],
  "/film": [
    { id: "film-hero-title", name: "Film Title", page: "/film", elementType: "text", selector: "h1, [data-admin='film-title']", description: "Innovative digital experiences studio" },
    { id: "film-hero-sub", name: "Film Tagline", page: "/film", elementType: "text", selector: ".film-subtitle, [data-admin='film-subtitle']", description: "The tactile nature of absence & spatial light" },
    { id: "film-hero-badge", name: "Experience Badge", page: "/film", elementType: "text", selector: ".film-badge, [data-admin='film-badge']", description: "Continuous Bas-Relief Experience" },
    { id: "film-cta-button", name: "See All Projects Button", page: "/film", elementType: "button", selector: "button.film-cta, [data-admin='film-cta']", description: "Selected projects scroll trigger" },
    { id: "film-showcase-sec", name: "Showcase Section", page: "/film", elementType: "section", selector: "#selected-projects, section.showcase", description: "Featured cinematic project showcase" },
  ],
  "/krishna": [
    { id: "krishna-brand", name: "Krishna Brand Title", page: "/krishna", elementType: "text", selector: "h1.krishna-brand, [data-admin='krishna-title'], h1", description: "KRISHNA master brand identity" },
    { id: "krishna-sub", name: "Krishna Subtitle", page: "/krishna", elementType: "text", selector: ".krishna-sub, [data-admin='krishna-subtitle']", description: "PHOTOGRAPHY & VISUAL ARCHIVE" },
    { id: "krishna-quote", name: "Archival Quote", page: "/krishna", elementType: "text", selector: ".krishna-quote, blockquote, [data-admin='krishna-quote']", description: "Visual archive for a lifetime quote" },
    { id: "krishna-inquire-cta", name: "Inquire Modal CTA", page: "/krishna", elementType: "button", selector: "button.krishna-inquire, [data-admin='krishna-inquire']", description: "Book Commission / Inquire button" },
    { id: "krishna-chapters-sec", name: "Chapters Showcase Section", page: "/krishna", elementType: "section", selector: "section#chapters, [data-admin='krishna-chapters']", description: "Wedding, portrait & milestone chapters" },
  ],
  "/contact-reviews": [
    { id: "cr-studio-title", name: "Atelier Studio Title", page: "/contact-reviews", elementType: "text", selector: "h1, [data-admin='contact-title']", description: "APEX LIGHT / STILL STUDIO ATELIER" },
    { id: "cr-studio-subline", name: "Atelier Subline", page: "/contact-reviews", elementType: "text", selector: ".atelier-subline, [data-admin='contact-subline']", description: "Kyoto & New York booking atelier" },
    { id: "cr-submit-button", name: "Submit Commission Button", page: "/contact-reviews", elementType: "button", selector: "button[type='submit'], .contact-submit-btn", description: "Submit inquiry form button" },
    { id: "cr-rate-cta", name: "Rate Studio Button", page: "/contact-reviews", elementType: "button", selector: "button.rate-studio-btn, [data-admin='rate-btn']", description: "Open client review rating modal" },
    { id: "cr-reviews-sec", name: "Reviews Slider Section", page: "/contact-reviews", elementType: "section", selector: "section#reviews, [data-admin='reviews-section']", description: "Verified client testimonials and ratings" },
  ],
};

export const ANIMATION_KEYFRAMES_CSS = `
@keyframes ss-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes ss-fade-out {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes ss-slide-up {
  0% { opacity: 0; transform: translateY(var(--ss-slide-dist, 30px)); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes ss-slide-down {
  0% { opacity: 0; transform: translateY(calc(var(--ss-slide-dist, 30px) * -1)); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes ss-slide-left {
  0% { opacity: 0; transform: translateX(var(--ss-slide-dist, 30px)); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes ss-slide-right {
  0% { opacity: 0; transform: translateX(calc(var(--ss-slide-dist, 30px) * -1)); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes ss-scale-in {
  0% { opacity: 0; transform: scale(0.92); }
  100% { opacity: 1; transform: scale(1); }
}

@keyframes ss-scale-out {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.08); }
}

@keyframes ss-reveal {
  0% { clip-path: inset(100% 0 0 0); opacity: 0.2; }
  100% { clip-path: inset(0 0 0 0); opacity: 1; }
}

@keyframes ss-blur-reveal {
  0% { opacity: 0; filter: blur(16px); transform: translateY(15px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
}

@keyframes ss-character-reveal {
  0% { opacity: 0; letter-spacing: 0.35em; filter: blur(6px); }
  100% { opacity: 1; letter-spacing: normal; filter: blur(0); }
}

@keyframes ss-ken-burns {
  0% { transform: scale(1); }
  50% { transform: scale(1.08) translate(-1%, -1%); }
  100% { transform: scale(1); }
}

@keyframes ss-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
`;

export function generatePublishedStylesCss(overrides: Record<string, VisualElementOverride>): string {
  if (!overrides || Object.keys(overrides).length === 0) {
    return "";
  }

  let css = ANIMATION_KEYFRAMES_CSS + "\n";

  for (const [key, item] of Object.entries(overrides)) {
    if (!item) continue;
    const selector = item.selector || `[data-admin-id="${item.id}"]`;

    // 1. Base Element Styles
    const s = item.styles || {};
    const rules: string[] = [];

    if (s.fontFamily) {
      if (s.fontFamily === "serif") rules.push("font-family: 'Cinzel', 'Playfair Display', Georgia, serif !important;");
      else if (s.fontFamily === "editorial") rules.push("font-family: 'Cormorant Garamond', 'Didot', 'Playfair Display', serif !important;");
      else if (s.fontFamily === "sans") rules.push("font-family: 'Neue Montreal', 'Inter', -apple-system, sans-serif !important;");
      else if (s.fontFamily === "mono") rules.push("font-family: 'JetBrains Mono', 'Courier New', monospace !important;");
      else if (s.fontFamily === "playfair") rules.push("font-family: 'Playfair Display', 'Newsreader', Georgia, serif !important;");
      else rules.push(`font-family: ${s.fontFamily} !important;`);
    }

    if (s.fontSize) rules.push(`font-size: ${s.fontSize} !important;`);
    if (s.fontWeight) rules.push(`font-weight: ${s.fontWeight} !important;`);
    if (s.letterSpacing) rules.push(`letter-spacing: ${s.letterSpacing} !important;`);
    if (s.lineHeight) rules.push(`line-height: ${s.lineHeight} !important;`);
    if (s.color) rules.push(`color: ${s.color} !important;`);
    if (s.opacity !== undefined) rules.push(`opacity: ${s.opacity} !important;`);
    if (s.textAlign) rules.push(`text-align: ${s.textAlign} !important;`);
    if (s.textTransform) rules.push(`text-transform: ${s.textTransform} !important;`);
    if (s.fontStyle) rules.push(`font-style: ${s.fontStyle} !important;`);
    if (s.textShadow) rules.push(`text-shadow: ${s.textShadow} !important;`);

    // Background & Container
    if (s.backgroundColor) rules.push(`background-color: ${s.backgroundColor} !important;`);
    if (s.backgroundImage) rules.push(`background-image: url('${s.backgroundImage}') !important; background-size: cover; background-position: center;`);
    if (s.borderWidth !== undefined && s.borderWidth > 0) {
      rules.push(`border: ${s.borderWidth}px ${s.borderStyle || 'solid'} ${s.borderColor || 'rgba(0,0,0,0.1)'} !important;`);
    }
    if (s.borderRadius !== undefined) rules.push(`border-radius: ${s.borderRadius}px !important;`);
    if (s.boxShadow) rules.push(`box-shadow: ${s.boxShadow} !important;`);
    if (s.paddingTop !== undefined) rules.push(`padding-top: ${s.paddingTop}px !important;`);
    if (s.paddingBottom !== undefined) rules.push(`padding-bottom: ${s.paddingBottom}px !important;`);
    if (s.paddingLeft !== undefined) rules.push(`padding-left: ${s.paddingLeft}px !important;`);
    if (s.paddingRight !== undefined) rules.push(`padding-right: ${s.paddingRight}px !important;`);
    if (s.width) rules.push(`width: ${s.width} !important;`);
    if (s.height) rules.push(`height: ${s.height} !important;`);

    // Image & Optical filters
    const filters: string[] = [];
    if (s.brightness !== undefined && s.brightness !== 100) filters.push(`brightness(${s.brightness}%)`);
    if (s.contrast !== undefined && s.contrast !== 100) filters.push(`contrast(${s.contrast}%)`);
    if (s.saturation !== undefined && s.saturation !== 100) filters.push(`saturate(${s.saturation}%)`);
    if (s.blur !== undefined && s.blur > 0) filters.push(`blur(${s.blur}px)`);
    if (s.grayscale) filters.push("grayscale(100%)");
    if (s.sepia !== undefined && s.sepia > 0) filters.push(`sepia(${s.sepia}%)`);

    if (filters.length > 0) {
      rules.push(`filter: ${filters.join(" ")} !important;`);
    }

    if (s.scale !== undefined && s.scale !== 1) {
      rules.push(`transform: scale(${s.scale}) !important;`);
    }
    if (s.objectFit) rules.push(`object-fit: ${s.objectFit} !important;`);
    if (s.objectPosition) rules.push(`object-position: ${s.objectPosition} !important;`);

    // Animation & Effect
    if (item.animation && item.animation.type !== "none") {
      const animName = `ss-${item.animation.type}`;
      const dur = item.animation.duration || 800;
      const delay = item.animation.delay || 0;
      const easing = item.animation.easing || "cubic-bezier(0.16, 1, 0.3, 1)";
      const count = item.animation.repeat === "infinite" ? "infinite" : item.animation.repeat === "alternate" ? "alternate infinite" : "1";
      
      rules.push(`animation: ${animName} ${dur}ms ${easing} ${delay}ms ${count} forwards !important;`);
      if (item.animation.startPosition) {
        rules.push(`--ss-slide-dist: ${item.animation.startPosition};`);
      }
    }

    if (rules.length > 0) {
      css += `${selector} {\n  ${rules.join("\n  ")}\n}\n`;
    }

    // 2. Hover Styles
    if (item.hoverStyles) {
      const h = item.hoverStyles;
      const hoverRules: string[] = [];
      if (h.color) hoverRules.push(`color: ${h.color} !important;`);
      if (h.backgroundColor) hoverRules.push(`background-color: ${h.backgroundColor} !important;`);
      if (h.scale && h.scale !== 1) hoverRules.push(`transform: scale(${h.scale}) !important;`);
      if (h.shadow) hoverRules.push(`box-shadow: ${h.shadow} !important;`);
      if (h.blur !== undefined && h.blur > 0) hoverRules.push(`filter: blur(${h.blur}px) !important;`);
      if (h.opacity !== undefined) hoverRules.push(`opacity: ${h.opacity} !important;`);
      if (h.duration) hoverRules.push(`transition: all ${h.duration}ms cubic-bezier(0.16, 1, 0.3, 1) !important;`);

      if (hoverRules.length > 0) {
        css += `${selector}:hover {\n  ${hoverRules.join("\n  ")}\n}\n`;
      }
    }
  }

  return css;
}
