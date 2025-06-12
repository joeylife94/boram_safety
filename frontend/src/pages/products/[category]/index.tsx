import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { getCategoryByCode, getProductsByCategory, searchProducts, getCategories, SearchParams, SearchResult } from '@/api/product';
import { SafetyCategory, SafetyProduct } from '@/types/product';
import { getProductImageUrl } from '@/utils/image';
import Link from 'next/link';

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [categoryInfo, setCategoryInfo] = useState<SafetyCategory | null>(null);
  const [products, setProducts] = useState<SafetyProduct[]>([]);
  const [originalProducts, setOriginalProducts] = useState<SafetyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // 검색 및 필터 상태
  const [searchParams, setSearchParams] = useState<SearchParams>({
    sort_by: 'name',
    limit: 50
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // 안전한 placeholder 이미지
  const defaultPlaceholder = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="16"%3E이미지 없음%3C/text%3E%3C/svg%3E';

  // 검색 실행 함수
  const performSearch = async (params: SearchParams) => {
    try {
      setSearchLoading(true);
      console.log('Performing search with params:', params);
      
      const result = await searchProducts(params);
      console.log('Search result:', result);
      
      setProducts(result.products);
      setTotalCount(result.total_count);
    } catch (err) {
      console.error('Search error:', err);
      
      // 검색 실패 시 카테고리 필터를 적용한 원본 데이터로 필터링
      if (categoryInfo) {
        const filteredProducts = originalProducts.filter(product => 
          product.category_code === categoryInfo.code
        );
        setProducts(filteredProducts);
        setTotalCount(filteredProducts.length);
      } else {
        setProducts(originalProducts);
        setTotalCount(originalProducts.length);
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (category && typeof category === 'string') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [categoryData, productsData] = await Promise.all([
            getCategoryByCode(category),
            getProductsByCategory(category)
          ]);
          
          console.log('Category data:', categoryData);
          console.log('Products data:', productsData);
          setCategoryInfo(categoryData);
          setProducts(productsData);
          setOriginalProducts(productsData);
          setTotalCount(productsData.length);
          
          // 검색 파라미터에 현재 카테고리 설정 (고정)
          setSearchParams(prev => ({ 
            ...prev, 
            category_code: categoryData.code 
          }));
          
        } catch (err) {
          setError('제품 목록을 불러오는데 실패했습니다.');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [category]);

  // 필터 변경 핸들러
  const handleFilterChange = (newParams: Partial<SearchParams>) => {
    // 카테고리는 항상 현재 카테고리로 고정
    const updatedParams = { 
      ...searchParams, 
      ...newParams,
      category_code: categoryInfo?.code || ''
    };
    setSearchParams(updatedParams);
    performSearch(updatedParams);
  };

  // 검색어 변경
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // 검색어가 있을 때만 검색 API 호출, 없으면 원본 데이터 사용
    if (value.trim()) {
      const updatedParams = { 
        ...searchParams, 
        query: value.trim(),
        category_code: categoryInfo?.code || ''
      };
      setSearchParams(updatedParams);
      performSearch(updatedParams);
    } else {
      // 검색어가 없으면 필터만 적용한 원본 데이터 표시
      setSearchQuery('');
      const resetParams: SearchParams = { 
        category_code: categoryInfo?.code || '',
        sort_by: searchParams.sort_by || 'name',
        min_price: searchParams.min_price,
        max_price: searchParams.max_price,
        stock_status: searchParams.stock_status,
        is_featured: searchParams.is_featured,
        limit: 50
      };
      setSearchParams(resetParams);
      
      // 다른 필터가 있는지 확인
      const hasActiveFilters = !!(resetParams.min_price || resetParams.max_price || 
        resetParams.stock_status || resetParams.is_featured);
      
      if (hasActiveFilters) {
        // 다른 필터가 있으면 검색 API 호출
        performSearch(resetParams);
      } else {
        // 필터가 없으면 원본 데이터 사용
        setProducts(originalProducts);
        setTotalCount(originalProducts.length);
      }
    }
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchQuery('');
    const resetParams = { 
      category_code: categoryInfo?.code || '',
      sort_by: 'name' as const, 
      limit: 50
    };
    setSearchParams(resetParams);
    setProducts(originalProducts);
    setTotalCount(originalProducts.length);
    setSearchLoading(false);
  };

  // 제품 클릭 핸들러
  const handleProductClick = (productId: number, categoryCode: string) => {
    router.push(`/products/${categoryCode}/${productId}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">제품 목록을 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (error || !categoryInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || '카테고리를 찾을 수 없습니다.'}
          </p>
          <Link href="/products" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            카테고리 목록으로 돌아가기
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-6 pb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                홈
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href="/products" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                  제품
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{categoryInfo.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {categoryInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              {categoryInfo.description}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex">
                <input
                  type="text"
                  placeholder={`${categoryInfo.name} 제품을 검색하세요...`}
                  value={searchQuery}
                  onChange={handleSearchQueryChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 border-l-0 border border-gray-600 font-semibold transition-colors duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  필터
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r-lg font-semibold transition-colors duration-300"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {isFiltersOpen && (
        <section className="bg-white border-b py-6">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Price & Stock */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">가격 및 재고</h4>
                  
                  {/* Price Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">가격 범위</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        placeholder="최소"
                        value={searchParams.min_price || ''}
                        onChange={(e) => handleFilterChange({ 
                          min_price: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-gray-500">~</span>
                      <input
                        type="number"
                        placeholder="최대"
                        value={searchParams.max_price || ''}
                        onChange={(e) => handleFilterChange({ 
                          max_price: e.target.value ? parseFloat(e.target.value) : undefined 
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">원</span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">재고 상태</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stock"
                          checked={!searchParams.stock_status}
                          onChange={() => handleFilterChange({ stock_status: undefined })}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">전체</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stock"
                          checked={searchParams.stock_status === 'in_stock'}
                          onChange={() => handleFilterChange({ stock_status: 'in_stock' })}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">재고 있음</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="stock"
                          checked={searchParams.stock_status === 'out_of_stock'}
                          onChange={() => handleFilterChange({ stock_status: 'out_of_stock' })}
                          className="mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">재고 없음</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Products */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">추천 및 기타</h4>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={searchParams.is_featured || false}
                        onChange={(e) => handleFilterChange({ is_featured: e.target.checked || undefined })}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">추천 제품만 보기</span>
                        <p className="text-xs text-gray-500 mt-1">보람안전에서 엄선한 인기 제품</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={resetFilters}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    필터 초기화
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                제품 목록
                {searchLoading && (
                  <span className="ml-3 inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-sm text-gray-600">검색 중...</span>
                  </span>
                )}
              </h2>
              <p className="text-gray-600">
                {searchQuery && `"${searchQuery}" 검색결과: `}
                총 <span className="font-semibold text-gray-900">{totalCount}개</span>의 제품
              </p>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">정렬:</label>
                <select
                  id="sort"
                  value={searchParams.sort_by || 'name'}
                  onChange={(e) => handleFilterChange({ sort_by: e.target.value as any })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="name">이름순</option>
                  <option value="price_asc">가격 낮은순</option>
                  <option value="price_desc">가격 높은순</option>
                  <option value="featured">추천순</option>
                </select>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
                필터
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {products.length === 0 && !searchLoading ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.901-6.056 2.373" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` : '조건에 맞는 제품이 없습니다.'}
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                전체 제품 보기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const productImageUrl = getProductImageUrl(product);
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
                    onClick={() => handleProductClick(product.id, product.category_code)}
                  >
                    <div className="aspect-w-16 aspect-h-12 bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={productImageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== defaultPlaceholder) {
                            target.src = defaultPlaceholder;
                          }
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.is_featured === 1 && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200 flex-shrink-0">
                            추천
                          </span>
                        )}
                      </div>
                      
                      {product.model_number && (
                        <p className="text-sm text-gray-500 mb-2">
                          모델: {product.model_number}
                        </p>
                      )}
                      
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        {product.price ? (
                          <span className="text-lg font-bold text-blue-600">
                            ₩{product.price.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">
                            가격 문의
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          product.stock_status === 'in_stock' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {product.stock_status === 'in_stock' ? '재고 있음' : '재고 없음'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            원하는 제품을 찾으셨나요?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            더 자세한 제품 정보나 견적이 필요하시면 언제든 문의해주세요.
            전문 상담사가 최적의 솔루션을 제안해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              견적 문의하기
            </button>
            <button
              onClick={() => router.push('/products')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              다른 카테고리 보기
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
} 