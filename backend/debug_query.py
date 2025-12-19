import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Ensure models are loaded
models.Base.metadata.create_all(bind=engine)

def test_query():
    db = SessionLocal()
    try:
        print("Attempting to query HJ_HAKSAENG...")
        results = db.query(models.Haksaeng).limit(5).all()
        print(f"Success! Found {len(results)} records.")
        for r in results:
            print(f" - {r.HAKSAENG_NM} ({r.HAKSAENG_ID})")
    except Exception as e:
        print("Query Failed!")
        print(e)
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
