import axios from 'axios';

// 🔐 Admin API - /api/admin/* (모든 HTTP Methods 허용)
const API_BASE_URL = 'http://localhost:8000/api/admin';

// Admin API 클라이언트 설정
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 (에러 처리)
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Admin API Error:', error);
    return Promise.reject(error);
  }
);

// ================== 대시보드 ==================
export interface DashboardStats {
  total_products: number;
  total_categories: number;
  featured_products: number;
  total_images: number;
}

export interface DashboardResponse {
  message: string;
  status: string;
  stats: DashboardStats;
}

export const getDashboard = async (): Promise<DashboardResponse> => {
  const response = await adminApi.get('/dashboard');
  return response.data;
};

// ================== 제품 관리 ==================
export interface Product {
  id: number;
  name: string;
  model_number: string;
  category_id: number;
  category_code: string;
  category_name: string;
  description?: string;
  specifications?: string;
  price?: number;
  is_featured: number;
  file_path?: string;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ProductCreateData {
  name: string;
  model_number: string;
  category_id: number;
  description?: string;
  specifications?: string;
  price?: number;
  is_featured: number;
  display_order: number;
}

export interface ProductUpdateData {
  name?: string;
  model_number?: string;
  category_id?: number;
  description?: string;
  specifications?: string;
  price?: number;
  is_featured?: number;
  display_order?: number;
}

export interface ProductListParams {
  skip?: number;
  limit?: number;
  category_code?: string;
  search?: string;
}

export const getProducts = async (params: ProductListParams = {}): Promise<Product[]> => {
  const response = await adminApi.get('/products', { params });
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await adminApi.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductCreateData, imageFiles?: File[]): Promise<Product> => {
  const formData = new FormData();
  
  // Add form fields
  formData.append('name', data.name);
  formData.append('model_number', data.model_number);
  formData.append('category_id', data.category_id.toString());
  if (data.description) formData.append('description', data.description);
  if (data.specifications) formData.append('specifications', data.specifications);
  if (data.price !== undefined) formData.append('price', data.price.toString());
  formData.append('is_featured', data.is_featured.toString());
  formData.append('display_order', data.display_order.toString());
  
  // Add image files if provided
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
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
  imageFiles?: File[], 
  existingImages?: string[]
): Promise<Product> => {
  const formData = new FormData();
  
  // Add only the fields that are being updated
  if (data.name !== undefined) formData.append('name', data.name);
  if (data.model_number !== undefined) formData.append('model_number', data.model_number);
  if (data.category_id !== undefined) formData.append('category_id', data.category_id.toString());
  if (data.description !== undefined) formData.append('description', data.description);
  if (data.specifications !== undefined) formData.append('specifications', data.specifications);
  if (data.price !== undefined) formData.append('price', data.price.toString());
  if (data.is_featured !== undefined) formData.append('is_featured', data.is_featured.toString());
  if (data.display_order !== undefined) formData.append('display_order', data.display_order.toString());
  
  // Add existing images that should be kept (with their order)
  if (existingImages) {
    formData.append('existing_images', JSON.stringify(existingImages));
  }
  
  // Add new image files if provided
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
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

// ================== 카테고리 관리 ==================
export interface Category {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  display_order: number;
  image_count?: number;
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

export const getCategories = async (): Promise<Category[]> => {
  const response = await adminApi.get('/categories');
  return response.data;
};

export const getCategory = async (id: number): Promise<Category> => {
  const response = await adminApi.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: CategoryCreateData, imageFile?: File | null): Promise<Category> => {
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
): Promise<Category> => {
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

// ================== 이미지 업로드 ==================
export interface ImageUploadResponse {
  url: string;
  filename: string;
}

export const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await adminApi.post('/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// ================== 헬스 체크 ==================
export const adminHealthCheck = async (): Promise<{ status: string; role: string }> => {
  const response = await adminApi.get('/health');
  return response.data;
}; 