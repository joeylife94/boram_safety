import axios from 'axios';
import { logger } from '@/lib/logger';

// ✅ Public API - /api/* (GET만 허용)
const API_BASE_URL = 'http://localhost:8000/api';

// Public API 클라이언트 설정 (읽기 전용)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 (에러 처리)
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('Public API Error:', error);
    return Promise.reject(error);
  }
);

// ================== 타입 정의 ==================
export interface PublicCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  display_order: number;
  image_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface PublicProduct {
  id: number;
  category_id: number;
  category_code: string;
  name: string;
  model_number: string;
  price?: number;
  description?: string;
  specifications?: string;
  stock_status: string;
  file_name: string;
  file_path: string;
  display_order: number;
  is_featured: number;
  created_at: string;
  updated_at?: string;
}

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
  products: PublicProduct[];
  total: number;
  search_params: SearchParams;
}

export interface SearchSuggestion {
  id: number;
  name: string;
  category_code: string;
  category_name: string;
  image_path: string;
  url: string;
}

// ================== 카테고리 API (읽기 전용) ==================
export const getCategories = async (): Promise<PublicCategory[]> => {
  const response = await publicApi.get('/categories');
  return response.data;
};

export const getCategory = async (categoryCode: string): Promise<PublicCategory> => {
  const response = await publicApi.get(`/categories/${categoryCode}`);
  return response.data;
};

export const getCategoryProducts = async (
  categoryCode: string,
  skip: number = 0,
  limit: number = 100,
  featuredOnly: boolean = false
): Promise<PublicProduct[]> => {
  const response = await publicApi.get(`/categories/${categoryCode}/products`, {
    params: { skip, limit, featured_only: featuredOnly }
  });
  return response.data;
};

// ================== 제품 API (읽기 전용) ==================
export const getProduct = async (productId: number): Promise<PublicProduct> => {
  const response = await publicApi.get(`/products/${productId}`);
  return response.data;
};

export const getProducts = async (params: {
  category_code?: string;
  featured_only?: boolean;
  skip?: number;
  limit?: number;
} = {}): Promise<PublicProduct[]> => {
  const response = await publicApi.get('/products', { params });
  return response.data;
};

// ================== 검색 API ==================
export const searchProducts = async (params: SearchParams): Promise<SearchResult> => {
  const response = await publicApi.get('/search', { params });
  return response.data;
};

export const getSearchSuggestions = async (query: string, limit: number = 5): Promise<SearchSuggestion[]> => {
  const response = await publicApi.get('/search/suggestions', {
    params: { query, limit }
  });
  return response.data.suggestions;
};

// ================== 건강 체크 ==================
export const healthCheck = async (): Promise<{ status: string }> => {
  const response = await publicApi.get('/health');
  return response.data;
}; 