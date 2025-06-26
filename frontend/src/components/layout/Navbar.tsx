import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const pages = [
  { title: '제품', path: '/products' },
  { title: '회사소개', path: '/about' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              보람안전물산(주)
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {pages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    router.pathname === page.path
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600'
                  }`}
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={handleDrawerToggle}
              className="bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {pages.map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  router.pathname === page.path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 