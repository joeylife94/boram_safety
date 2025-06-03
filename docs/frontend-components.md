# 프론트엔드 컴포넌트 명세

## 1. 공통 컴포넌트

### 1.1 Header
전역 네비게이션을 담당하는 헤더 컴포넌트

```typescript
interface HeaderProps {
  transparent?: boolean;  // 투명 배경 여부
}
```

**사용 예시**
```jsx
// 기본 헤더
<Header />

// 투명 배경 헤더 (랜딩 페이지용)
<Header transparent />
```

### 1.2 Footer
페이지 하단의 푸터 컴포넌트

```typescript
interface FooterProps {
  showNewsletter?: boolean;  // 뉴스레터 구독 폼 표시 여부
}
```

## 2. 제품 관련 컴포넌트

### 2.1 ProductCard
제품을 표시하는 카드 컴포넌트입니다.

```typescript
interface ProductCardProps {
  product: Product;  // 제품 정보
}
```

### 기능
- 제품 이미지 표시
- 이미지 로딩 상태 표시
- 이미지 로드 실패 시 대체 이미지 표시
- 제품명, 설명, 가격, 재고 정보 표시
- 호버 효과 및 애니메이션
- 반응형 디자인

### 사용 예시

```tsx
import ProductCard from '@/app/components/ProductCard';

function ProductList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 스타일
- 기본 카드: 흰색 배경, 그림자 효과
- 이미지 영역: 4:3 비율 유지
- 호버 시: 그림자 증가, 약간 위로 이동
- 텍스트 영역: 패딩 적용, 텍스트 말줄임 처리
- 가격: 파란색 강조
- 재고: 회색 작은 텍스트

### 이미지 처리
1. 기본: product.image_url 사용
2. 대체: 카테고리별 기본 이미지 사용
3. 최종: placeholder 이미지 사용

### 접근성
- 적절한 alt 텍스트 제공
- 키보드 네비게이션 지원
- 충분한 색상 대비
- 텍스트 크기 및 간격 최적화

### 2.2 ProductGrid
제품 목록을 그리드 형태로 표시하는 컴포넌트

```typescript
interface ProductGridProps {
  products: Product[];
  columns?: {
    sm?: number;  // 태블릿 (기본값: 2)
    lg?: number;  // 데스크톱 (기본값: 3)
    xl?: number;  // 와이드스크린 (기본값: 4)
  };
  gap?: number;  // 그리드 간격 (기본값: 4)
}
```

### 2.3 CategoryFilter
제품 카테고리 필터 컴포넌트

```typescript
interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}
```

## 3. 페이지 레이아웃 컴포넌트

### 3.1 PageHeader
페이지 상단의 타이틀과 설명을 표시하는 컴포넌트

```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}
```

### 3.2 Container
페이지 콘텐츠의 최대 너비를 제한하는 컴포넌트

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}
```

## 4. 폼 컴포넌트

### 4.1 ContactForm
문의하기 페이지의 폼 컴포넌트

```typescript
interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  initialData?: Partial<ContactFormData>;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  agreement: boolean;
}
```

## 5. 유틸리티 컴포넌트

### 5.1 Image
Next.js Image 컴포넌트를 래핑한 최적화된 이미지 컴포넌트

```typescript
interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}
```

### 5.2 Button
공통 버튼 컴포넌트

```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
``` 