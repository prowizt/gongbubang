from sqlalchemy import Column, String, DateTime, Text
from database import Base
from datetime import datetime

class Haksaeng(Base):
    __tablename__ = "HJ_HAKSAENG"

    # Explicitly defining columns to fetch (Excluding PIC)
    HAKSAENG_ID = Column(String(8), primary_key=True, index=True)
    HAKSAENG_NM = Column(String(20), nullable=False)
    GENDER_CD = Column(String(1), nullable=True)
    HAKGYOMYEONG = Column(String(30), nullable=True)
    CHOJUNGGO_CD = Column(String(1), nullable=True)
    HAKNYEON = Column(String(1), nullable=True)
    HP_NO = Column(String(16), nullable=True)
    ADDR1 = Column(String(60), nullable=True)
    ADDR2 = Column(String(30), nullable=True)
    DUNGROK_DT = Column(DateTime, default=datetime.now)
    
    # PIC Column is deliberately excluded to prevent encoding errors
    # PIC = Column(Text, nullable=True) 
