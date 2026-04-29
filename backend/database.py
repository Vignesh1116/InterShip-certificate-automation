from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Use environment variable for production (e.g. Aiven PostgreSQL)
# Fallback to local SQLite if not provided
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(BASE_DIR, 'test.db')
    DATABASE_URL = f"sqlite:///{db_path}"
    print(f"DATABASE: Using SQLite at {db_path}")

# PostgreSQL requires different connect_args than SQLite
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # For Aiven/Postgres, ensure sslmode is handled if needed (usually in the string)
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()