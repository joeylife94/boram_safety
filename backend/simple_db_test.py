"""
간단한 PostgreSQL 연결 테스트 (psycopg2 의존성 없음)
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# 프로젝트 루트를 파이썬 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

def test_database():
    """데이터베이스 연결 및 테이블 초기화"""
    print("🔍 데이터베이스 연결 테스트...")
    
    # 환경변수 확인
    print(f"DB_USER: {os.getenv('DB_USER', 'postgres')}")
    print(f"DB_HOST: {os.getenv('DB_HOST', 'localhost')}")
    print(f"DB_NAME: {os.getenv('DB_NAME', 'boram_safety')}")
    print(f"DB_PORT: {os.getenv('DB_PORT', '5432')}")
    
    # 연결 URL 생성
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "ava1142")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "boram_safety")
    DB_PORT = os.getenv("DB_PORT", "5432")
    
    SQLALCHEMY_DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    print(f"연결 URL: {SQLALCHEMY_DATABASE_URL}")
    
    try:
        # 엔진 생성
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        
        # 연결 테스트
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ PostgreSQL 연결 성공!")
            print(f"버전: {version[:50]}...")
            
            # 현재 데이터베이스 확인
            result = connection.execute(text("SELECT current_database()"))
            current_db = result.fetchone()[0]
            print(f"현재 데이터베이스: {current_db}")
            
            # 기존 테이블 확인
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.fetchall()
            print(f"기존 테이블 개수: {len(tables)}")
            for table in tables:
                print(f"  - {table[0]}")
            
            # 모든 테이블 삭제
            print("\n🗑️  기존 테이블 삭제 중...")
            if tables:
                for table in tables:
                    connection.execute(text(f"DROP TABLE IF EXISTS {table[0]} CASCADE"))
                    print(f"  ❌ {table[0]} 삭제됨")
                connection.commit()
                print("✅ 모든 테이블 삭제 완료!")
            else:
                print("삭제할 테이블이 없습니다.")
            
            # 새 테이블 생성
            print("\n🏗️  새 테이블 생성 중...")
            try:
                from backend.models.safety import SafetyCategory, SafetyProduct
                from backend.database import Base
            except ImportError:
                # backend 모듈을 찾을 수 없는 경우, 현재 디렉토리에서 직접 import
                import sys
                backend_path = os.path.join(os.path.dirname(__file__))
                sys.path.insert(0, backend_path)
                
                from database import Base
                from models.safety import SafetyCategory, SafetyProduct
            
            Base.metadata.create_all(bind=engine)
            
            # 생성된 테이블 확인
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            new_tables = result.fetchall()
            print(f"✅ {len(new_tables)}개 테이블 생성 완료:")
            for table in new_tables:
                print(f"  ✅ {table[0]}")
            
        return True
        
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 PostgreSQL 데이터베이스 초기화")
    print("=" * 60)
    
    if test_database():
        print("\n🎉 데이터베이스 초기화 완료!")
        print("이제 더미 데이터를 넣을 수 있습니다.")
    else:
        print("\n❌ 데이터베이스 초기화 실패!") 