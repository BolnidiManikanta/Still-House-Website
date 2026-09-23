export type ShootCategory =
  | 'portrait'
  | 'wedding'
  | 'editorial'
  | 'commercial'
  | 'event'
  | 'drone'
  | 'architecture';

export interface CategoryInfo {
  id: ShootCategory;
  name: string;
  tagline: string;
  basePrice: number;
  popular?: boolean;
}

export interface ContactAddon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  category: ShootCategory;
  shootDate: string;
  timePreference: 'morning' | 'golden_hour' | 'afternoon' | 'full_day';
  locationType: 'studio' | 'outdoor' | 'destination' | 'client_space';
  locationDetails: string;
  durationHours: number;
  addons: string[];
  visionNotes: string;
  inspirationLink: string;
}

export interface PhotographyRating {
  id: string;
  clientName: string;
  roleOrTag: string;
  category: ShootCategory;
  overallRating: number;
  photoQualityRating: number;
  lightingCompositionRating: number;
  professionalismRating: number;
  turnaroundTimeRating: number;
  title: string;
  reviewText: string;
  favoriteDeliverable?: string;
  wouldRecommend: boolean;
  date: string;
  verifiedClient: boolean;
  helpfulCount: number;
}
