import { Product, SafetyProduct, SafetyCategory } from '@/types/product';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 카테고리 관련 API
export async function getCategories(): Promise<SafetyCategory[]> {
  const response = await fetch(`${API_BASE_URL}/api/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function getCategoryByCode(code: string): Promise<SafetyCategory> {
  const response = await fetch(`${API_BASE_URL}/api/categories/${code}`);
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
}

// 제품 관련 API
export async function getProductsByCategory(categoryCode: string): Promise<SafetyProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/by-category/${categoryCode}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getProductById(id: number): Promise<SafetyProduct> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}

export async function getAllProducts(): Promise<SafetyProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getFeaturedProducts(): Promise<SafetyProduct[]> {
  const response = await fetch(`${API_BASE_URL}/api/products?featured_only=true`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured products');
  }
  return response.json();
}

// Legacy functions for backward compatibility
export async function getProductsByCategory_old(category: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products?category=${category}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

// 검색 관련 API 함수들
export interface SearchParams {
  query?: string;
  category_code?: string;
  min_price?: number;
  max_price?: number;
  stock_status?: string;
  is_featured?: boolean;
  sort_by?: 'name' | 'price_asc' | 'price_desc' | 'featured';
  limit?: number;
}

export interface SearchResult {
  products: SafetyProduct[];
  total_count: number;
  search_params: SearchParams;
}

export async function searchProducts(params: SearchParams): Promise<SearchResult> {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.append('query', params.query);
  if (params.category_code) searchParams.append('category_code', params.category_code);
  if (params.min_price !== undefined) searchParams.append('min_price', params.min_price.toString());
  if (params.max_price !== undefined) searchParams.append('max_price', params.max_price.toString());
  if (params.stock_status) searchParams.append('stock_status', params.stock_status);
  if (params.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString());
  if (params.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE_URL}/api/search?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  return response.json();
}

export interface SearchSuggestion {
  id: number;
  name: string;
  category_code: string;
  file_path: string;
  url: string;
}

export interface SearchSuggestionsResult {
  suggestions: SearchSuggestion[];
}

export async function getSearchSuggestions(query: string, limit: number = 5): Promise<SearchSuggestionsResult> {
  const searchParams = new URLSearchParams({
    query,
    limit: limit.toString()
  });

  const response = await fetch(`${API_BASE_URL}/api/search/suggestions?${searchParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to get search suggestions');
  }
  return response.json();
} 