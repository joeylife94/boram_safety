import axios from 'axios';

/**
 * ✅ Public API Client - 읽기 전용 (GET만 사용)
 * API Prefix: /api/*
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response 인터셉터 (에러 처리)
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Public API Error:', error);
    return Promise.reject(error);
  }
);

// ============= 타입 정의 =============

export interface PublicCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  image_path?: string;
  display_order: number;
  image_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PublicProduct {
  id: number;
  category_id: number;
  category_code?: string;
  name: string;
  model_number?: string;
  price?: number;
  description?: string;
  specifications?: string;
  stock_status?: string;
  file_name?: string;
  file_path?: string;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ============= API 함수들 =============

/**
 * 카테고리 목록 조회
 */
export const getCategories = async (): Promise<PublicCategory[]> => {
  const response = await publicApi.get('/categories');
  return response.data;
};

/**
 * 카테고리 코드로 조회
 */
export const getCategoryByCode = async (categoryCode: string): Promise<PublicCategory> => {
  const response = await publicApi.get(`/categories/${categoryCode}`);
  return response.data;
};

/**
 * 제품 목록 조회
 */
export const getProducts = async (params?: {
  skip?: number;
  limit?: number;
  category_code?: string;
  search?: string;
}): Promise<PublicProduct[]> => {
  const response = await publicApi.get('/products', { params });
  return response.data;
};

/**
 * 카테고리별 제품 조회
 */
export const getProductsByCategory = async (
  categoryCode: string,
  params?: { skip?: number; limit?: number }
): Promise<PublicProduct[]> => {
  const response = await publicApi.get(`/products/by-category/${categoryCode}`, { params });
  return response.data;
};

/**
 * 제품 검색
 */
export const searchProducts = async (
  query: string,
  params?: { skip?: number; limit?: number }
): Promise<PublicProduct[]> => {
  const response = await publicApi.get('/products/search', { 
    params: { q: query, ...params } 
  });
  return response.data;
};

/**
 * 제품 상세 조회
 */
export const getProductDetail = async (productId: number): Promise<PublicProduct> => {
  const response = await publicApi.get(`/products/${productId}`);
  return response.data;
};

/**
 * 검색 제안
 */
export const getSearchSuggestions = async (query: string, limit: number = 5) => {
  const response = await publicApi.get('/search/suggestions', { 
    params: { q: query, limit } 
  });
  return response.data;
};

/**
 * Public API 상태 확인
 */
export const checkHealth = async () => {
  const response = await publicApi.get('/health');
  return response.data;
}; 