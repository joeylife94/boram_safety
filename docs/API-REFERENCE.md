# API Reference - Boram Safety

## 기본 정보

- **Base URL**: `http://localhost:8000`
- **API 문서**: `http://localhost:8000/docs` (Swagger UI)
- **Content-Type**: `application/json`

## 인증

현재 API는 인증 없이 사용 가능합니다. (Admin 기능 추가 시 JWT 토큰 인증 예정)

## 엔드포인트 목록

### 카테고리 관련

#### GET /api/categories
제품 카테고리 목록을 반환합니다.

**Response:**
```json
[
  {
    "id": 1,
    "code": "safety_helmet",
    "name": "안전모",
    "description": "작업장에서 머리를 보호하는 안전모",
    "image_path": "safety_helmet/img_9.jpg"
  }
]
```

**Status Codes:**
- `200` - 성공
- `500` - 서버 오류

---

### 제품 관련

#### GET /api/products/{category_code}
특정 카테고리의 제품 목록을 반환합니다.

**Parameters:**
- `category_code` (path) - 카테고리 코드 (예: "safety_helmet")

**Response:**
```json
[
  {
    "id": 1,
    "name": "프리미엄 안전모",
    "description": "고급 소재로 제작된 안전모",
    "model_number": "SH-001",
    "price": 25000,
    "stock_status": "in_stock",
    "is_featured": 1,
    "file_path": "safety_helmet/img_9.jpg",
    "category_code": "safety_helmet"
  }
]
```

**Status Codes:**
- `200` - 성공
- `404` - 카테고리를 찾을 수 없음
- `500` - 서버 오류

---

#### GET /api/products/{category_code}/{product_id}
특정 제품의 상세 정보를 반환합니다.

**Parameters:**
- `category_code` (path) - 카테고리 코드
- `product_id` (path) - 제품 ID

**Response:**
```json
{
  "id": 1,
  "name": "프리미엄 안전모",
  "description": "고급 소재로 제작된 안전모입니다. 충격 흡수력이 뛰어나며 장시간 착용해도 편안합니다.",
  "model_number": "SH-001",
  "price": 25000,
  "stock_status": "in_stock",
  "is_featured": 1,
  "file_path": "safety_helmet/img_9.jpg",
  "category_code": "safety_helmet"
}
```

**Status Codes:**
- `200` - 성공
- `404` - 제품을 찾을 수 없음
- `500` - 서버 오류

---

### 검색 관련

#### GET /api/search
고급 검색 및 필터링 기능을 제공합니다.

**Query Parameters:**
- `query` (optional) - 검색어
- `category_code` (optional) - 카테고리 필터
- `min_price` (optional) - 최소 가격
- `max_price` (optional) - 최대 가격
- `stock_status` (optional) - 재고 상태 ("in_stock" | "out_of_stock")
- `is_featured` (optional) - 추천 제품 여부 (boolean)
- `sort_by` (optional) - 정렬 기준 ("name" | "price_asc" | "price_desc" | "featured")
- `limit` (optional) - 결과 개수 제한 (기본값: 50)

**Example Request:**
```
GET /api/search?query=안전모&category_code=safety_helmet&min_price=10000&max_price=50000&sort_by=price_asc&limit=20
```

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "기본 안전모",
      "description": "기본형 안전모",
      "model_number": "SH-002",
      "price": 15000,
      "stock_status": "in_stock",
      "is_featured": 0,
      "file_path": "safety_helmet/img_11.jpg",
      "category_code": "safety_helmet"
    }
  ],
  "total_count": 25
}
```

**Status Codes:**
- `200` - 성공
- `400` - 잘못된 매개변수
- `500` - 서버 오류

---

#### GET /api/search/suggestions
실시간 검색 제안을 제공합니다.

**Query Parameters:**
- `query` (required) - 검색어 (최소 2글자)
- `limit` (optional) - 제안 개수 (기본값: 5)

**Example Request:**
```
GET /api/search/suggestions?query=안전&limit=5
```

**Response:**
```json
{
  "suggestions": [
    {
      "id": 1,
      "name": "프리미엄 안전모",
      "category_code": "safety_helmet",
      "image_path": "safety_helmet/img_9.jpg",
      "url": "/products/safety_helmet/1"
    }
  ]
}
```

**Status Codes:**
- `200` - 성공
- `400` - 검색어가 너무 짧음
- `500` - 서버 오류

---

## 데이터 모델

### SafetyCategory
```typescript
interface SafetyCategory {
  id: number;
  code: string;
  name: string;
  description: string;
  image_path?: string;
}
```

### SafetyProduct
```typescript
interface SafetyProduct {
  id: number;
  name: string;
  description: string;
  model_number?: string;
  price?: number;
  stock_status: "in_stock" | "out_of_stock";
  is_featured: 0 | 1;
  file_path?: string;
  category_code: string;
}
```

### SearchParams
```typescript
interface SearchParams {
  query?: string;
  category_code?: string;
  min_price?: number;
  max_price?: number;
  stock_status?: "in_stock" | "out_of_stock";
  is_featured?: boolean;
  sort_by?: "name" | "price_asc" | "price_desc" | "featured";
  limit?: number;
}
```

### SearchResult
```typescript
interface SearchResult {
  products: SafetyProduct[];
  total_count: number;
}
```

### SearchSuggestion
```typescript
interface SearchSuggestion {
  id: number;
  name: string;
  category_code: string;
  image_path?: string;
  url: string;
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

## 다음 버전 예정 기능

### Admin API (v2.0)
- `POST /api/admin/login` - 관리자 로그인
- `GET /api/admin/products` - 제품 관리
- `POST /api/admin/products` - 제품 추가
- `PUT /api/admin/products/{id}` - 제품 수정
- `DELETE /api/admin/products/{id}` - 제품 삭제

### 주문 API (v2.1)
- `POST /api/orders` - 주문 생성
- `GET /api/orders/{id}` - 주문 조회
- `PUT /api/orders/{id}` - 주문 상태 변경

---

> **참고**: 이 문서는 현재 구현된 API를 기준으로 작성되었습니다. Admin 기능 추가 시 업데이트될 예정입니다. 