import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SiteSettings {
  id: number;
  company_name: string;
  company_name_en?: string;
  company_slogan?: string;
  phone?: string;
  fax?: string;
  email?: string;
  address?: string;
  address_detail?: string;
  postal_code?: string;
  about_title?: string;
  about_content?: string;
  about_mission?: string;
  about_vision?: string;
  business_hours?: string;
  business_license?: string;
  ceo_name?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  blog_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export default function SiteSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('설정 로드 실패:', error);
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setMessage(null);

    try {
      await axios.put(`${API_URL}/api/admin/settings`, settings);
      setMessage({ type: 'success', text: '설정이 저장되었습니다!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('모든 설정을 기본값으로 되돌리시겠습니까?')) return;

    setSaving(true);
    try {
      const response = await axios.post(`${API_URL}/api/admin/settings/reset`);
      setSettings(response.data);
      setMessage({ type: 'success', text: '설정이 초기화되었습니다' });
    } catch (error) {
      console.error('설정 초기화 실패:', error);
      setMessage({ type: 'error', text: '설정 초기화에 실패했습니다' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>로딩 중...</p>
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
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">
                대시보드
              </Link>
              <button 
                onClick={() => router.push('/')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">
                관리자
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">사이트 설정</li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">⚙️ 사이트 설정</h2>
              <p className="text-gray-600 mt-1">웹사이트의 기본 정보를 설정하세요</p>
            </div>
            <button
              onClick={handleReset}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              기본값으로 초기화
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">📋 기본 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings?.company_name || ''}
                    onChange={(e) => handleChange('company_name', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    영문 회사명
                  </label>
                  <input
                    type="text"
                    value={settings?.company_name_en || ''}
                    onChange={(e) => handleChange('company_name_en', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    슬로건
                  </label>
                  <input
                    type="text"
                    value={settings?.company_slogan || ''}
                    onChange={(e) => handleChange('company_slogan', e.target.value)}
                    placeholder="예: 안전한 작업환경을 위한 최고의 파트너"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 연락처 정보 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">📞 연락처 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    value={settings?.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="02-1234-5678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    팩스
                  </label>
                  <input
                    type="tel"
                    value={settings?.fax || ''}
                    onChange={(e) => handleChange('fax', e.target.value)}
                    placeholder="02-1234-5679"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    type="email"
                    value={settings?.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="info@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 주소 정보 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">📍 주소 정보</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      우편번호
                    </label>
                    <input
                      type="text"
                      value={settings?.postal_code || ''}
                      onChange={(e) => handleChange('postal_code', e.target.value)}
                      placeholder="12345"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    주소
                  </label>
                  <input
                    type="text"
                    value={settings?.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="서울특별시 강남구 테헤란로 123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상세 주소
                  </label>
                  <input
                    type="text"
                    value={settings?.address_detail || ''}
                    onChange={(e) => handleChange('address_detail', e.target.value)}
                    placeholder="10층 1001호"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 회사 소개 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">📝 회사 소개</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    소개 페이지 제목
                  </label>
                  <input
                    type="text"
                    value={settings?.about_title || ''}
                    onChange={(e) => handleChange('about_title', e.target.value)}
                    placeholder="회사 소개"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사 소개 내용
                  </label>
                  <textarea
                    value={settings?.about_content || ''}
                    onChange={(e) => handleChange('about_content', e.target.value)}
                    rows={4}
                    placeholder="회사에 대한 소개를 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    미션
                  </label>
                  <textarea
                    value={settings?.about_mission || ''}
                    onChange={(e) => handleChange('about_mission', e.target.value)}
                    rows={3}
                    placeholder="회사의 미션을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    비전
                  </label>
                  <textarea
                    value={settings?.about_vision || ''}
                    onChange={(e) => handleChange('about_vision', e.target.value)}
                    rows={3}
                    placeholder="회사의 비전을 입력하세요"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 영업 정보 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">🏢 영업 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    영업 시간
                  </label>
                  <input
                    type="text"
                    value={settings?.business_hours || ''}
                    onChange={(e) => handleChange('business_hours', e.target.value)}
                    placeholder="평일 09:00 - 18:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    대표자명
                  </label>
                  <input
                    type="text"
                    value={settings?.ceo_name || ''}
                    onChange={(e) => handleChange('ceo_name', e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    사업자등록번호
                  </label>
                  <input
                    type="text"
                    value={settings?.business_license || ''}
                    onChange={(e) => handleChange('business_license', e.target.value)}
                    placeholder="123-45-67890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 소셜 미디어 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">🌐 소셜 미디어</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings?.facebook_url || ''}
                    onChange={(e) => handleChange('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings?.instagram_url || ''}
                    onChange={(e) => handleChange('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={settings?.youtube_url || ''}
                    onChange={(e) => handleChange('youtube_url', e.target.value)}
                    placeholder="https://youtube.com/yourchannel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    블로그 URL
                  </label>
                  <input
                    type="url"
                    value={settings?.blog_url || ''}
                    onChange={(e) => handleChange('blog_url', e.target.value)}
                    placeholder="https://blog.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* SEO */}
            <section>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">🔍 SEO 설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    페이지 타이틀
                  </label>
                  <input
                    type="text"
                    value={settings?.meta_title || ''}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    placeholder="회사명 - 슬로건"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    페이지 설명
                  </label>
                  <textarea
                    value={settings?.meta_description || ''}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    rows={2}
                    placeholder="웹사이트에 대한 간단한 설명"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    키워드
                  </label>
                  <input
                    type="text"
                    value={settings?.meta_keywords || ''}
                    onChange={(e) => handleChange('meta_keywords', e.target.value)}
                    placeholder="키워드1, 키워드2, 키워드3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </section>

            {/* 저장 버튼 */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Link
                href="/admin"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? '저장 중...' : '설정 저장'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
