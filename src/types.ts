export type TabType = 'Buy' | 'Sell' | 'Rent' | 'Plots' | 'PG/Co-Living';

export interface PropertyListing {
  id: string;
  title: string;
  location: string;
  price: string;
  type: TabType;
  bhk?: string;
  area: string;
  features: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  relationship: string;
  avatar: string;
  text: string;
}

export interface CityTrendData {
  city: string;
  averagePrice: string;
  yearOverYearGrowth: string;
  connectivityRating: number;
  safetyRating: number;
  greenSpaceRating: number;
}
