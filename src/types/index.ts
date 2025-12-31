export interface ClinicApp {
  rating: number;
  reviewsCount: number;
  negativePercent: number;
  store: 'google_play' | 'app_store';
}

export interface FunctionalityDetails {
  yes: number;
  warning: number;
  no: number;
}

export interface ClinicIssues {
  functionality: string[];
  wcag: string[];
  flesch: string[];
  seo: string[];
}

export interface Clinic {
  id: string;
  name: string;
  city: string;
  country: 'ru' | 'us' | 'de';
  isBenchmark: boolean;
  functionality: number;
  functionalityDetails: FunctionalityDetails;
  flesch: number;
  wcag: number;
  seo: 'good' | 'warning' | 'bad';
  integrated: number;
  stars: number;
  issues: ClinicIssues;
  app: ClinicApp | null;
}

export interface ClinicsData {
  clinics: Clinic[];
  meta: {
    totalClinics: number;
    totalReviews: number;
    checklistItems: number;
    auditDate: string;
  };
}

export type MetricType = 'integrated' | 'functionality' | 'wcag' | 'flesch' | 'seo' | 'app';
export type FilterType = 'all' | 'ru' | 'benchmark';
export type SortType = 'integrated' | 'functionality' | 'wcag' | 'flesch' | 'name';
