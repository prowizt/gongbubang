import sys
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Force load .env
load_dotenv()

DB_HOST = "ms1901.gabiadb.com"
DB_PORT = "1433"
DB_USER = "prowiz"
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = "institute"

# Use raw pymssql string for verifying driver works without SQLAlchemy first, 
# then verify SQLAlchemy.

try:
    print("------- 1. pymssql raw test -------")
    import pymssql
    conn = pymssql.connect(
        server=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )
    cursor = conn.cursor()
    cursor.execute('SELECT @@VERSION')
    row = cursor.fetchone()
    print(f"Connected!: {row[0]}")
    conn.close()
    print("-----------------------------------")
except Exception as e:
    print(f"pymssql raw failed: {e}")

try:
    print("------- 2. SQLAlchemy test -------")
    from urllib.parse import quote_plus
    encoded_password = quote_plus(DB_PASSWORD)
    URL = f"mssql+pymssql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print(f"SQLAlchemy Protected: {result.fetchone()}")
    print("----------------------------------")
except Exception as e:
    print(f"SQLAlchemy failed: {e}")
