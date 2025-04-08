from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# PostgreSQL database URL using environment variables with fallback
POSTGRES_USER = os.getenv("POSTGRES_USER", "neondb_owner")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "npg_z1xhaVPNv0Rq")
POSTGRES_SERVER = os.getenv("POSTGRES_SERVER", "ep-wispy-sunset-a143i16t-pooler.ap-southeast-1.aws.neon.tech")
POSTGRES_DB = os.getenv("POSTGRES_DB", "neondb")

# Build connection string with SSL mode required for cloud databases
SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}/{POSTGRES_DB}?sslmode=require"

# Create SQLAlchemy engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
