from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

# Explicit DB Configuration
DB_HOST = "ms1901.gabiadb.com"
DB_PORT = "1433"
DB_USER = "prowiz"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "institute"

encoded_password = quote_plus(DB_PASSWORD)

# Connection String
# Note: charset is handled in connect_args
SQLALCHEMY_DATABASE_URL = f"mssql+pymssql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# echo=True will show SQL in terminal for debugging
# Explicitly adding charset='UTF-8' as requested
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={'charset': 'CP949'}, 
    echo=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
