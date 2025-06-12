import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSearchSuggestions, SearchSuggestion } from '@/api/product';
import { getProductImageUrl } from '@/utils/image';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // 검색 제안 가져오기 (debounced)
  const fetchSearchSuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      setIsSearchLoading(true);
      const result = await getSearchSuggestions(query.trim(), 5);
      setSearchSuggestions(result.suggestions);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // 검색어 변경 핸들러 (debounce 적용)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // 기존 타이머 클리어
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 300ms 후 검색 제안 가져오기
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  // 검색 제출
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색어가 있으면 제품 페이지로 이동 (검색 페이지는 삭제됨)
      router.push(`/products`);
      setIsSearchFocused(false);
      setSearchSuggestions([]);
    }
  };

  // 검색 제안 클릭
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(suggestion.url);
    setSearchQuery('');
    setIsSearchFocused(false);
    setSearchSuggestions([]);
  };

  // 외부 클릭 시 검색 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setSearchSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">보람안전</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchDropdownRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="제품명, 모델번호로 검색하세요..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {isSearchFocused && (searchSuggestions.length > 0 || isSearchLoading) && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                {isSearchLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">검색 중...</p>
                  </div>
                ) : (
                  <div className="py-2">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <img
                          src={getProductImageUrl({ file_path: suggestion.file_path } as any)}
                          alt={suggestion.name}
                          className="w-12 h-12 object-cover rounded border bg-gray-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="100%25" height="100%25" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666666" font-family="Arial, sans-serif" font-size="10"%3E이미지%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {suggestion.category_code}
                          </p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                    {searchQuery.trim() && (
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={() => {
                            router.push(`/products`);
                            setIsSearchFocused(false);
                            setSearchSuggestions([]);
                          }}
                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors text-left font-medium"
                        >
                          "{searchQuery}" 관련 제품 카테고리 보기
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              제품
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              회사소개
            </Link>
            <Link 
              href="/admin" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              관리자
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="제품명, 모델번호로 검색하세요..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                href="/products"
                className="block py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                제품
              </Link>
              <Link
                href="/about"
                className="block py-2 px-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                회사소개
              </Link>
              <Link
                href="/admin"
                className="block py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                관리자
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 