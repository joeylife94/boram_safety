from database import SessionLocal, engine, Base
from models.safety import SafetyCategory, SafetyProduct
from datetime import datetime
import os
import glob
import re

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 카테고리 더미 데이터
categories_data = [
    {
        "name": "안전모",
        "code": "safety_helmet",
        "slug": "safety_helmet",
        "description": "머리 보호를 위한 다양한 안전모",
        "image": "/static/images/safety_helmet/img_93.jpg",
        "display_order": 1,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "안전장갑",
        "code": "safety_gloves", 
        "slug": "safety_gloves",
        "description": "손을 보호하는 다양한 안전장갑",
        "image": "/static/images/safety_gloves/img_37.jpg",
        "display_order": 2,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "안전화",
        "code": "safety_boots",
        "slug": "safety_boots", 
        "description": "발과 발목을 보호하는 안전화",
        "image": "/static/images/safety_boots/img_1.jpg",
        "display_order": 3,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "안전벨트",
        "code": "safety_belt",
        "slug": "safety_belt",
        "description": "고소작업용 안전벨트 및 하네스",
        "image": "/static/images/safety_belt/img_1.jpg",
        "display_order": 4,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "호흡보호구",
        "code": "respiratory_protection",
        "slug": "respiratory_protection",
        "description": "유해물질 차단 마스크 및 보호구",
        "image": "/static/images/respiratory_protection/img_1.jpg",
        "display_order": 5,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "보호복",
        "code": "protective_clothing",
        "slug": "protective_clothing",
        "description": "화학물질 및 열로부터 신체를 보호하는 보호복",
        "image": "/static/images/protective_clothing/img_1.jpg",
        "display_order": 6,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "근골격계 보호구",
        "code": "musculoskeletal_protection",
        "slug": "musculoskeletal_protection",
        "description": "허리, 무릎 등 근골격계 부상 방지 보호구",
        "image": "/static/images/musculoskeletal_protection/img_1.jpg",
        "display_order": 7,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "다리 보호구",
        "code": "leg_protection",
        "slug": "leg_protection",
        "description": "다리와 정강이를 보호하는 안전용품",
        "image": "/static/images/leg_protection/img_1.jpg",
        "display_order": 8,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "청력 보호구",
        "code": "hearing_protection",
        "slug": "hearing_protection",
        "description": "소음으로부터 청력을 보호하는 귀마개 및 헤드폰",
        "image": "/static/images/hearing_protection/img_1.jpg",
        "display_order": 9,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "안면 보호구",
        "code": "face_protection",
        "slug": "face_protection",
        "description": "얼굴과 눈을 보호하는 안전안경 및 마스크",
        "image": "/static/images/face_protection/img_1.jpg",
        "display_order": 10,
        "image_count": 0,  # 자동 계산됨
    },
    {
        "name": "기타 안전용품",
        "code": "others",
        "slug": "others",
        "description": "다양한 산업 현장용 안전용품",
        "image": "/static/images/others/img_1.jpg",
        "display_order": 11,
        "image_count": 0,  # 자동 계산됨
    },
]

def get_image_files(category_code):
    """특정 카테고리의 실제 이미지 파일들을 스캔"""
    try:
        image_dir = f"backend/static/images/{category_code}"
        if not os.path.exists(image_dir):
            print(f"⚠️  이미지 디렉토리가 없습니다: {image_dir}")
            return []
        
        # img_*.jpg 패턴의 파일들 찾기
        pattern = os.path.join(image_dir, "img_*.jpg")
        image_files = glob.glob(pattern)
        
        # 파일명에서 숫자 추출하여 정렬
        def extract_number(filepath):
            filename = os.path.basename(filepath)
            match = re.search(r'img_(\d+)\.jpg', filename)
            return int(match.group(1)) if match else 0
        
        image_files.sort(key=extract_number, reverse=True)  # 큰 번호부터
        
        print(f"📁 {category_code}: {len(image_files)}개 이미지 파일 발견")
        for img_file in image_files[:5]:  # 처음 5개만 표시
            print(f"   - {os.path.basename(img_file)}")
        if len(image_files) > 5:
            print(f"   ... 외 {len(image_files) - 5}개")
            
        return image_files
        
    except Exception as e:
        print(f"❌ {category_code} 이미지 스캔 중 오류: {e}")
        return []

def create_dummy_categories():
    """카테고리 더미 데이터 생성"""
    db = SessionLocal()
    try:
        # 기존 데이터 삭제
        db.query(SafetyCategory).delete()
        db.commit()
        
        # 새 카테고리 데이터 추가
        for category_data in categories_data:
            # 실제 이미지 파일 개수 계산
            image_files = get_image_files(category_data["code"])
            category_data["image_count"] = len(image_files)
            
            # 대표 이미지 설정 (첫 번째 이미지가 있다면)
            if image_files:
                first_image = os.path.basename(image_files[0])
                category_data["image"] = f"/static/images/{category_data['code']}/{first_image}"
            
            category = SafetyCategory(**category_data)
            db.add(category)
        
        db.commit()
        print("✅ 카테고리 더미 데이터가 성공적으로 생성되었습니다!")
        return True
    except Exception as e:
        print(f"❌ 카테고리 더미 데이터 생성 중 오류 발생: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_dummy_products():
    """제품 더미 데이터 생성 (실제 이미지 파일 기반)"""
    db = SessionLocal()
    try:
        # 기존 제품 데이터 삭제
        db.query(SafetyProduct).delete()
        
        # 카테고리별 제품 생성
        categories = db.query(SafetyCategory).all()
        
        # 카테고리별 제품 기본 정보
        category_info = {
            "safety_helmet": {
                "name_prefix": "안전모",
                "model_prefix": "SH",
                "base_price": 25000,
                "price_increment": 1000,
                "description_template": "고품질 안전모 모델 {}번. 충격 흡수력이 뛰어나며 편안한 착용감을 제공합니다.",
                "specifications": '{"재질": "ABS 수지", "중량": "450g", "크기": "52-62cm", "색상": "흰색, 노란색, 파란색"}'
            },
            "safety_gloves": {
                "name_prefix": "안전장갑",
                "model_prefix": "SG",
                "base_price": 8000,
                "price_increment": 500,
                "description_template": "내구성이 뛰어난 안전장갑 모델 {}번. 손의 보호와 작업 편의성을 모두 고려했습니다.",
                "specifications": '{"재질": "니트릴 코팅", "사이즈": "M, L, XL", "색상": "검정, 회색", "용도": "일반작업용"}'
            },
            "safety_boots": {
                "name_prefix": "안전화",
                "model_prefix": "SB",
                "base_price": 60000,
                "price_increment": 2000,
                "description_template": "발과 발목을 안전하게 보호하는 안전화 모델 {}번. 미끄럼 방지와 충격 보호 기능을 제공합니다.",
                "specifications": '{"재질": "가죽", "사이즈": "230mm-280mm", "색상": "검정, 갈색", "용도": "건설현장용"}'
            }
        }
        
        total_products_created = 0
        
        for category in categories:
            # 실제 이미지 파일들 가져오기
            image_files = get_image_files(category.code)
            
            if not image_files:
                print(f"⚠️  {category.name}: 이미지 파일이 없어 제품을 생성하지 않습니다.")
                continue
            
            # 카테고리 정보 가져오기 (기본값 설정)
            info = category_info.get(category.code, {
                "name_prefix": category.name,
                "model_prefix": category.code.upper()[:2],
                "base_price": 15000,
                "price_increment": 1000,
                "description_template": f"고품질 {category.name} 모델 {{}}번. 작업 현장에서 안전을 보장합니다.",
                "specifications": '{"재질": "고급 소재", "용도": "산업현장용"}'
            })
            
            # 각 이미지 파일에 대해 제품 생성
            for i, image_file in enumerate(image_files):
                # 파일명에서 숫자 추출
                filename = os.path.basename(image_file)
                match = re.search(r'img_(\d+)\.jpg', filename)
                img_number = match.group(1) if match else str(i + 1)
                
                product = SafetyProduct(
                    category_id=category.id,
                    name=f"{info['name_prefix']} 모델 {img_number}",
                    model_number=f"{info['model_prefix']}-{img_number:0>3}",
                    price=info['base_price'] + (i * info['price_increment']),
                    description=info['description_template'].format(img_number),
                    specifications=info['specifications'],
                    stock_status="in_stock",
                    file_name=filename,
                    file_path=f"/static/images/{category.code}/{filename}",
                    display_order=i + 1,
                    is_featured=1 if i < 3 else 0  # 처음 3개는 추천 제품
                )
                db.add(product)
                total_products_created += 1
            
            print(f"✅ {category.name}: {len(image_files)}개 제품 생성 완료")
        
        db.commit()
        print(f"🎉 총 {total_products_created}개 제품 더미 데이터가 성공적으로 생성되었습니다!")
        return True
    except Exception as e:
        print(f"❌ 제품 더미 데이터 생성 중 오류 발생: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_all_dummy_data():
    """모든 더미 데이터 생성"""
    print("🚀 실제 이미지 파일 기반 더미 데이터 생성을 시작합니다...")
    
    # 카테고리 생성
    if create_dummy_categories():
        print("✅ 카테고리 데이터 생성 완료")
    else:
        print("❌ 카테고리 데이터 생성 실패")
        return
    
    # 제품 생성
    if create_dummy_products():
        print("✅ 제품 데이터 생성 완료")
    else:
        print("❌ 제품 데이터 생성 실패")
        return
    
    print("🎉 모든 더미 데이터 생성이 완료되었습니다!")

if __name__ == "__main__":
    create_all_dummy_data() 