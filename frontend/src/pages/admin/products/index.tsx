import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  getProducts, 
  getCategories, 
  deleteProduct, 
  Product, 
  Category,
  getDrafts,
  DraftProduct,
  deleteDraft,
  publishDraft
} from '@/api/admin';
import { logger } from '@/lib/logger';
import { getProductImageUrl } from '@/utils/image';

type ViewMode = 'products' | 'drafts';

const AdminProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [drafts, setDrafts] = useState<DraftProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('products');

  useEffect(() => {
    fetchProducts();
    fetchDrafts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // 검색어나 카테고리가 변경될 때 제품 목록 새로고침
    const timeoutId = setTimeout(() => {
      if (viewMode === 'products') {
        fetchProducts();
      }
    }, 300); // 300ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, viewMode]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts({
        search: searchTerm || undefined,
        category_code: selectedCategory || undefined,
        limit: 1000
      });
      setProducts(data);
    } catch (error) {
      logger.error('Error fetching products:', error);
      setError('제품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await getDrafts({ limit: 100 });
      setDrafts(response.items);
    } catch (error) {
      logger.error('Error fetching drafts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      logger.error('Error fetching categories:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('이 제품을 삭제하시겠습니까?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        logger.error('Error deleting product:', error);
        alert('제품 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteDraft = async (id: number) => {
    if (window.confirm('이 임시 저장본을 삭제하시겠습니까?')) {
      try {
        await deleteDraft(id);
        setDrafts(drafts.filter(d => d.id !== id));
      } catch (error) {
        logger.error('Error deleting draft:', error);
        alert('임시 저장본 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handlePublishDraft = async (id: number) => {
    if (window.confirm('이 임시 저장본을 제품으로 발행하시겠습니까?')) {
      try {
        await publishDraft(id, true);
        await fetchProducts();
        await fetchDrafts();
        alert('제품이 성공적으로 발행되었습니다.');
      } catch (error) {
        logger.error('Error publishing draft:', error);
        alert('제품 발행 중 오류가 발생했습니다.');
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.model_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_code === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <span className="text-gray-600">제품 관리</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">제품 관리</h1>
            <p className="text-gray-600 mt-2">보람안전 제품을 관리하고 편집할 수 있습니다</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>새 제품 추가</span>
          </Link>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setViewMode('products')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                viewMode === 'products'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>등록된 제품 ({products.length})</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('drafts')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                viewMode === 'drafts'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>임시 저장 ({drafts.length})</span>
              </div>
            </button>
          </div>
        </div>

        {/* Filters - Only for products view */}
        {viewMode === 'products' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
                <input
                  type="text"
                  placeholder="제품명 또는 모델번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">전체 카테고리</option>
                  {categories.map((category) => (
                    <option key={category.code} value={category.code}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {viewMode === 'products' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  제품 목록 ({filteredProducts.length}개)
                </h3>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">제품을 불러오는 중...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-500 text-lg mb-2">제품이 없습니다</p>
              <p className="text-gray-400 mb-4">첫 번째 제품을 추가해보세요</p>
              <Link
                href="/admin/products/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>제품 추가</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <img
                              className="h-12 w-12 rounded-lg object-cover border"
                              src={getProductImageUrl(product)}
                              alt={product.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="10"%3E이미지%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.model_number}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {product.category_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.price ? `${product.price.toLocaleString()}원` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.is_featured 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.is_featured ? '추천' : '일반'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            편집
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        )}

        {/* Drafts Table */}
        {viewMode === 'drafts' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  임시 저장 목록 ({drafts.length}개)
                </h3>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">임시 저장 목록을 불러오는 중...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">임시 저장된 제품이 없습니다</p>
                <p className="text-gray-400 mb-4">제품 등록 시 임시 저장을 사용해보세요</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        제품 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        마지막 저장
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {drafts.map((draft) => (
                      <tr key={draft.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center border">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {draft.name || '(제목 없음)'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {draft.model_number || '(모델번호 없음)'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {draft.category_id ? (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                              {draft.category_id}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">미지정</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            draft.draft_status === 'ready_to_publish'
                              ? 'bg-green-100 text-green-800'
                              : draft.draft_status === 'auto_saved'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {draft.draft_status === 'ready_to_publish' ? '발행 준비' : 
                             draft.draft_status === 'auto_saved' ? '자동 저장' : '임시 저장'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {draft.updated_at ? new Date(draft.updated_at).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/products/${draft.id}/edit?draft=true`}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                            >
                              편집
                            </Link>
                            <button
                              onClick={() => handlePublishDraft(draft.id)}
                              className="text-green-600 hover:text-green-900 transition-colors"
                            >
                              발행
                            </button>
                            <button
                              onClick={() => handleDeleteDraft(draft.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminProductsPage;