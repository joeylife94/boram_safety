import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { getProductById, getCategoryByCode } from '@/api/product';
import { SafetyProduct, SafetyCategory } from '@/types/product';
import { getProductImageUrl, getImageUrl } from '@/utils/image';
import Link from 'next/link';

export default function ProductDetailPage() {
  const router = useRouter();
  const { category, slug } = router.query;
  const [product, setProduct] = useState<SafetyProduct | null>(null);
  const [categoryInfo, setCategoryInfo] = useState<SafetyCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 안전한 placeholder 이미지
  const defaultPlaceholder = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="18"%3E이미지 없음%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    if (slug && category && typeof category === 'string' && typeof slug === 'string') {
      const fetchData = async () => {
        try {
          setLoading(true);
          const productId = parseInt(slug);
          if (isNaN(productId)) {
            throw new Error('Invalid product ID');
          }
          
          const [productData, categoryData] = await Promise.all([
            getProductById(productId),
            getCategoryByCode(category)
          ]);
          
          console.log('Product data:', productData); // 디버깅을 위한 로그
          setProduct(productData);
          setCategoryInfo(categoryData);
          setCurrentImageIndex(0); // 새 제품이 로드될 때 이미지 인덱스 리셋
        } catch (err) {
          setError('제품 정보를 불러오는데 실패했습니다.');
          console.error('Error fetching product:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [slug, category]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">제품 정보를 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (error || !product || !categoryInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || '제품을 찾을 수 없습니다.'}
          </p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            이전 페이지로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  // specifications를 JSON으로 파싱
  let parsedSpecifications: Record<string, string> = {};
  try {
    if (product?.specifications) {
      parsedSpecifications = JSON.parse(product.specifications);
    }
  } catch (e) {
    console.error('Error parsing specifications:', e);
  }

  // 여러 이미지 처리
  const getProductImages = (product: SafetyProduct): string[] => {
    if (!product.file_path) return [defaultPlaceholder];
    
    try {
      // JSON 배열로 저장된 경우
      const paths = JSON.parse(product.file_path);
      return Array.isArray(paths) ? paths.map(path => getImageUrl(path)) : [getImageUrl(product.file_path)];
    } catch {
      // 단일 경로인 경우
      return [getImageUrl(product.file_path)];
    }
  };

  const productImages = product ? getProductImages(product) : [defaultPlaceholder];
  
  console.log(`Product: ${product?.name || 'Loading...'}, Images: ${productImages.length}개`); // 디버깅

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
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href={`/products/${category}`} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                  {categoryInfo.name}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{product?.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={productImages[Math.min(currentImageIndex, productImages.length - 1)]}
                alt={`${product?.name || 'Product'} - 이미지 ${currentImageIndex + 1}`}
                className="w-full h-auto object-cover bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== defaultPlaceholder) {
                    console.log(`Product detail image failed for: ${product?.name || 'Unknown'}, using fallback`);
                    target.src = defaultPlaceholder;
                  }
                }}
              />
            </div>
            
            {/* 이미지 썸네일 및 네비게이션 */}
            {productImages.length > 1 && (
              <div className="space-y-3">
                {/* 이미지 네비게이션 버튼 */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : productImages.length - 1)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    disabled={productImages.length <= 1}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {currentImageIndex + 1} / {productImages.length}
                  </span>
                  
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev < productImages.length - 1 ? prev + 1 : 0)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    disabled={productImages.length <= 1}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* 썸네일 이미지들 */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.map((imageUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`${product?.name || 'Product'} 썸네일 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultPlaceholder;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title and Features */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product?.name}
              </h1>
              
              {product?.model_number && (
                <p className="text-lg text-gray-600 mb-4">
                  모델번호: {product.model_number}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                  {categoryInfo?.name}
                </span>
                {product?.is_featured === 1 && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full border border-yellow-200">
                    추천 제품
                  </span>
                )}
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                  product?.stock_status === 'in_stock' 
                    ? 'bg-green-100 text-green-700 border-green-200' 
                    : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                  {product?.stock_status === 'in_stock' ? '재고 있음' : '재고 없음'}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 border-t border-b border-gray-200">
              {product?.price ? (
                <p className="text-3xl font-bold text-blue-600">
                  ₩{product.price.toLocaleString()}
                </p>
              ) : (
                <div className="flex items-center space-x-3">
                  <p className="text-2xl font-bold text-gray-600">가격 문의</p>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full border border-orange-200">
                    상담 후 결정
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {product?.description && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  제품 설명
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(parsedSpecifications).length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  제품 사양
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {Object.entries(parsedSpecifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200 last:border-b-0">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => router.back()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-300"
              >
                이전으로 돌아가기
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">품질 보증</h4>
              <p className="text-gray-600">엄격한 품질 관리를 통해 최고 품질의 제품을 제공합니다.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">빠른 배송</h4>
              <p className="text-gray-600">신속하고 안전한 배송으로 제품을 전달해드립니다.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">전문 상담</h4>
              <p className="text-gray-600">제품에 대한 전문적인 상담을 제공해드립니다.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 