# API Reference - Boram Safety

## 기본 정보

- **Base URL**: `http://localhost:8000`
- **API 문서**: `http://localhost:8000/docs` (Swagger UI)
- **Content-Type**: `application/json`
- **데이터베이스**: PostgreSQL (localhost:5432/boram_safety)

## API 구조

### Public API (`/api/*`)
- **읽기 전용** 엔드포인트
- 인증 불필요
- 일반 사용자용 제품 조회 및 검색

### Admin API (`/api/admin/*`)
- **모든 CRUD** 작업 허용
- 관리자용 제품/카테고리 관리
- 현재 인증 없음 (추후 JWT 토큰 인증 예정)

---

## Public API Endpoints

### 상태 확인

#### GET /api/health
Public API 상태를 확인합니다.

**Response:**
```json
{
  "status": "healthy",
  "role": "public"
}
```

---

### 카테고리 관련

#### GET /api/categories
카테고리 목록을 조회합니다.

**Query Parameters:**
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 100)

**Response:**
```json
[
  {
    "id": 1,
    "name": "안전모",
    "code": "safety_helmet",
    "slug": "safety-helmet",
    "description": "작업장에서 머리를 보호하는 안전모",
    "image": "/images/categories/safety_helmet.jpg",
    "display_order": 1,
    "image_count": 31,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /api/categories/{category_code}
특정 카테고리를 코드로 조회합니다.

**Parameters:**
- `category_code` (path) - 카테고리 코드 (예: "safety_helmet")

**Response:**
```json
{
  "id": 1,
  "name": "안전모",
  "code": "safety_helmet",
  "slug": "safety-helmet",
  "description": "작업장에서 머리를 보호하는 안전모",
  "image": "/images/categories/safety_helmet.jpg",
  "display_order": 1,
  "image_count": 31,
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

---

### 제품 관련

#### GET /api/products
제품 목록을 조회합니다.

**Query Parameters:**
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 20)
- `category_code` (optional) - 카테고리 코드 필터
- `search` (optional) - 검색어

**Response:**
```json
[
  {
    "id": 1,
    "name": "안전모 모델 93",
    "model_number": "SH-093",
    "category_id": 1,
    "category_code": "safety_helmet",
    "category_name": "안전모",
    "description": "고급 소재로 제작된 안전모",
    "specifications": "재질: ABS, 중량: 350g",
    "price": 25000,
    "stock_status": "in_stock",
    "is_featured": 1,
    "file_name": "safety_helmet_93.jpg",
    "file_path": "/static/images/safety_helmet/img_93.jpg",
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /api/products/by-category/{category_code}
카테고리별 제품 목록을 조회합니다.

**Parameters:**
- `category_code` (path) - 카테고리 코드

**Query Parameters:**
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 20)

**Response:**
```json
[
  {
    "id": 1,
    "name": "안전모 모델 93",
    "model_number": "SH-093",
    "category_id": 1,
    "category_code": "safety_helmet",
    "category_name": "안전모",
    "description": "고급 소재로 제작된 안전모",
    "price": 25000,
    "stock_status": "in_stock",
    "is_featured": 1,
    "file_path": "/static/images/safety_helmet/img_93.jpg"
  }
]
```

#### GET /api/products/search
제품을 검색합니다.

**Query Parameters:**
- `q` (required) - 검색어
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 20)

#### GET /api/products/{product_id}
특정 제품의 상세 정보를 조회합니다.

**Parameters:**
- `product_id` (path) - 제품 ID

#### GET /api/search/suggestions
검색 제안을 제공합니다.

**Query Parameters:**
- `q` (required) - 검색어
- `limit` (optional) - 제한 개수 (기본값: 5)

**Response:**
```json
{
  "suggestions": ["안전모 모델 93", "안전모 모델 92", "안전모 모델 90"]
}
```

---

## Admin API Endpoints

### 상태 확인

#### GET /api/admin/health
Admin API 상태를 확인합니다.

**Response:**
```json
{
  "status": "healthy",
  "role": "admin"
}
```

#### GET /api/admin/dashboard
관리자 대시보드 정보를 반환합니다.

**Response:**
```json
{
  "message": "관리자 대시보드에 오신 것을 환영합니다",
  "status": "authenticated",
  "stats": {
    "total_products": 254,
    "total_categories": 11,
    "featured_products": 50,
    "total_images": 254
  }
}
```

---

### 이미지 업로드

#### POST /api/admin/upload-image
제품 이미지를 업로드합니다.

**Request:** `multipart/form-data`
- `file` - 이미지 파일 (.jpg, .jpeg, .png, .gif)

**Response:**
```json
{
  "url": "/images/unique_filename.jpg",
  "filename": "unique_filename.jpg"
}
```

---

### 카테고리 관리

#### GET /api/admin/categories
카테고리 목록을 조회합니다.

**Query Parameters:**
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 1000)

#### GET /api/admin/categories/{category_id}
특정 카테고리를 조회합니다.

#### POST /api/admin/categories
새로운 카테고리를 생성합니다.

**Request Body:**
```json
{
  "name": "새 카테고리",
  "code": "new_category",
  "slug": "new-category",
  "description": "새 카테고리 설명",
  "display_order": 1
}
```

#### PUT /api/admin/categories/{category_id}
카테고리 정보를 수정합니다.

#### DELETE /api/admin/categories/{category_id}
카테고리를 삭제합니다.

---

### 제품 관리

#### GET /api/admin/products
제품 목록을 조회합니다 (카테고리 정보 포함).

**Query Parameters:**
- `skip` (optional) - 건너뛸 개수 (기본값: 0)
- `limit` (optional) - 제한 개수 (기본값: 1000)
- `category_code` (optional) - 카테고리 코드 필터
- `search` (optional) - 검색어

**Response:**
```json
[
  {
    "id": 1,
    "name": "안전모 모델 93",
    "model_number": "SH-093",
    "category_id": 1,
    "category_code": "safety_helmet",
    "category_name": "안전모",
    "description": "고급 소재로 제작된 안전모",
    "specifications": "재질: ABS, 중량: 350g",
    "price": 25000,
    "stock_status": "in_stock",
    "is_featured": 1,
    "file_name": "safety_helmet_93.jpg",
    "file_path": "/static/images/safety_helmet/img_93.jpg",
    "display_order": 1,
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /api/admin/products/{product_id}
특정 제품을 조회합니다.

#### POST /api/admin/products
새로운 제품을 추가합니다.

**Request Body:**
```json
{
  "name": "새 제품",
  "model_number": "NEW-001",
  "category_id": 1,
  "description": "새 제품 설명",
  "specifications": "제품 사양",
  "price": 30000,
  "stock_status": "in_stock",
  "is_featured": 0,
  "display_order": 1
}
```

#### PUT /api/admin/products/{product_id}
기존 제품 정보를 수정합니다.

#### DELETE /api/admin/products/{product_id}
제품을 삭제합니다.

---

## 데이터 모델

### SafetyCategory
```typescript
interface SafetyCategory {
  id: number;
  name: string;
  code: string;
  slug: string;
  description?: string;
  image?: string;
  display_order: number;
  image_count?: number;
  created_at: string;
  updated_at?: string;
}
```

### SafetyProduct (Response)
```typescript
interface SafetyProduct {
  id: number;
  name: string;
  model_number: string;
  category_id: number;
  category_code?: string;    // JOIN된 카테고리 정보
  category_name?: string;    // JOIN된 카테고리 정보
  description?: string;
  specifications?: string;
  price?: number;
  stock_status: string;      // "in_stock", "out_of_stock" 등
  is_featured: number;       // 0 또는 1
  file_name?: string;
  file_path?: string;
  display_order: number;
  created_at: string;
  updated_at?: string;
}
```

### ProductCreate
```typescript
interface ProductCreate {
  name: string;
  model_number: string;
  category_id: number;
  description?: string;
  specifications?: string;
  price?: number;
  stock_status?: string;     // 기본값: "재고있음"
  is_featured?: number;      // 기본값: 0
  display_order?: number;    // 기본값: 0
}
```

### ProductUpdate
```typescript
interface ProductUpdate {
  name?: string;
  model_number?: string;
  category_id?: number;
  description?: string;
  specifications?: string;
  price?: number;
  stock_status?: string;
  is_featured?: number;
  display_order?: number;
}
```

---

## 오류 처리

API는 일관된 오류 응답 형식을 사용합니다:

```json
{
  "detail": "오류 메시지"
}
```

### 주요 오류 코드

- `400 Bad Request` - 잘못된 요청 매개변수
- `404 Not Found` - 요청한 리소스를 찾을 수 없음
- `422 Unprocessable Entity` - 데이터 검증 실패
- `500 Internal Server Error` - 서버 내부 오류

---

## 주요 변경사항 (v1.2)

### ✅ 구현 완료
- **Admin API**: 모든 CRUD 작업 지원
- **카테고리 연동**: 제품 조회 시 카테고리 정보 포함
- **PostgreSQL**: SQLite에서 PostgreSQL로 마이그레이션
- **이미지 처리**: 이미지 경로 변환 및 카테고리 이미지 정리
- **검색 기능**: 제품명, 모델번호, 설명 기반 검색

### 🔄 필드 변경사항
- `model` → `model_number`로 통일
- `manufacturer` 필드 제거 (모델에 없음)
- 카테고리 정보 추가: `category_code`, `category_name`

---

> **참고**: 이 문서는 현재 구현된 API (v1.2)를 기준으로 작성되었습니다. JWT 인증 및 추가 기능은 다음 버전에서 구현될 예정입니다. 