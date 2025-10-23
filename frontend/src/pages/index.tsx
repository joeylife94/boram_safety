import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { getCategories } from '@/api/product';
import { SafetyCategory } from '@/types/product';
import { getCategoryImageUrl } from '@/utils/image';
import SafeImage from '@/components/common/SafeImage';
import Link from 'next/link';

const HomePage = () => {
  const [categories, setCategories] = useState<SafetyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        // 상위 5개 카테고리만 표시
        setCategories(data.slice(0, 5));
      } catch (err) {
        setError('카테고리를 불러오는데 실패했습니다.');
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              안전한 작업환경을 위한
              <span className="block text-yellow-400 mt-2">최고의 파트너</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              보람안전은 30년의 경험과 전문성으로 여러분의 안전을 책임집니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300">
                제품 둘러보기
              </Link>
              <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300">
                회사 소개
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 제품 카테고리 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">주요 제품 카테고리</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              다양한 산업 현장에서 필요한 안전용품을 한 곳에서 만나보세요
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => {
                const imageUrl = getCategoryImageUrl(category);
                return (
                  <Link
                    key={category.code}
                    href={`/products/${category.code}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className="w-full bg-gray-200 overflow-hidden flex items-center justify-center" style={{ aspectRatio: '1/1', minHeight: '200px' }}>
                      <SafeImage
                        src={imageUrl}
                        alt={category.name}
                        className="max-w-full max-h-full object-contain p-4"
                        width={400}
                        height={300}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600 font-medium">
                          {category.image_count || 0}개 제품
                        </span>
                        <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">표시할 카테고리가 없습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">왜 보람안전을 선택해야 할까요?</h2>
            <p className="text-lg text-gray-600">30년의 경험과 전문성이 만든 차별화된 서비스</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">검증된 품질</h3>
              <p className="text-gray-600">
                엄격한 품질 관리와 국제 인증을 통과한 제품만을 공급하여 최고의 안전성을 보장합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">신속한 대응</h3>
              <p className="text-gray-600">
                전국 네트워크를 통한 빠른 배송과 즉시 대응 가능한 고객 서비스를 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">전문 컨설팅</h3>
              <p className="text-gray-600">
                각 현장의 특성에 맞는 맞춤형 안전 솔루션과 전문적인 컨설팅을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 실적 및 신뢰도 섹션 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">신뢰할 수 있는 실적</h2>
            <p className="text-lg text-gray-600">30년간 쌓아온 경험과 실적으로 입증된 전문성</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
              <div className="text-gray-600 font-medium">년간 경험</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">254+</div>
              <div className="text-gray-600 font-medium">제품 종류</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">11</div>
              <div className="text-gray-600 font-medium">주요 카테고리</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">100%</div>
              <div className="text-gray-600 font-medium">품질 보증</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            보람안전과 함께 더 안전한 작업환경을 만들어보세요. 전문가 상담을 통해 최적의 솔루션을 찾아드립니다.
          </p>
          <div className="flex justify-center">
            <Link href="/products" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300">
              제품 보기
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 