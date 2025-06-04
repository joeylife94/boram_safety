import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useRouter } from 'next/router';
import { getCategories } from '@/api/product';
import { SafetyCategory } from '@/types/product';
import { getCategoryImageUrl } from '@/utils/image';

const ProductsPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<SafetyCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 안전한 placeholder 이미지
  const defaultPlaceholder = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="16"%3E이미지 없음%3C/text%3E%3C/svg%3E';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        console.log('Categories data:', data); // 디버깅을 위한 로그
        setCategories(data);
      } catch (err) {
        setError('카테고리를 불러오는데 실패했습니다.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">카테고리를 불러오는 중입니다...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-16 text-center">
          <p className="text-lg text-red-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              안전용품 카테고리
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              보람안전에서 유통하는 다양한 안전용품을 카테고리별로 확인해보세요.
              각 카테고리를 클릭하면 해당 제품 목록을 볼 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const imageUrl = getCategoryImageUrl(category);
              console.log(`Category: ${category.name}, Image URL: ${imageUrl}`); // 디버깅
              
              return (
                <div
                  key={category.code}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-2 group"
                  onClick={() => router.push(`/products/${category.slug}`)}
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== defaultPlaceholder) {
                          console.log(`Image failed for category: ${category.name}, trying fallback`);
                          target.src = defaultPlaceholder;
                        }
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {category.name}
                      </h3>
                      <span className={`px-3 py-1 text-sm rounded-full border ${
                        category.image_count > 0 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}>
                        {category.image_count}개
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                전문 안전용품 유통업체
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                보람안전은 다양한 산업 현장에서 필요한 안전용품을 전문적으로 유통하는 업체입니다.
                엄선된 제품만을 취급하여 작업자의 안전을 최우선으로 생각합니다.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                각 제품은 국제 안전 기준을 만족하며, 다양한 작업 환경에 맞는 최적의 솔루션을 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {categories.length}개
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-4">
                  전문 카테고리
                </div>
                <p className="text-gray-600">
                  머리부터 발끝까지 모든 부위의 안전을 책임지는<br />
                  전문 안전용품 카테고리를 보유하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            맞춤형 안전용품 상담
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            작업 환경에 특화된 안전용품이 필요하신가요?
            전문 상담사가 최적의 제품을 추천해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              상담 문의하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductsPage; 