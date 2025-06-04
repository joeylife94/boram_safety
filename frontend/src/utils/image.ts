const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';

/**
 * 이미지 경로를 frontend public 디렉토리의 URL로 변환
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
  
  // backend 상대 경로 형식인 경우 frontend public 경로로 변환
  if (imagePath.startsWith('/static/images/')) {
    return imagePath.replace('/static', '');
  }
  
  // 이미 frontend 형식인 경우
  if (imagePath.startsWith('/images/')) {
    return imagePath;
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
 * 제품 이미지 URL 가져오기
 * @param product 제품 객체
 * @returns 제품 이미지 URL
 */
export function getProductImageUrl(product: { file_path?: string; name?: string }): string {
  if (!product.file_path) {
    return createPlaceholderImage('No Product Image');
  }
  return getImageUrl(product.file_path);
}

/**
 * 카테고리 이미지 URL 가져오기
 * @param category 카테고리 객체
 * @returns 카테고리 이미지 URL
 */
export function getCategoryImageUrl(category: { image?: string; name?: string }): string {
  if (!category.image) {
    return createPlaceholderImage(category.name || 'No Category Image');
  }
  return getImageUrl(category.image);
} 