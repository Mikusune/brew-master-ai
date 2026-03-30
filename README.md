# ☕ BrewMaster AI: Local-First Coffee Brewing Assistant

**BrewMaster AI** adalah aplikasi asisten seduh kopi (manual brew) berbasis web yang mengintegrasikan **Local Large Language Model (LLM)** untuk memberikan analisis rasa dan saran teknis barista secara instan. 

Dibuat untuk para pencinta kopi yang peduli pada privasi data, aplikasi ini berjalan 100% di mesin lokal tanpa memerlukan koneksi internet untuk pemrosesan AI.

---

## 🌟 Key Features

- **Personalized Brew Analysis:** Menganalisis variabel seduhan (Metode, Dosis, Rasio, Suhu, Roasting Level) untuk memperbaiki keluhan rasa (pahit, asam, sepat).
- **Local AI Integration:** Menggunakan **Gemma 2 (2B/9B)** via LM Studio/Ollama untuk respon cerdas tanpa biaya API.
- **Automated Brew Journal:** Menyimpan riwayat seduhan secara permanen menggunakan database SQLite.
- **Modern Minimalist UI:** Antarmuka estetik bertema kopi yang dibangun dengan Next.js dan Tailwind CSS.
- **Hardware Optimized:** Dirancang khusus untuk berjalan lancar pada GPU kelas menengah (Tested on NVIDIA CMP 30HX 6GB VRAM).

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **HTTP Client:** Axios

### Backend
- **Language:** Python 3.14
- **Framework:** FastAPI (Asynchronous)
- **Database:** SQLite
- **ORM:** SQLAlchemy
- **AI Engine:** LM Studio (OpenAI Compatible API) / Ollama

---

## 🚀 Getting Started

### 1. Prasyarat (Hardware & Software)
- RAM minimal 8GB (Disarankan 16GB).
- GPU NVIDIA dengan VRAM minimal 4GB (untuk menjalankan Gemma 2B/4B).
- [LM Studio](https://lmstudio.ai/) atau [Ollama](https://ollama.com/) terinstal.

### 2. Setup AI Model (LM Studio)
1. Download model `google/gemma-2-2b-it-GGUF`.
2. Buka tab **Local Server** di LM Studio.
3. Klik **Start Server** (Pastikan berjalan di port `1234`).

### 3. Instalasi Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. Instalasi Frontend  
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure
```bash
brew-master/
├── backend/
│   ├── main.py              # Logika API FastAPI & Database SQLAlchemy
│   ├── brew_history.db      # Database SQLite (Otomatis terbuat saat dijalankan)
│   └── requirements.txt     # Daftar library Python
└── frontend/
    ├── src/app/page.tsx     # Antarmuka Utama & Logika Frontend
    ├── tailwind.config.ts   # Konfigurasi warna kustom (Coffee Theme)
    └── package.json         # Daftar library Node.js
```

## 💡 System Prompt (The Secret Sauce)
AI dalam aplikasi ini diinstruksikan sebagai Master Barista Champion. Ia tidak hanya menjawab pertanyaan umum, tetapi memberikan solusi teknis berdasarkan variabel ekstraksi kopi seperti:

Menyarankan penurunan suhu untuk Dark Roast.

Menyarankan gilingan lebih kasar jika rasa terlalu bitter pada metode V60.

Menghitung kecukupan rasio air dan kopi secara otomatis.