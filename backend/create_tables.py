from backend.database import Base, engine
from backend.models.safety import SafetyCategory, SafetyProduct

from backend.models.company import CompanyInfo, History, Certification, Client

print("Creating database tables...")

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tables created successfully!") 