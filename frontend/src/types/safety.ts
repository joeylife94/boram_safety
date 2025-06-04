export interface SafetyCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  image_count: number;
  created_at: string;
  updated_at?: string;
}

export interface SafetyItemsImage {
  id: number;
  category_id: number;
  file_name: string;
  file_path: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface SafetyCategoryCreate {
  name: string;
  code: string;
  description?: string;
}

export interface SafetyCategoryUpdate {
  name?: string;
  code?: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  featured: boolean;
} 