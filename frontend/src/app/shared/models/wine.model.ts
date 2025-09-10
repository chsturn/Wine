export interface OakAging {
  oakType: string | null;
  durationMonths: number | null;
}

export interface GeoLocation {
  type?: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Rating {
  userId: string;
  rating: number;
  _id: string;
}

export interface Wine {
  _id?: string;
  name: string;
  year: number;
  winery: string;
  region: string;
  grapeVariety: string;
  aroma: string[];
  taste: string[];
  oakAging?: OakAging;
  foodPairing: string[];
  alcoholPercentage: number;
  description: string;
  price?: number | null;
  location?: GeoLocation;
  averageRating?: number;
  ratingsCount?: number;
  userRating?: number;
  createdAt?: Date;
}
