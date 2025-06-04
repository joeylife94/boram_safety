export interface SafetyCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  image_path?: string;
  display_order: number;
  image_count: number;
  created_at: string;
  updated_at?: string;
}

export interface SafetyProduct {
  id: number;
  category_id: number;
  category_code: string;
  name: string;
  model_number?: string;
  price?: number;
  description?: string;
  specifications?: string; // JSON string
  stock_status: string;
  file_name: string;
  file_path: string;
  display_order: number;
  is_featured: number;
  created_at: string;
  updated_at?: string;
}

// Legacy interface for backward compatibility
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  specifications: {
    [key: string]: string;
  };
  stock: number;
  createdAt: string;
  updatedAt: string;
} 