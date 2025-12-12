export type LifespanCategory = "Less than 1 year" | "1-2 years" | "2-5 years" | "5-10 years" | "10+ years";

export type ProductType = "Apps" | "Services" | "Hardware";

export type ProductCategory = 
  | "Social Media" 
  | "Communication" 
  | "Productivity" 
  | "Developer Tools" 
  | "Cloud Services" 
  | "Physical Devices" 
  | "Media & Entertainment" 
  | "Search & Discovery" 
  | "Mobile Apps" 
  | "Infrastructure" 
  | "Education" 
  | "Gaming";

export type ShutdownReason = 
  | "Competition" 
  | "Bad Market Fit" 
  | "Bad Timing" 
  | "Strategic Misalignment" 
  | "Bad Business Model" 
  | "Acquisition Flu" 
  | "Legal Challenges";

export interface Product {
  // Product Identity
  name: string;
  identifier: string;
  description: string;
  link?: string[];
  
  // Temporal Fields
  dateOpen: string; 
  dateClose: string; 
  lifespanMonths: number;
  lifespanCategory: LifespanCategory;
  
  // Product Classification
  type?: string; // "app" | "service" | "hardware" 
  productType?: ProductType;
  productCategory: ProductCategory;
  
  // Discontinuation Analysis
  shutdownReason: ShutdownReason;
  shutdownReasonDetail?: string;
  
  // Impact Assessment
  notableFeatures?: string[];
}

export interface FilterState {
  lifespanCategories: LifespanCategory[];
  productTypes: ProductType[];
  productCategories: ProductCategory[];
  shutdownReasons: ShutdownReason[];
  searchQuery: string;
}

export type SortOption = 
  | "dateClose-desc" 
  | "dateClose-asc" 
  | "lifespan-desc" 
  | "lifespan-asc" 
  | "name-asc" 
  | "name-desc";
