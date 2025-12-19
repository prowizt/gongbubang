from sqlalchemy.orm import Session
from sqlalchemy import or_, text
import models, schemas

def get_haksaeng_list(db: Session, skip: int = 0, limit: int = 100, name_search: str = None):
    # This automatically selects only columns defined in model (excludes PIC)
    query = db.query(models.Haksaeng)
    if name_search:
        # 1. 검색어를 CP949 '바이트(bytes)'로 변환
        # (문자열이 아니라 바이트를 넘기면 pymssql이 변환 없이 그대로 DB에 꽂아줌)
        search_bytes = f"%{name_search}%".encode('cp949')
        
        # 2. 바이트를 파라미터로 전달
        query = query.filter(text("HAKSAENG_NM LIKE :val")).params(val=search_bytes)
    return query.order_by(
        models.Haksaeng.CHOJUNGGO_CD.asc(),
        models.Haksaeng.HAKNYEON.asc(),
        models.Haksaeng.HAKSAENG_NM.asc()
    ).offset(skip).limit(limit).all()

def get_haksaeng_stats(db: Session):
    from sqlalchemy import func
    
    # Total count
    total_count = db.query(func.count(models.Haksaeng.HAKSAENG_ID)).scalar()
    
    # Counts by School Level
    # CHOJUNGGO_CD: 1=Elem, 2=Middle, 3=High
    level_counts = db.query(
        models.Haksaeng.CHOJUNGGO_CD, 
        func.count(models.Haksaeng.HAKSAENG_ID)
    ).group_by(models.Haksaeng.CHOJUNGGO_CD).all()
    
    stats = {
        "total": total_count,
        "elementary": 0,
        "middle": 0,
        "high": 0,
        "general": 0
    }
    
    for level, count in level_counts:
        if level == '1':
            stats["elementary"] = count
        elif level == '2':
            stats["middle"] = count
        elif level == '3':
            stats["high"] = count
        elif level == '4':
            stats["general"] = count
            
    return stats

from datetime import datetime

def create_haksaeng(db: Session, haksaeng: schemas.HaksaengCreate):
    # MSSQL 한글 입력을 위해 문자열을 CP949 바이트로 변환하여 전달
    params = {
        "id": haksaeng.HAKSAENG_ID,
        "nm": haksaeng.HAKSAENG_NM.encode('cp949') if haksaeng.HAKSAENG_NM else None,
        "gender": haksaeng.GENDER_CD,
        "school": haksaeng.HAKGYOMYEONG.encode('cp949') if haksaeng.HAKGYOMYEONG else None,
        "level": haksaeng.CHOJUNGGO_CD,
        "grade": haksaeng.HAKNYEON,
        "hp": haksaeng.HP_NO,
        "addr1": haksaeng.ADDR1.encode('cp949') if haksaeng.ADDR1 else None,
        "addr2": haksaeng.ADDR2.encode('cp949') if haksaeng.ADDR2 else None,
        "dt": datetime.now()
    }
    
    stmt = text("""
        INSERT INTO HJ_HAKSAENG 
        (HAKSAENG_ID, HAKSAENG_NM, GENDER_CD, HAKGYOMYEONG, CHOJUNGGO_CD, HAKNYEON, HP_NO, ADDR1, ADDR2, DUNGROK_DT)
        VALUES (:id, :nm, :gender, :school, :level, :grade, :hp, :addr1, :addr2, :dt)
    """)
    
    db.execute(stmt, params)
    db.commit()
    
    return models.Haksaeng(**haksaeng.dict(), DUNGROK_DT=params["dt"])

def get_next_haksaeng_id(db: Session):
    current_year = str(datetime.now().year)
    # Find the max ID starting with the current year
    # We use func.max directly on the column
    from sqlalchemy import func
    
    # query to get max id
    max_id_query = db.query(func.max(models.Haksaeng.HAKSAENG_ID)).filter(models.Haksaeng.HAKSAENG_ID.like(f"{current_year}%"))
    max_id = max_id_query.scalar()
    
    if max_id:
        # If exists, increment
        # Assumes ID format YYYYs#### (e.g. 20240001) is 8 digits
        try:
            next_num = int(max_id) + 1
            return str(next_num)
        except ValueError:
            # Fallback if non-numeric found, though schema says String(8)
            return f"{current_year}0001"
    else:
        # If not exists, start with YYYY0001
        return f"{current_year}0001"

def delete_haksaeng(db: Session, haksaeng_id: str):
    haksaeng = db.query(models.Haksaeng).filter(models.Haksaeng.HAKSAENG_ID == haksaeng_id).first()
    if haksaeng:
        db.delete(haksaeng)
        db.commit()
    return haksaeng

def update_haksaeng(db: Session, haksaeng_id: str, haksaeng_update: schemas.HaksaengUpdate):
    # 1. Check existence
    db_haksaeng = db.query(models.Haksaeng).filter(models.Haksaeng.HAKSAENG_ID == haksaeng_id).first()
    if not db_haksaeng:
        return None
    
    # 2. Prepare params with CP949 encoding for Korean fields
    # Only update provided fields (though schema has all optional, frontend might send all)
    # logic: if value is provided, encode it. ID is NOT updated.
    
    update_data = haksaeng_update.dict(exclude_unset=True)
    
    # Explicitly map and encode
    params = {
        "id": haksaeng_id,
        "nm": update_data.get("HAKSAENG_NM").encode('cp949') if update_data.get("HAKSAENG_NM") else db_haksaeng.HAKSAENG_NM.encode('cp949'),
        "gender": update_data.get("GENDER_CD", db_haksaeng.GENDER_CD),
        "school": update_data.get("HAKGYOMYEONG").encode('cp949') if update_data.get("HAKGYOMYEONG") else (db_haksaeng.HAKGYOMYEONG.encode('cp949') if db_haksaeng.HAKGYOMYEONG else None),
        "level": update_data.get("CHOJUNGGO_CD", db_haksaeng.CHOJUNGGO_CD),
        "grade": update_data.get("HAKNYEON", db_haksaeng.HAKNYEON),
        "hp": update_data.get("HP_NO", db_haksaeng.HP_NO),
        "addr1": update_data.get("ADDR1").encode('cp949') if update_data.get("ADDR1") else (db_haksaeng.ADDR1.encode('cp949') if db_haksaeng.ADDR1 else None),
        "addr2": update_data.get("ADDR2").encode('cp949') if update_data.get("ADDR2") else (db_haksaeng.ADDR2.encode('cp949') if db_haksaeng.ADDR2 else None),
    }

    stmt = text("""
        UPDATE HJ_HAKSAENG
        SET HAKSAENG_NM = :nm,
            GENDER_CD = :gender,
            HAKGYOMYEONG = :school,
            CHOJUNGGO_CD = :level,
            HAKNYEON = :grade,
            HP_NO = :hp,
            ADDR1 = :addr1,
            ADDR2 = :addr2
        WHERE HAKSAENG_ID = :id
    """)
    
    db.execute(stmt, params)
    db.commit()
    
    return db_haksaeng # Return old object or refresh? Refreshing might be better but for now sufficient.
