from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, crud
from database import SessionLocal, engine, get_db

# Create tables if they don't exist (helpful for local testing with other DBs, 
# but for MSSQL existing table, this might just check presence)
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "https://gongbubang.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/haksaeng/next-id")
def read_next_haksaeng_id(db: Session = Depends(get_db)):
    return {"next_id": crud.get_next_haksaeng_id(db)}

@app.get("/haksaeng/stats")
def read_haksaeng_stats(db: Session = Depends(get_db)):
    return crud.get_haksaeng_stats(db)

@app.delete("/haksaeng/{haksaeng_id}")
def delete_haksaeng(haksaeng_id: str, db: Session = Depends(get_db)):
    haksaeng = crud.delete_haksaeng(db, haksaeng_id)
    if not haksaeng:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Successfully deleted"}

@app.put("/haksaeng/{haksaeng_id}", response_model=schemas.Haksaeng)
def update_haksaeng(haksaeng_id: str, haksaeng: schemas.HaksaengUpdate, db: Session = Depends(get_db)):
    updated_haksaeng = crud.update_haksaeng(db, haksaeng_id, haksaeng)
    if not updated_haksaeng:
        raise HTTPException(status_code=404, detail="Student not found")
    # Refresh to get latest data?
    db.refresh(updated_haksaeng)
    return updated_haksaeng

@app.post("/haksaeng/", response_model=schemas.Haksaeng)
def create_haksaeng(haksaeng: schemas.HaksaengCreate, db: Session = Depends(get_db)):
    # Check if ID exists? 
    # For now, simplistic implementation as requested
    return crud.create_haksaeng(db=db, haksaeng=haksaeng)

@app.get("/haksaeng/", response_model=List[schemas.Haksaeng])
def read_haksaengs(skip: int = 0, limit: int = 100, name: str = None, db: Session = Depends(get_db)):
    haksaengs = crud.get_haksaeng_list(db, skip=skip, limit=limit, name_search=name)
    return haksaengs
