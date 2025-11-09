import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createCategory, CategoryCreateData } from '@/api/admin';
import { logger } from '@/lib/logger';

const NewCategoryPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryCreateData>({
    name: '',
    code: '',
    slug: '',
    description: '',
    display_order: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 1 : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCategory(formData, imageFile);
      router.push('/admin/categories');
    } catch (error: any) {
      logger.error('Error creating category:', error);
      setError(error.response?.data?.detail || '카테고리 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
              <Link href="/admin/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                카테고리 관리
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600">새 카테고리</span>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                대시보드
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                홈으로
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">새 카테고리 추가</h1>
              <p className="text-gray-600 mt-2">새로운 제품 카테고리를 추가합니다</p>
            </div>
            <Link
              href="/admin/categories"
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>카테고리 목록으로</span>
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
                <p className="text-sm text-red-800">{error}</p>
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
        <div className="bg-white rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Category Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: 보호장비"
                    required
                  />
                </div>

                {/* Category Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 코드 *
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: PROTECTION"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    영문 대문자와 숫자만 사용 (API에서 사용됨)
                  </p>
                </div>

                {/* Category Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    슬러그 *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="예: protection"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL에 사용되는 고유 식별자 (소문자, 하이픈 사용 가능)
                  </p>
                </div>

                {/* Display Order */}
                <div>
                  <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
                    표시 순서
                  </label>
                  <input
                    type="number"
                    id="display_order"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    작은 숫자일수록 먼저 표시됩니다
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    설명
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="카테고리에 대한 상세 설명을 입력하세요"
                  />
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리 이미지
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="미리보기"
                        className="w-full h-48 object-cover rounded-lg mx-auto"
                      />
                      <div className="flex justify-center space-x-4">
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                          이미지 변경
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="text-gray-600 hover:text-red-600 px-4 py-2 border border-gray-300 rounded-lg transition-colors"
                        >
                          제거
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                          이미지 선택
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-gray-500 text-sm mt-2">
                          JPG, PNG, GIF 파일만 업로드 가능합니다
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/admin/categories"
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
                    <span>생성 중...</span>
                  </div>
                ) : (
                  '카테고리 생성'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 카테고리 생성 팁</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>카테고리 이름</strong>: 사용자에게 표시되는 이름으로, 명확하고 직관적으로 작성하세요</li>
            <li>• <strong>카테고리 코드</strong>: API에서 사용되는 고유 식별자로, 영문 대문자와 숫자만 사용하세요</li>
            <li>• <strong>슬러그</strong>: URL에 사용되며, 자동으로 생성되지만 필요시 수정 가능합니다</li>
            <li>• <strong>표시 순서</strong>: 홈페이지와 제품 목록에서 카테고리가 표시되는 순서를 결정합니다</li>
            <li>• <strong>이미지</strong>: 카테고리를 시각적으로 나타내는 대표 이미지를 업로드하세요</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default NewCategoryPage;