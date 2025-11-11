import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ExcelManagement from '@/components/admin/ExcelManagement';

const ExcelPage = () => {
  const router = useRouter();

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
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                대시보드
              </Link>
              <Link href="/admin/products" className="text-gray-600 hover:text-blue-600 transition-colors">
                제품 관리
              </Link>
              <Link href="/admin/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                카테고리 관리
              </Link>
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                홈으로
              </Link>
              <button 
                onClick={() => {
                  router.push('/');
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                관리자
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Excel 일괄 관리</li>
          </ol>
        </nav>

        {/* Excel Management Component */}
        <ExcelManagement />

        {/* Additional Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Excel 파일 형식 안내</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <p className="font-medium mb-1">필수 컬럼:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>카테고리코드</strong>: safety_helmet, safety_gloves 등 (정확히 입력 필수)</li>
                <li><strong>제품명</strong>: 제품의 이름</li>
              </ul>
            </div>
            
            <div>
              <p className="font-medium mb-1">선택 컬럼:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>모델번호: 제품 모델 번호</li>
                <li>가격: 숫자만 입력 (예: 50000)</li>
                <li>설명: 제품 설명</li>
                <li>사양: 제품 사양 정보</li>
                <li>재고상태: in_stock, out_of_stock, discontinued 중 하나</li>
                <li>이미지경로: 이미지 파일명 (예: product_001.jpg)</li>
                <li>표시순서: 숫자 (예: 1, 2, 3...)</li>
                <li>추천제품: TRUE 또는 FALSE</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="font-medium mb-1">⚠️ 주의사항:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Excel 파일은 .xlsx 또는 .xls 형식이어야 합니다</li>
                <li>첫 번째 행은 컬럼명(헤더)이 있어야 합니다</li>
                <li>두 번째 행부터 실제 데이터를 입력하세요</li>
                <li>카테고리코드는 미리 등록된 코드만 사용 가능합니다</li>
                <li>교체 모드는 모든 기존 데이터를 삭제하므로 신중하게 사용하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Available Categories Section */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 사용 가능한 카테고리 코드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { code: 'safety_helmet', name: '안전모' },
              { code: 'safety_gloves', name: '안전장갑' },
              { code: 'safety_boots', name: '안전화' },
              { code: 'safety_belt', name: '안전벨트' },
              { code: 'protective_clothing', name: '보호복' },
              { code: 'respiratory_protection', name: '호흡보호구' },
              { code: 'hearing_protection', name: '청력보호구' },
              { code: 'face_protection', name: '안면보호구' },
              { code: 'leg_protection', name: '다리보호구' },
              { code: 'musculoskeletal_protection', name: '근골격계보호구' },
              { code: 'others', name: '기타' }
            ].map((category) => (
              <div 
                key={category.code}
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border"
              >
                <code className="text-xs font-mono bg-gray-200 px-2 py-1 rounded flex-1">
                  {category.code}
                </code>
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            대시보드로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ExcelPage;
