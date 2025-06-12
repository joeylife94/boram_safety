import React from 'react';
import Layout from '@/components/layout/Layout';

const AboutPage = () => {
  const values = [
    {
      title: '품질 제일',
      description: '최고 품질의 안전용품만을 제공하여 작업자의 안전을 책임집니다.',
    },
    {
      title: '전문성',
      description: '풍부한 경험과 전문 지식을 바탕으로 최적의 솔루션을 제안합니다.',
    },
    {
      title: '신뢰성',
      description: '정직과 신뢰를 바탕으로 고객과의 관계를 소중히 합니다.',
    },
    {
      title: '혁신',
      description: '끊임없는 연구와 혁신으로 더 나은 안전 솔루션을 개발합니다.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              보람안전은 작업자의 안전을 최우선으로 생각하며,
              최고 품질의 안전용품을 제공하는 전문 기업입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                우리의 미션
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                보람안전은 산업 현장의 안전을 책임지는 파트너로서,
                최고 품질의 안전용품과 전문적인 서비스를 제공하여
                모든 작업자가 안전하고 건강한 작업 환경에서 일할 수 있도록 합니다.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                우리의 비전
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                산업 안전의 새로운 기준을 제시하고,
                혁신적인 안전 솔루션을 통해 
                더 안전한 작업 환경을 만들어가는 
                글로벌 리더가 되는 것을 목표로 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            핵심 가치
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              회사 연혁
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">30+</div>
                <div className="text-gray-600 font-medium">년간 경험</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">254+</div>
                <div className="text-gray-600 font-medium">제품 종류</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">11</div>
                <div className="text-gray-600 font-medium">주요 카테고리</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            함께 안전한 미래를 만들어가세요
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            보람안전과 파트너십을 통해 더 안전한 작업환경을 구축하고,
            작업자의 안전을 보장하는 솔루션을 만들어보세요.
          </p>
          <div className="flex justify-center">
            <a href="/products" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-300">
              제품 보기
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage; 