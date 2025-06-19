import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getProduct, updateProduct, getCategories, Category, ProductUpdateData } from '@/api/admin';
import { getImageUrl } from '@/utils/image';

interface ProductForm {
  name: string;
  model: string;
  category_id: string;
  description: string;
  specifications: string;
  price: string;
  manufacturer: string;
  is_featured: boolean;
  display_order: string;
}

interface ImagePreview {
  id: string;
  file?: File;
  url: string;
  isNew: boolean;
}

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const productId = Number(id);

  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    model: '',
    category_id: '',
    description: '',
    specifications: '',
    price: '',
    manufacturer: '',
    is_featured: false,
    display_order: '0'
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  // utils의 getImageUrl 함수를 사용

  useEffect(() => {
    if (productId && !isNaN(productId)) {
      fetchData();
    }
  }, [productId]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      // 제품 정보와 카테고리를 병렬로 가져오기
      const [product, categoriesData] = await Promise.all([
        getProduct(productId),
        getCategories()
      ]);
      
      // 폼 데이터 설정
      setFormData({
        name: product.name,
        model: product.model_number,
        category_id: product.category_id.toString(),
        description: product.description || '',
        specifications: product.specifications || '',
        price: product.price?.toString() || '',
        manufacturer: '',
        is_featured: product.is_featured === 1,
        display_order: product.display_order.toString()
      });
      
      setCategories(categoriesData);
      
      // 현재 이미지 설정 (여러 이미지 지원)
      if (product.file_path) {
        try {
          // JSON 배열로 저장된 경우
          const imagePaths = JSON.parse(product.file_path);
          if (Array.isArray(imagePaths)) {
            setCurrentImagePath(imagePaths[0]); // 첫 번째 이미지를 메인으로
            const previews = imagePaths.map((path, index) => ({
              id: `existing-${index}`,
              url: path,
              isNew: false
            }));
            setImagePreviews(previews);
          } else {
            // 단일 경로인 경우
            setCurrentImagePath(product.file_path);
            setImagePreviews([{
              id: 'current',
              url: product.file_path,
              isNew: false
            }]);
          }
        } catch {
          // JSON 파싱 실패시 단일 경로로 처리
          setCurrentImagePath(product.file_path);
          setImagePreviews([{
            id: 'current',
            url: product.file_path,
            isNew: false
          }]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // 새로운 미리보기 생성
    const newPreviews: ImagePreview[] = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isNew: true
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (imageId: string) => {
    // 미리보기에서 제거
    setImagePreviews(prev => {
      const removed = prev.find(img => img.id === imageId);
      if (removed?.isNew && removed.url.startsWith('blob:')) {
        URL.revokeObjectURL(removed.url);
      }
      return prev.filter(img => img.id !== imageId);
    });



    // 현재 이미지라면 null로 설정
    if (imageId === 'current') {
      setCurrentImagePath(null);
    }
  };

  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      const [moved] = newPreviews.splice(fromIndex, 1);
      newPreviews.splice(toIndex, 0, moved);
      return newPreviews;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 제품 데이터 준비
      const productData: ProductUpdateData = {
        name: formData.name,
        model_number: formData.model,
        category_id: parseInt(formData.category_id),
        description: formData.description || undefined,
        specifications: formData.specifications || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        is_featured: formData.is_featured ? 1 : 0,
        display_order: 0
      };

      // 유지할 기존 이미지들 (순서 포함)
      const existingImagePaths = imagePreviews
        .filter(img => !img.isNew)
        .map(img => img.url);

      // 새로 선택된 이미지 파일들
      const newImageFiles = imagePreviews
        .filter(img => img.isNew && img.file)
        .map(img => img.file!);

      // 제품 업데이트 (기존 이미지 순서와 새 이미지 포함)
      await updateProduct(
        productId, 
        productData, 
        newImageFiles.length > 0 ? newImageFiles : undefined,
        existingImagePaths  // 기존 이미지 순서 정보 전달
      );
      
      // 성공 시 제품 목록으로 이동
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      setError(error.response?.data?.detail || '제품 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">제품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900">보람안전 관리자</span>
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/admin/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                제품 관리
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600">편집</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/admin/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                제품 목록
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                대시보드
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">제품 편집</h1>
              <p className="text-gray-600 mt-2">제품 정보를 수정합니다</p>
            </div>
            <Link
              href="/admin/products"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>제품 목록으로</span>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="제품명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  모델명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="모델명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제조사
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="제조사를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 (원)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="가격을 입력하세요"
                  min="0"
                  step="1"
                />
              </div>


            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                  추천 제품으로 설정
                </label>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">상세 정보</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품 설명
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="제품에 대한 자세한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품 사양
                </label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="제품 사양을 입력하세요 (크기, 무게, 재질 등)"
                />
              </div>
            </div>
          </div>

          {/* 이미지 관리 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">이미지 관리</h2>
            
            {/* 현재 이미지들 */}
            {imagePreviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">현재 이미지</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.isNew ? image.url : getImageUrl(image.url)}
                          alt={`이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="14"%3E이미지 없음%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      
                      {/* 이미지 컨트롤 */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleImageReorder(index, index - 1)}
                            className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                            title="앞으로 이동"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleImageRemove(image.id)}
                          className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                          title="이미지 삭제"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        
                        {index < imagePreviews.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleImageReorder(index, index + 1)}
                            className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors"
                            title="뒤로 이동"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      {/* 순서 표시 */}
                      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      
                      {/* 새 이미지 표시 */}
                      {image.isNew && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          NEW
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                새 이미지 추가
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label className="cursor-pointer">
                  <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
                    이미지 선택
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-gray-500 text-sm mt-2">
                  여러 개의 이미지를 선택할 수 있습니다 (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          {/* 폼 액션 */}
          <div className="flex items-center justify-end space-x-4 bg-white rounded-lg shadow-sm border p-6">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>저장 중...</span>
                </div>
              ) : (
                '변경사항 저장'
              )}
            </button>
          </div>
        </form>

        {/* 편집 팁 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 제품 편집 팁</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>이미지 순서</strong>: 첫 번째 이미지가 대표 이미지로 사용됩니다</li>
            <li>• <strong>이미지 관리</strong>: 호버 시 나타나는 버튼으로 순서 변경 및 삭제가 가능합니다</li>
            <li>• <strong>추천 제품</strong>: 홈페이지의 추천 섹션에 표시됩니다</li>
            <li>• <strong>표시 순서</strong>: 작은 숫자일수록 먼저 표시됩니다</li>
            <li>• <strong>가격 정보</strong>: 비워두면 '문의' 표시됩니다</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EditProductPage;