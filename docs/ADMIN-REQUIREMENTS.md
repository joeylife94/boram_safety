# Admin 기능 요구사항 명세서

> **목표**: 보람안전 웹사이트의 백오피스 관리 시스템 구축
> **예상 개발 기간**: 3-4주
> **담당자**: [개발팀]

## 📋 프로젝트 개요

관리자가 웹사이트의 제품, 주문, 고객 정보를 효율적으로 관리할 수 있는 Admin 패널을 구축합니다.

## 🎯 주요 목표

1. **보안**: 안전한 관리자 인증 시스템
2. **효율성**: 직관적이고 빠른 데이터 관리
3. **확장성**: 향후 기능 추가에 유연한 구조
4. **사용성**: 관리자 친화적인 UI/UX

## 🔐 Phase 1: 인증 시스템

### 1.1 관리자 계정 관리
```sql
-- 새 테이블: admin_users
CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 JWT 토큰 기반 인증
- **토큰 만료**: 8시간
- **리프레시 토큰**: 30일
- **암호화**: bcrypt (salt rounds: 12)

### 1.3 필요한 API 엔드포인트
```python
POST /api/admin/login
POST /api/admin/logout
POST /api/admin/refresh-token
GET /api/admin/profile
PUT /api/admin/profile
```

### 1.4 Frontend 컴포넌트
```
/admin
├── login.tsx              # 로그인 페이지
├── dashboard.tsx          # 메인 대시보드
└── layout/
    ├── AdminLayout.tsx    # Admin 전용 레이아웃
    ├── AdminHeader.tsx    # Admin 헤더
    └── AdminSidebar.tsx   # 사이드바 네비게이션
```

## 📦 Phase 2: 제품 관리

### 2.1 제품 CRUD 기능

#### 제품 목록
- **검색**: 제품명, 모델번호, 카테고리별
- **필터링**: 재고 상태, 가격 범위, 추천 여부
- **정렬**: 이름, 가격, 등록일, 수정일
- **페이지네이션**: 페이지당 50개

#### 제품 상세 편집
```typescript
interface ProductEditForm {
  name: string;
  description: string;
  model_number?: string;
  price?: number;
  category_id: number;
  stock_status: 'in_stock' | 'out_of_stock';
  is_featured: boolean;
  images: File[];  // 다중 이미지 업로드
}
```

### 2.2 이미지 관리
- **업로드 제한**: 최대 5MB, JPG/PNG만
- **리사이징**: 자동으로 여러 사이즈 생성
- **저장 경로**: `/public/images/{category_code}/`
- **썸네일**: 자동 생성 (200x200, 400x400)

### 2.3 API 엔드포인트
```python
GET /api/admin/products           # 제품 목록 (페이지네이션)
GET /api/admin/products/{id}      # 제품 상세 조회
POST /api/admin/products          # 제품 추가
PUT /api/admin/products/{id}      # 제품 수정
DELETE /api/admin/products/{id}   # 제품 삭제
POST /api/admin/products/{id}/images  # 이미지 업로드
DELETE /api/admin/products/{id}/images/{image_id}  # 이미지 삭제
```

### 2.4 카테고리 관리
```python
GET /api/admin/categories         # 카테고리 목록
POST /api/admin/categories        # 카테고리 추가
PUT /api/admin/categories/{id}    # 카테고리 수정
DELETE /api/admin/categories/{id} # 카테고리 삭제
```

## 📊 Phase 3: 주문 관리

### 3.1 주문 시스템 설계
```sql
-- 새 테이블들
CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    total_amount DECIMAL(10,2),
    shipping_address TEXT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES safety_products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2)
);
```

### 3.2 주문 관리 기능
- **주문 목록**: 상태별 필터링, 날짜 범위 검색
- **주문 상세**: 고객 정보, 주문 상품, 배송 정보
- **상태 변경**: 주문 확인, 배송 처리, 배송 완료
- **주문서 출력**: PDF 생성 기능

### 3.3 고객 관리
- **고객 목록**: 검색, 필터링
- **주문 이력**: 고객별 주문 내역
- **고객 정보 수정**: 연락처, 배송지 관리

## 📈 Phase 4: 대시보드 & 통계

### 4.1 메인 대시보드
- **오늘의 통계**: 방문자, 주문, 매출
- **최근 주문**: 최신 10개 주문
- **인기 제품**: Top 5 제품
- **재고 알림**: 재고 부족 제품 목록

### 4.2 상세 통계
```typescript
interface Statistics {
  sales: {
    daily: number[];
    monthly: number[];
    yearly: number[];
  };
  products: {
    mostViewed: Product[];
    bestSelling: Product[];
    lowStock: Product[];
  };
  customers: {
    newCustomers: number;
    returningCustomers: number;
    totalOrders: number;
  };
}
```

### 4.3 차트 및 그래프
- **매출 추이**: 선 차트 (Chart.js)
- **카테고리별 매출**: 도넛 차트
- **주문 상태별 분포**: 막대 차트

## 🎨 UI/UX 디자인 가이드

### 컬러 팔레트
```css
/* Admin 전용 색상 */
--admin-primary: #1f2937;      /* 진한 회색 */
--admin-secondary: #3b82f6;    /* 파란색 */
--admin-success: #10b981;      /* 초록색 */
--admin-warning: #f59e0b;      /* 주황색 */
--admin-error: #ef4444;        /* 빨간색 */
--admin-bg: #f9fafb;           /* 연한 회색 배경 */
```

### 레이아웃 구조
```
┌─────────────────────────────────────────┐
│ Admin Header (로고, 검색, 사용자 메뉴)    │
├─────────┬───────────────────────────────┤
│         │                               │
│ Side    │                               │
│ bar     │         Main Content          │
│ Menu    │                               │
│         │                               │
└─────────┴───────────────────────────────┘
```

### 주요 컴포넌트
- **DataTable**: 정렬, 필터링, 페이지네이션
- **Modal**: 제품 편집, 확인 다이얼로그
- **ImageUploader**: 드래그앤드롭 이미지 업로드
- **StatusBadge**: 주문/재고 상태 표시

## 🔧 기술 스택

### Frontend 추가 라이브러리
```json
{
  "react-hook-form": "^7.0.0",
  "react-query": "^3.39.0",
  "chart.js": "^4.0.0",
  "react-chartjs-2": "^5.0.0",
  "react-dropzone": "^14.0.0",
  "react-table": "^7.8.0"
}
```

### Backend 추가 패키지
```txt
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
Pillow==10.0.0
```

## 📝 개발 단계별 체크리스트

### Phase 1: 인증 시스템 ✅
- [ ] Admin 사용자 모델 생성
- [ ] JWT 토큰 생성/검증 로직
- [ ] 로그인/로그아웃 API
- [ ] Admin 로그인 페이지
- [ ] 권한 기반 라우트 보호
- [ ] Admin 레이아웃 컴포넌트

### Phase 2: 제품 관리 ✅
- [ ] 제품 CRUD API 개발
- [ ] 이미지 업로드 처리
- [ ] 제품 목록 페이지
- [ ] 제품 편집 폼
- [ ] 카테고리 관리
- [ ] 검색 및 필터링

### Phase 3: 주문 관리 ✅
- [ ] 주문 관련 데이터베이스 모델
- [ ] 주문 관리 API
- [ ] 고객 정보 관리
- [ ] 주문 목록 및 상세 페이지
- [ ] 주문 상태 변경 기능
- [ ] 주문서 PDF 출력

### Phase 4: 대시보드 ✅
- [ ] 통계 데이터 API
- [ ] 대시보드 차트 컴포넌트
- [ ] 실시간 알림 시스템
- [ ] 백업 및 복원 기능

## 🚀 브랜치 전략

```bash
# Phase 1
features/admin-auth → dev → main

# Phase 2  
features/admin-products → dev → main

# Phase 3
features/admin-orders → dev → main

# Phase 4
features/admin-dashboard → dev → main
```

## 🔒 보안 고려사항

1. **SQL Injection 방지**: Parameterized queries 사용
2. **XSS 방지**: 입력 데이터 검증 및 이스케이핑
3. **CSRF 방지**: 토큰 기반 요청 검증
4. **파일 업로드 보안**: 파일 타입 검증, 크기 제한
5. **API 레이트 리미팅**: 과도한 요청 방지

## 📚 참고 문서

- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

> **다음 단계**: `features/admin-auth` 브랜치를 생성하여 인증 시스템부터 개발 시작! 