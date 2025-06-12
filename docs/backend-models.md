# Backend Models - Boram Safety

## 데이터베이스

- **엔진**: PostgreSQL 14+
- **호스트**: localhost:5432
- **데이터베이스**: boram_safety
- **ORM**: SQLAlchemy

## 모델 구조

### SafetyCategory

카테고리 정보를 저장하는 모델입니다.

```python
class SafetyCategory(Base):
    __tablename__ = "safety_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)           # 카테고리 이름
    code = Column(String(50), nullable=False, unique=True)  # 카테고리 코드
    slug = Column(String(50), nullable=False, unique=True)  # URL용 slug
    description = Column(Text)                           # 카테고리 설명
    image = Column(String(500))                          # 대표 이미지 경로
    display_order = Column(Integer, default=0)           # 표시 순서
    image_count = Column(Integer, default=0)             # 이미지 개수
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

**필드 설명:**
- `id`: 기본 키
- `name`: 카테고리 이름 (예: "안전모", "안전장갑")
- `code`: 카테고리 코드 (예: "safety_helmet", "safety_gloves")
- `slug`: URL용 슬러그 (예: "safety-helmet")
- `description`: 카테고리 설명
- `image`: 카테고리 대표 이미지 경로
- `display_order`: 화면 표시 순서
- `image_count`: 해당 카테고리의 이미지 개수
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

---

### SafetyProduct

제품 정보를 저장하는 모델입니다.

```python
class SafetyProduct(Base):
    __tablename__ = "safety_products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("safety_categories.id", ondelete="CASCADE"), nullable=False)
    
    # 제품 정보
    name = Column(String(200), nullable=False)           # 제품명
    model_number = Column(String(100))                   # 모델 번호
    price = Column(Float)                                # 가격
    description = Column(Text)                           # 제품 설명
    specifications = Column(Text)                        # 제품 사양 (JSON 형태)
    stock_status = Column(String(50), default="in_stock")  # 재고 상태
    
    # 이미지 정보
    file_name = Column(String(255), nullable=False)     # 파일명
    file_path = Column(String(500), nullable=False)     # 파일 경로
    
    # 메타 정보
    display_order = Column(Integer, default=0)          # 표시 순서
    is_featured = Column(Integer, default=0)            # 추천 제품 여부 (0: 일반, 1: 추천)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

**필드 설명:**
- `id`: 기본 키
- `category_id`: 카테고리 외래 키 (safety_categories.id 참조)
- `name`: 제품명 (예: "안전모 모델 93")
- `model_number`: 모델 번호 (예: "SH-093")
- `price`: 제품 가격
- `description`: 제품 설명
- `specifications`: 제품 사양 (JSON 문자열로 저장)
- `stock_status`: 재고 상태 ("in_stock", "out_of_stock" 등)
- `file_name`: 이미지 파일명
- `file_path`: 이미지 파일 경로 (예: "/static/images/safety_helmet/img_93.jpg")
- `display_order`: 화면 표시 순서
- `is_featured`: 추천 제품 여부 (0 또는 1)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

---

## 관계 (Relationships)

### SafetyCategory ↔ SafetyProduct
- **관계**: One-to-Many (1:N)
- **외래 키**: `safety_products.category_id` → `safety_categories.id`
- **연쇄 삭제**: CASCADE (카테고리 삭제 시 해당 제품들도 함께 삭제)

---

## 인덱스

### SafetyCategory
- `id` (Primary Key, 자동 인덱스)
- `code` (Unique 인덱스)
- `slug` (Unique 인덱스)

### SafetyProduct
- `id` (Primary Key, 자동 인덱스)
- `category_id` (외래 키 인덱스)

---

## 데이터 예시

### SafetyCategory 데이터
```sql
INSERT INTO safety_categories (id, name, code, slug, description, display_order) VALUES
(1, '안전모', 'safety_helmet', 'safety-helmet', '작업장에서 머리를 보호하는 안전모', 1),
(2, '안전장갑', 'safety_gloves', 'safety-gloves', '손을 보호하는 안전장갑', 2),
(3, '안전화', 'safety_boots', 'safety-boots', '발을 보호하는 안전화', 3);
```

### SafetyProduct 데이터
```sql
INSERT INTO safety_products (id, category_id, name, model_number, price, description, file_name, file_path, is_featured) VALUES
(1, 1, '안전모 모델 93', 'SH-093', 25000, '고급 소재로 제작된 안전모', 'safety_helmet_93.jpg', '/static/images/safety_helmet/img_93.jpg', 1),
(2, 1, '안전모 모델 92', 'SH-092', 26000, '경량형 안전모', 'safety_helmet_92.jpg', '/static/images/safety_helmet/img_92.jpg', 0);
```

---

## 주요 변경사항 (v1.2)

### ✅ 업데이트된 필드
- **SafetyProduct**: `manufacturer` 필드 제거 (모델에 존재하지 않음)
- **필드명 통일**: API에서 `model` → `model_number`로 표준화
- **카테고리 연동**: JOIN 쿼리로 `category_code`, `category_name` 정보 제공

### 🗄️ 데이터베이스 마이그레이션
- **SQLite** → **PostgreSQL**로 마이그레이션 완료
- 모든 기존 데이터 보존
- 성능 및 동시성 향상

### 📊 현재 데이터 현황
- **카테고리**: 11개 (안전모, 안전장갑, 안전화 등)
- **제품**: 254개
- **추천 제품**: 약 50개

---

## 쿼리 예시

### 카테고리별 제품 조회 (JOIN)
```sql
SELECT 
    p.id, 
    p.name, 
    p.model_number,
    p.price,
    c.code as category_code,
    c.name as category_name
FROM safety_products p
JOIN safety_categories c ON p.category_id = c.id
WHERE c.code = 'safety_helmet'
ORDER BY p.display_order, p.id;
```

### 추천 제품 조회
```sql
SELECT 
    p.id,
    p.name,
    p.model_number,
    p.price,
    c.name as category_name
FROM safety_products p
JOIN safety_categories c ON p.category_id = c.id
WHERE p.is_featured = 1
ORDER BY p.display_order;
```

---

> **참고**: 이 문서는 현재 구현된 모델 구조 (v1.2)를 기준으로 작성되었습니다. 추후 기능 확장 시 업데이트될 예정입니다. 