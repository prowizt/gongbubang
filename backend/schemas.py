from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HaksaengBase(BaseModel):
    HAKSAENG_NM: str
    GENDER_CD: Optional[str] = None
    HAKGYOMYEONG: Optional[str] = None
    CHOJUNGGO_CD: Optional[str] = None
    HAKNYEON: Optional[str] = None
    HP_NO: Optional[str] = None
    ADDR1: Optional[str] = None
    ADDR2: Optional[str] = None
    # PIC removed

class HaksaengCreate(HaksaengBase):
    HAKSAENG_ID: str

class HaksaengUpdate(HaksaengBase):
    pass

class Haksaeng(HaksaengBase):
    HAKSAENG_ID: str
    DUNGROK_DT: Optional[datetime] = None

    class Config:
        from_attributes = True
