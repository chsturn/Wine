export interface OakAging {
  oakType: string | null;
  durationMonths: number | null;
}

export interface Wine {
  _id?: string; // Mongoose adds _id automatically
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
  createdAt?: Date;
}
