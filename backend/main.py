from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Text, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import httpx

# 1. Setup Database SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./brew_history.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Model Tabel Database
class Brew(Base):
    __tablename__ = "brews"
    id = Column(Integer, primary_key=True, index=True)
    method = Column(String)
    bean_name = Column(String)
    bean_weight = Column(Integer)  # Gram
    water_amount = Column(Integer) # Ml
    roast_level = Column(String)   # Light, Medium, Dark
    grind_size = Column(String)
    water_temp = Column(Integer)
    notes = Column(Text)
    advice = Column(Text)
    created_at = Column(DateTime, default=datetime.now)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schema Pydantic untuk Request
class BrewCreate(BaseModel):
    method: str
    bean_name: str
    bean_weight: int
    water_amount: int
    roast_level: str
    grind_size: str
    water_temp: int
    notes: str

@app.post("/api/analyze-brew")
async def analyze_brew(data: BrewCreate):
    # Prompt yang lebih detail dengan data baru
    user_prompt = (
        f"Data Seduhan: Metode {data.method}, Biji {data.bean_name} ({data.roast_level} Roast), "
        f"Dosis {data.bean_weight}g, Air {data.water_amount}ml, Gilingan {data.grind_size}, Suhu {data.water_temp}C. "
        f"Keluhan: {data.notes}."
    )
    
    payload = {
        "model": "gemma-2-2b-it", # Sesuaikan model LM Studio kamu
        "messages": [
            {"role": "system", "content": "Kamu adalah Master Barista. Berikan saran perbaikan rasa singkat."},
            {"role": "user", "content": user_prompt}
        ]
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            response = await client.post("http://localhost:1234/v1/chat/completions", json=payload)
            ai_advice = response.json()['choices'][0]['message']['content']
            
            # Simpan ke Database
            db = SessionLocal()
            new_brew = Brew(**data.dict(), advice=ai_advice)
            db.add(new_brew)
            db.commit()
            db.refresh(new_brew)
            db.close()
            
            return {"advice": ai_advice}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    db = SessionLocal()
    history = db.query(Brew).order_by(Brew.created_at.desc()).all()
    db.close()
    return history