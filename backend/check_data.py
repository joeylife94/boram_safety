from database import SessionLocal
from models.safety import SafetyCategory, SafetyProduct

def check_data():
    db = SessionLocal()
    try:
        # 카테고리 확인
        categories = db.query(SafetyCategory).all()
        print(f"📊 카테고리 수: {len(categories)}")
        for c in categories:
            print(f"  - {c.name} ({c.code}) - 이미지: {c.image}")
        
        # 제품 확인
        products = db.query(SafetyProduct).all()
        print(f"\n📦 제품 수: {len(products)}")
        if products:
            print(f"  첫 번째 제품: {products[0].name} (카테고리 ID: {products[0].category_id})")
        
    finally:
        db.close()

if __name__ == "__main__":
    check_data() 