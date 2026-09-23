import { CategoryKey } from './data/portfolioData';

export type SculpturalThemeType =
  | 'silk-waves'        // Flowing draped fabric ripples & silk folds (Sec 1 of Image 2)
  | 'fluted-columns'    // Monumental fluted stone columns flanking the space (Sec 2 of Image 2)
  | 'floating-polyhedra'// Floating 3D geometric crystals, toruses & stone spheres (Sec 3 of Image 2)
  | 'stone-plinths'     // Cantilevered brutalist stone plinths & stepped slabs (Sec 4 of Image 2)
  | 'curved-niche';     // Architectural curved dome, alcove & soft niche (Sec 5 of Image 2)

export interface CategoryThemeConfig {
  theme: SculpturalThemeType;
  accentTitle: string;
  materialTone: string;
  shadowIntensity: number;
}

export const CATEGORY_THEMES: Record<CategoryKey, CategoryThemeConfig> = {
  'wedding': {
    theme: 'silk-waves',
    accentTitle: 'Draped Silk Waves',
    materialTone: '#EAE6DF',
    shadowIntensity: 0.18,
  },
  'engagement': {
    theme: 'floating-polyhedra',
    accentTitle: 'Floating Geometric Polyhedra',
    materialTone: '#E8E5DD',
    shadowIntensity: 0.22,
  },
  'pre-wedding': {
    theme: 'stone-plinths',
    accentTitle: 'Cantilevered Stone Plinths',
    materialTone: '#E6E3DB',
    shadowIntensity: 0.25,
  },
  'portraits': {
    theme: 'fluted-columns',
    accentTitle: 'Fluted Architectural Columns',
    materialTone: '#EBE8E1',
    shadowIntensity: 0.28,
  },
  'newborn-baby': {
    theme: 'floating-polyhedra',
    accentTitle: 'Floating Soft Spheres & Crystals',
    materialTone: '#ECEAE4',
    shadowIntensity: 0.16,
  },
  'maternity': {
    theme: 'curved-niche',
    accentTitle: 'Sculptural Plaster Sanctuary',
    materialTone: '#E8E5DF',
    shadowIntensity: 0.2,
  },
  'pre-birthday': {
    theme: 'stone-plinths',
    accentTitle: 'Stepped Architectural Plinths',
    materialTone: '#E7E4DC',
    shadowIntensity: 0.22,
  },
  'saree-ceremony': {
    theme: 'silk-waves',
    accentTitle: 'Woven Silk & Architectural Pleats',
    materialTone: '#E9E4DC',
    shadowIntensity: 0.24,
  },
};
