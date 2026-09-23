export interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  tagline: string;
  description: string;
  coverImage: string;
  detailImages: string[];
  awards: string[];
  role: string;
  deliverables: string[];
  accentColor: string;
  stats?: { label: string; value: string }[];
  featured?: boolean;
}

export interface StudioAward {
  year: string;
  title: string;
  organization: string;
  project: string;
}

export interface ScrollState {
  progress: number; // 0 to 1
  velocity: number;
  direction: number;
  scrollY: number;
}
