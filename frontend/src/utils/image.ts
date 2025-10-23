const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

/**
 * 새로운 구조에 맞는 이미지 처리 유틸리티
 * 공용 리소스: /images/*
 */

/**
 * 이미지 경로를 공용 리소스 디렉토리의 URL로 변환
 * @param imagePath 이미지 경로 (/static/images/... 또는 기타)
 * @returns 전체 이미지 URL (/images/...)
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return createPlaceholderImage('No Image');
  }
  
  // 이미 전체 URL인 경우 그대로 반환
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // 새로운 images 구조인 경우
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // 기존 /static/images/ 경로인 경우 새로운 구조로 변환 (핵심 수정!)
  if (imagePath.startsWith('/static/images/')) {
    return imagePath.replace('/static/images/', '/images/');
  }
  
  // 기존 public-assets 경로인 경우 새로운 구조로 변환
  if (imagePath.startsWith('/public-assets/')) {
    return imagePath.replace('/public-assets/product-images/', '/images/');
  }
  
  // 상대 경로인 경우 공용 리소스로 변환
  if (!imagePath.startsWith('/')) {
    return `/images/${imagePath}`;
  }
  
  // 다른 형식의 경로인 경우 기본 placeholder 반환
  return createPlaceholderImage('No Image');
}

/**
 * SVG 기반 placeholder 이미지 생성
 */
function createPlaceholderImage(text: string, width: number = 400, height: number = 300): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#666666" font-family="Arial, sans-serif" font-size="16">${text}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * 여러 이미지 경로에서 첫 번째 이미지(대표 이미지) 추출
 * @param imagePath JSON 배열 또는 단일 경로
 * @returns 첫 번째 이미지 경로
 */
export function getMainImagePath(imagePath: string | undefined | null): string | null {
  if (!imagePath) return null;
  
  try {
    // JSON 배열로 저장된 경우
    const paths = JSON.parse(imagePath);
    if (Array.isArray(paths) && paths.length > 0) {
      return paths[0];
    }
    // JSON이지만 배열이 아닌 경우 (단일 경로)
    return String(paths);
  } catch {
    // JSON 파싱 실패시 단일 경로로 처리
    return imagePath;
  }
}

// 제품 이미지 타입 정의
export interface ProductWithImage {
  file_path?: string;
  name?: string;
}

/**
 * 제품 이미지 URL 가져오기 (여러 이미지 지원)
 * @param product 제품 객체
 * @returns 제품 대표 이미지 URL
 */
export function getProductImageUrl(product: ProductWithImage): string {
  if (!product.file_path) {
    return createPlaceholderImage('No Product Image');
  }
  
  // 여러 이미지 중 첫 번째 이미지(대표 이미지) 추출
  const mainImagePath = getMainImagePath(product.file_path);
  if (!mainImagePath) {
    return createPlaceholderImage('No Product Image');
  }
  
  return getImageUrl(mainImagePath);
}

// 카테고리 이미지 타입 정의
export interface CategoryWithImage {
  image?: string;
  image_path?: string;
  name?: string;
  code?: string;
}

/**
 * 카테고리 이미지 URL 가져오기 (Public용)
 * @param category 카테고리 객체
 * @returns 카테고리 이미지 URL
 */
export function getCategoryImageUrl(category: CategoryWithImage): string {
  // 카테고리 코드가 있으면 해당 이미지 파일을 찾기
  if (category.code) {
    return `/images/categories/${category.code}.jpg`;
  }
  
  const imagePath = category.image || category.image_path;
  if (!imagePath) {
    return createPlaceholderImage(category.name || 'No Category Image');
  }
  return getImageUrl(imagePath);
}

/**
 * 관리자용 카테고리 이미지 URL 가져오기
 * @param category 카테고리 객체
 * @returns 카테고리 이미지 URL
 */
export function getAdminCategoryImageUrl(category: CategoryWithImage): string {
  // 카테고리 코드가 있으면 해당 이미지 파일을 찾기
  if (category.code) {
    return `/images/categories/${category.code}.jpg`;
  }
  
  if (!category.image) {
    return createPlaceholderImage(category.name || 'No Category Image');
  }
  return getImageUrl(category.image);
} 