"""
PostgreSQL 데이터베이스 연결 테스트 스크립트
"""
import os
from dotenv import load_dotenv
import psycopg2
from sqlalchemy import create_engine, text
from backend.database import SQLALCHEMY_DATABASE_URL, engine

# Load environment variables
load_dotenv()

def test_postgres_connection():
    """PostgreSQL 연결 테스트"""
    print("🔍 PostgreSQL 연결 테스트를 시작합니다...")
    print(f"📋 연결 URL: {SQLALCHEMY_DATABASE_URL}")
    
    # 환경변수 확인
    print("\n📋 환경변수 확인:")
    print(f"DB_USER: {os.getenv('DB_USER', 'postgres')}")
    print(f"DB_PASSWORD: {'*' * len(os.getenv('DB_PASSWORD', 'ava1142'))}")
    print(f"DB_HOST: {os.getenv('DB_HOST', 'localhost')}")
    print(f"DB_NAME: {os.getenv('DB_NAME', 'boram_safety')}")
    print(f"DB_PORT: {os.getenv('DB_PORT', '5432')}")
    
    try:
        # SQLAlchemy 엔진으로 연결 테스트
        print("\n🔗 SQLAlchemy 엔진으로 연결 테스트...")
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ 연결 성공! PostgreSQL 버전: {version}")
            
            # 현재 데이터베이스 확인
            result = connection.execute(text("SELECT current_database()"))
            current_db = result.fetchone()[0]
            print(f"📊 현재 데이터베이스: {current_db}")
            
            # 기존 테이블 확인
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.fetchall()
            print(f"🗃️  기존 테이블 개수: {len(tables)}")
            for table in tables:
                print(f"   - {table[0]}")
                
        return True
        
    except Exception as e:
        print(f"❌ 연결 실패: {e}")
        return False

def drop_all_tables():
    """모든 테이블 삭제"""
    print("\n🗑️  모든 테이블을 삭제합니다...")
    try:
        with engine.connect() as connection:
            # 외래 키 제약 조건 비활성화
            connection.execute(text("SET session_replication_role = replica;"))
            
            # 모든 테이블 목록 가져오기
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [table[0] for table in result.fetchall()]
            
            # 각 테이블 삭제
            for table in tables:
                connection.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                print(f"   ❌ {table} 테이블 삭제됨")
            
            # 외래 키 제약 조건 활성화
            connection.execute(text("SET session_replication_role = DEFAULT;"))
            connection.commit()
            
        print("✅ 모든 테이블이 삭제되었습니다!")
        return True
    except Exception as e:
        print(f"❌ 테이블 삭제 실패: {e}")
        return False

def create_fresh_tables():
    """새로운 테이블 생성"""
    print("\n🏗️  새로운 테이블을 생성합니다...")
    try:
        from backend.database import Base
        Base.metadata.create_all(bind=engine)
        print("✅ 테이블이 성공적으로 생성되었습니다!")
        
        # 생성된 테이블 확인
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = result.fetchall()
            print(f"🗃️  생성된 테이블 개수: {len(tables)}")
            for table in tables:
                print(f"   ✅ {table[0]}")
        
        return True
    except Exception as e:
        print(f"❌ 테이블 생성 실패: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 PostgreSQL 데이터베이스 재설정 도구")
    print("=" * 50)
    
    # 1. 연결 테스트
    if not test_postgres_connection():
        print("❌ 데이터베이스 연결에 실패했습니다. 설정을 확인해주세요.")
        exit(1)
    
    # 2. 기존 테이블 삭제
    user_input = input("\n🤔 기존 테이블을 모두 삭제하시겠습니까? (y/N): ")
    if user_input.lower() in ['y', 'yes']:
        if not drop_all_tables():
            print("❌ 테이블 삭제에 실패했습니다.")
            exit(1)
    
    # 3. 새 테이블 생성
    if not create_fresh_tables():
        print("❌ 테이블 생성에 실패했습니다.")
        exit(1)
    
    print("\n🎉 데이터베이스 재설정이 완료되었습니다!")
    print("이제 더미 데이터를 생성할 수 있습니다: python -m backend.dummy_data") 