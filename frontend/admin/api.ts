import axios from 'axios';
import { logger } from '../src/lib/logger';

/**
 * 🔐 Admin API Client - 전체 CRUD 작업 (GET, POST, PUT, DELETE)
 * API Prefix: /api/admin/*
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response 인터셉터 (에러 처리)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error('Admin API Error:', error);
    return Promise.reject(error);
  }
);

// ============= 타입 정의 =============

export interface AdminCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image_path?: string;
  display_order: number;
  image_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProduct {
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

export interface CategoryCreateData {
  name: string;
  code: string;
  slug: string;
  description?: string;
  display_order: number;
}

export interface CategoryUpdateData {
  name?: string;
  code?: string;
  slug?: string;
  description?: string;
  display_order?: number;
}

export interface ProductCreateData {
  category_id: number;
  name: string;
  model_number?: string;
  price?: number;
  description?: string;
  specifications?: string;
  stock_status?: string;
  file_path?: string;
  display_order: number;
  is_featured: boolean;
}

export interface ProductUpdateData {
  category_id?: number;
  name?: string;
  model_number?: string;
  price?: number;
  description?: string;
  specifications?: string;
  stock_status?: string;
  file_path?: string;
  display_order?: number;
  is_featured?: boolean;
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  featured_products: number;
  total_images: number;
}

// ============= 대시보드 =============

export const getDashboard = async () => {
  const response = await adminApi.get('/dashboard');
  return response.data;
};

// ============= 카테고리 관리 =============

export const getCategories = async (): Promise<AdminCategory[]> => {
  const response = await adminApi.get('/categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<AdminCategory> => {
  const response = await adminApi.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: CategoryCreateData, imageFile?: File | null): Promise<AdminCategory> => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  formData.append('code', data.code);
  formData.append('slug', data.slug);
  if (data.description) formData.append('description', data.description);
  formData.append('display_order', data.display_order.toString());
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await adminApi.post('/categories', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateCategory = async (
  id: number, 
  data: CategoryUpdateData, 
  imageFile?: File | null
): Promise<AdminCategory> => {
  const formData = new FormData();
  
  if (data.name !== undefined) formData.append('name', data.name);
  if (data.code !== undefined) formData.append('code', data.code);
  if (data.slug !== undefined) formData.append('slug', data.slug);
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await adminApi.put(`/categories/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await adminApi.delete(`/categories/${id}`);
};

// ============= 제품 관리 =============

export const getProducts = async (params?: {
  skip?: number;
  limit?: number;
  category_code?: string;
  search?: string;
}): Promise<AdminProduct[]> => {
  const response = await adminApi.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: number): Promise<AdminProduct> => {
  const response = await adminApi.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductCreateData, imageFiles?: FileList | null): Promise<AdminProduct> => {
  const formData = new FormData();
  
  // 기본 데이터 추가
  Object.keys(data).forEach(key => {
    const value = data[key as keyof ProductCreateData];
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  // 이미지 파일들 추가
  if (imageFiles && imageFiles.length > 0) {
    Array.from(imageFiles).forEach((file, index) => {
      formData.append(`images`, file);
    });
  }

  const response = await adminApi.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateProduct = async (
  id: number, 
  data: ProductUpdateData, 
  imageFiles?: FileList | null
): Promise<AdminProduct> => {
  const formData = new FormData();
  
  // 업데이트할 데이터만 추가
  Object.keys(data).forEach(key => {
    const value = data[key as keyof ProductUpdateData];
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });
  
  // 이미지 파일들 추가
  if (imageFiles && imageFiles.length > 0) {
    Array.from(imageFiles).forEach((file, index) => {
      formData.append(`images`, file);
    });
  }

  const response = await adminApi.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await adminApi.delete(`/products/${id}`);
};

// ============= 이미지 업로드 =============

export const uploadImage = async (file: File): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await adminApi.post('/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============= 상태 확인 =============

export const checkAdminHealth = async () => {
  const response = await adminApi.get('/health');
  return response.data;
}; 