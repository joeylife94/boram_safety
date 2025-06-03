# 프론트엔드 스타일 가이드

## 1. 디자인 시스템

### 1.1 색상 시스템
```css
/* Primary Colors */
--primary-blue: #1E40AF;  /* 브랜드 메인 컬러 */
--primary-hover: #1E3A8A;
--primary-light: #60A5FA;

/* Neutral Colors */
--gray-900: #111827;  /* 텍스트 주 색상 */
--gray-600: #4B5563;  /* 보조 텍스트 */
--gray-300: #D1D5DB;  /* 구분선 */
--gray-100: #F3F4F6;  /* 배경색 */

/* Accent Colors */
--yellow-500: #F59E0B;  /* 강조색 (BEST 태그) */
--blue-600: #2563EB;   /* 강조색 (NEW 태그) */
```

### 1.2 타이포그래피
```css
/* Headings */
h1 {
  font-size: 2.25rem;  /* 36px */
  line-height: 2.5rem;  /* 40px */
  font-weight: 700;
}

h2 {
  font-size: 1.875rem;  /* 30px */
  line-height: 2.25rem;  /* 36px */
  font-weight: 700;
}

h3 {
  font-size: 1.5rem;  /* 24px */
  line-height: 2rem;  /* 32px */
  font-weight: 600;
}

/* Body Text */
body {
  font-size: 1rem;  /* 16px */
  line-height: 1.5rem;  /* 24px */
}

.text-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.25rem;  /* 20px */
}
```

### 1.3 간격 시스템
```css
/* Spacing Scale */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
```

## 2. 컴포넌트 스타일 가이드

### 2.1 버튼
```jsx
// Primary Button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  버튼
</button>

// Secondary Button
<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
  버튼
</button>
```

### 2.2 배지
```jsx
// NEW 배지
<span className="bg-blue-600 text-white text-sm px-2 py-1 rounded">
  NEW
</span>

// BEST 배지
<span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded">
  BEST
</span>
```

### 2.3 그리드 레이아웃
```jsx
// 반응형 그리드
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {/* 아이템들 */}
</div>
```

## 3. 반응형 디자인

### 3.1 브레이크포인트
```css
/* Mobile First */
@media (min-width: 640px) {
  /* sm: Tablet */
}

@media (min-width: 768px) {
  /* md: Small Desktop */
}

@media (min-width: 1024px) {
  /* lg: Desktop */
}

@media (min-width: 1280px) {
  /* xl: Large Desktop */
}
```

### 3.2 모바일 최적화
- 터치 타겟 크기 최소 44x44px
- 폰트 크기 최소 16px
- 여백과 간격 조정
- 제스처 지원

## 4. 접근성 가이드라인

### 4.1 이미지
- 모든 이미지에 의미 있는 alt 텍스트 제공
- 장식용 이미지는 alt=""로 처리
- 적절한 이미지 크기와 비율 유지

### 4.2 키보드 네비게이션
- 모든 상호작용 요소에 focus 스타일 적용
- Tab 순서 논리적으로 구성
- Skip 링크 제공

### 4.3 ARIA 레이블
- 모달, 드롭다운 등 동적 컨텐츠에 적절한 ARIA 속성 사용
- 스크린리더 사용자를 위한 설명 제공
- 상태 변화 알림

## 5. 성능 최적화

### 5.1 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 사용
- 적절한 sizes 속성 설정
- 이미지 preload 전략

### 5.2 CSS 최적화
- 사용하지 않는 스타일 제거
- Critical CSS 인라인 처리
- CSS 번들 크기 최적화

### 5.3 JavaScript 최적화
- 코드 스플리팅
- 지연 로딩
- 이벤트 핸들러 최적화

## 6. 코드 컨벤션

### 6.1 CSS 클래스 네이밍
- BEM 방식 준수
- 의미있는 이름 사용
- 일관된 네이밍 패턴

### 6.2 컴포넌트 스타일링
- Tailwind 유틸리티 클래스 우선 사용
- 커스텀 스타일은 모듈화
- 일관된 테마 변수 사용

### 6.3 미디어 쿼리
- 모바일 퍼스트 접근
- 중단점 변수 사용
- 일관된 중단점 적용

## 제품 카드 스타일

### 레이아웃
```css
/* 카드 컨테이너 */
.product-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200;
}

/* 이미지 컨테이너 */
.product-image-container {
  @apply relative aspect-[4/3] bg-gray-100;
}

/* 이미지 */
.product-image {
  @apply w-full h-full object-cover transition-opacity duration-200;
}

/* 텍스트 영역 */
.product-content {
  @apply p-4;
}
```

### 타이포그래피
```css
/* 제품명 */
.product-title {
  @apply text-lg font-semibold mb-2 text-gray-800 line-clamp-1;
}

/* 제품 설명 */
.product-description {
  @apply text-gray-600 text-sm mb-3 line-clamp-2;
}

/* 가격 */
.product-price {
  @apply text-blue-600 font-bold;
}

/* 재고 정보 */
.product-stock {
  @apply text-sm text-gray-500;
}
```

### 상호작용
```css
/* 호버 효과 */
.product-card:hover {
  @apply shadow-lg -translate-y-1;
}

/* 로딩 스피너 */
.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin;
}
```

### 반응형 그리드
```css
/* 제품 그리드 */
.products-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}
```

### 이미지 상태
```css
/* 로딩 중 */
.image-loading {
  @apply opacity-0;
}

/* 로드 완료 */
.image-loaded {
  @apply opacity-100;
}
```

### 접근성
- 텍스트 색상 대비: WCAG 2.1 AA 기준 준수
- 포커스 표시: 키보드 네비게이션 시 명확한 포커스 링
- 적절한 텍스트 크기: 최소 14px
- 충분한 여백과 터치 영역 