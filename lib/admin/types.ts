export interface TypographyConfig {
  fontFamily: 'serif' | 'sans' | 'mono' | 'editorial' | 'playfair';
  fontWeight: '300' | '400' | '500' | '600' | '700';
  fontSizeScale: number; // 0.7 to 2.2 (default 1.0)
  letterSpacing: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest';
  textTransform: 'uppercase' | 'none' | 'capitalize' | 'lowercase';
  textEffect: 'none' | 'subtle' | 'cinematic' | 'glow' | 'deep';
  color?: string; // hex
}

export interface ImageCustomStyleConfig {
  url: string;
  scale: number; // 0.8 to 1.6 (default 1.0)
  aspectRatio: 'natural' | '16/9' | '4/5' | '3/4' | '1/1' | '21/9';
  borderRadius: number; // 0 to 32px
  contrast: number; // 50 to 200 (default 100)
  brightness: number; // 50 to 180 (default 100)
  saturation: number; // 0 to 200 (default 100)
  blur: number; // 0 to 12 (default 0)
  sepia: number; // 0 to 100 (default 0)
  grayscale: boolean;
}

export interface GlobalEffectsConfig {
  grainOpacity: number; // 0 to 0.2 (default 0.035)
  grainSpeed: number; // 1 to 24 fps (default 12)
  contrast: number; // 80 to 140 (default 105)
  brightness: number; // 80 to 130 (default 100)
  saturation: number; // 0 to 150 (default 100)
  sepia: number; // 0 to 60 (default 0)
  vignetteIntensity: number; // 0 to 0.5 (default 0.15)
  fogOpacity: number; // 0 to 0.08 (default 0.015)
  glassBlur: number; // 4 to 32 (default 12)
  accentColor: string; // hex
  ambientTint: string; // hex or rgba
}

export interface HomeScene01HeroConfig {
  monographTitle: string; // "DREAMSCAPES"
  volumeTag: string; // "DREAMSCAPES MONOGRAPH VOL. 01"
  publishedDate: string; // "EXHIBITION PUBLISHED SPRING 2026"
  locationArchive: string; // "KYOTO — REYKJAVIK — TOKYO"
  archiveLabel: string; // "STILL STUDIO ARCHIVE"
  headlineSecondary: string; // "ARCHITECTURAL MONOGRAPHS & ATMOSPHERIC LIGHT PHENOMENA"
  plate01Title: string; // "PLATE 01.0 — KYOTO MONOLITH"
  plate01Camera: string; // "HASSELBLAD 120MM"
  plate01Image: string; // url
  plate02Title: string; // "Concrete Sanctuary Void"
  plate02Location: string; // "TOKYO, JAPAN — 2025"
  plate02Image: string; // url
  ctaButtonText: string; // "CONTACT & REVIEW"
  ctaButtonLink: string; // "/contact-reviews"
  scrollPrompt: string; // "SCROLL TO DISCOVER"
  titleTypography?: TypographyConfig;
  headlineTypography?: TypographyConfig;
  plate01Style?: Partial<ImageCustomStyleConfig>;
  plate02Style?: Partial<ImageCustomStyleConfig>;
}

export interface HomeScene02CuratorialConfig {
  eyebrowNumber: string; // "01"
  eyebrowTitle: string; // "CURATORIAL OVERVIEW"
  eyebrowSub: string; // "DREAMSCAPES ARCHIVE · STILL STUDIO"
  headlineWords: string[]; // ["THE", "SILENCE", "OF", "MONUMENTAL", "FORMS"]
  paragraph1: string;
  paragraph2: string;
  chronology: string; // "2024 — 2026"
  medium: string; // "ANALOG & DIGITAL"
  fieldStations: string; // "KYOTO · REYKJAVIK"
  curator: string; // "STILL STUDIO"
  headlineTypography?: TypographyConfig;
  plateStyle?: Partial<ImageCustomStyleConfig>;
}

export interface HomeScene07NextConfig {
  volumeTag: string; // "MONOGRAPH VOL. 02"
  title: string; // "BLUEYARD"
  launchDate: string; // "OCTOBER 2026"
  teaserParagraph: string;
  bannerImage: string;
  ctaText: string; // "EXPLORE CASE STUDY"
  titleTypography?: TypographyConfig;
  bannerStyle?: Partial<ImageCustomStyleConfig>;
}

export interface HomeConfig {
  hero: HomeScene01HeroConfig;
  curatorial: HomeScene02CuratorialConfig;
  nextMonograph: HomeScene07NextConfig;
}

export interface WorkConfig {
  heroTitleLine1: string; // "DREAM"
  heroTitleLine2: string; // "SCAPES"
  heroSlash: string; // "/"
  overviewTag: string; // "PROJECT OVERVIEW"
  overviewDescription: string;
  volumeTag: string; // "STILL STUDIO © 2026"
  volumeTitle: string; // "VOLUME ONE"
  heroImage: string; // featured plate
  heroPlateTitle: string; // "KYOTO REYKJAVIK DUALITY"
  titleTypography?: TypographyConfig;
  heroImageStyle?: Partial<ImageCustomStyleConfig>;
}

export interface ProjectConfig {
  title: string; // "BLUEYARD"
  eyebrow: string; // "BRUTALIST VOID & LIGHTWELLS"
  locationYear: string; // "TOKYO, JAPAN — 2025"
  statementLine1: string; // "WHERE CONCRETE"
  statementLine2: string; // "HOLDS THE SILENCE."
  narrativeBody: string;
  primaryImage: string;
  secondaryImage: string;
  titleTypography?: TypographyConfig;
  primaryImageStyle?: Partial<ImageCustomStyleConfig>;
  secondaryImageStyle?: Partial<ImageCustomStyleConfig>;
}

export interface FilmHeroConfig {
  topTag: string; // "Architectural Reliefs"
  topSub: string; // "Creative Direction & WebGL"
  subtitleItalic: string; // "The tactile nature of absence & spatial light."
  badgeText: string; // "Continuous Bas-Relief Experience"
  mainTitleLine1: string; // "Innovative digital"
  mainTitleLine2: string; // "experiences studio"
  bottomNote: string; // "Selected Projects & Sound Design"
  heroPosterImage: string; // url
  titleTypography?: TypographyConfig;
  posterStyle?: Partial<ImageCustomStyleConfig>;
}

export interface FilmProjectItem {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  tagline: string;
  coverImage: string;
  accentColor: string;
  featured: boolean;
  coverStyle?: Partial<ImageCustomStyleConfig>;
}

export interface FilmConfig {
  hero: FilmHeroConfig;
  projects: FilmProjectItem[];
}

export interface KrishnaCategoryItem {
  key: string;
  label: string;
  num: string;
  subtitle: string;
  description: string;
  quote?: string;
  heroImage?: string;
  heroImageStyle?: Partial<ImageCustomStyleConfig>;
}

export interface KrishnaConfig {
  brandTitle: string; // "KRISHNA"
  brandSubtitle: string; // "PHOTOGRAPHY & VISUAL ARCHIVE"
  quote: string;
  titleTypography?: TypographyConfig;
  categories: KrishnaCategoryItem[];
}

export interface ContactCategoryItem {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  popular?: boolean;
}

export interface ContactAddonItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ClientReviewItem {
  id: string;
  clientName: string;
  roleOrTag: string;
  category: string;
  overallRating: number;
  title: string;
  reviewText: string;
  favoriteDeliverable?: string;
  date: string;
  verifiedClient: boolean;
  helpfulCount: number;
}

export interface ContactReviewsConfig {
  studioName: string; // "APEX LIGHT"
  studioSubline: string; // "STUDIO ATELIER"
  email: string; // "contact@stillstudio.atelier"
  phone: string; // "+1 (800) 492-7489"
  address: string; // "744 Atelier Boulevard, Kyoto & NY"
  location?: string;
  atelierNote?: string;
  headline?: string;
  description?: string;
  hours: string; // "Mon–Fri 09:00 — 18:00 JST"
  titleTypography?: TypographyConfig;
  categories: ContactCategoryItem[];
  addons: ContactAddonItem[];
  reviews: ClientReviewItem[];
}

export interface SiteConfig {
  effects: GlobalEffectsConfig;
  home: HomeConfig;
  work: WorkConfig;
  project: ProjectConfig;
  film: FilmConfig;
  krishna: KrishnaConfig;
  contactReviews: ContactReviewsConfig;
}
