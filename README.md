# 🎤 MediVoice - Clinical Voice-to-Text Notes (Cloud Version)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloud Ready](https://img.shields.io/badge/Cloud-Ready-green.svg)]()
[![Free Tier](https://img.shields.io/badge/Free_Tier-Available-brightgreen.svg)]()

> **📱 Phone-Optimized Clinical Dictation App**
> Record voice notes on your phone, process in the cloud, get formatted SOAP notes.

## ☁️ Architecture (Cloud-Only)
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Phone PWA │────▶│ FastAPI │────▶│ Groq Cloud │
│ (Recording)│◀────│ (Vercel) │◀────│ (Free STT) │
└─────────────┘ └──────────────┘ └─────────────┘
│
▼
┌──────────────┐ ┌─────────────┐
│ Neon.tech │ │ Groq Cloud │
│ (Database) │ │ (Free LLM) │
└──────────────┘ └─────────────┘

text

## ✨ Features

- 🎙️ **One-tap recording** on your phone
- ☁️ **Cloud AI processing** - no local AI needed
- 🆓 **Free tier** using Groq API
- 📋 **SOAP note formatting** automatically
- 📱 **PWA** - install on phone like an app
- 🔒 **Zero data retention** - HIPAA conscious
- 📋 **Copy to EMR** with one tap

## 🚀 Quick Start (Phone/Cloud)

### Step 1: Get Free API Keys

1. **Groq API** (STT + LLM):
   - Go to https://console.groq.com
   - Sign up for free account
   - Get your API key
   - Free tier: Enough for testing/MVP

2. **Neon.tech** (Database):
   - Go to https://neon.tech
   - Create free PostgreSQL database
   - Get connection string

### Step 2: Configure Environment

```bash
# Clone repo
git clone https://github.com/fubulatu-lang/MediVoice.git
cd MediVoice

# Set up environment
cp .env.example .env
Edit .env and add:

env
GROQ_API_KEY=gsk_your_key_here
AI_PROVIDER=groq
DATABASE_URL=your_neon_tech_url
Step 3: Deploy Backend (Vercel/Railway)
Option A: Vercel (Easiest)

bash
vercel --prod
Option B: Railway (Free)

bash
railway up
Step 4: Use on Phone
Open deployed URL on your phone

Tap "Install" to add as PWA

Sign up / Login

Start recording!

💰 Free Tier Limits
Service	Free Tier	Limits
Groq API	✅ Yes	~30 requests/min
Neon.tech	✅ Yes	3GB storage
Vercel	✅ Yes	100GB bandwidth
Railway	✅ Yes	$5 credit
📁 Project Structure
text
medivoice/
├── client/          # React PWA (Phone UI)
├── server/          # FastAPI (Cloud Backend)
├── docs/            # Documentation
└── scripts/         # Setup scripts
🔒 Privacy & Security
✅ All processing in cloud (no local AI)

✅ Audio deleted after transcription

✅ Notes cleared on logout

✅ TLS encryption everywhere

✅ No patient data stored

🆘 Support
GitHub Issues: Report bugs

Groq Discord: API help

Documentation: /docs

Built for clinicians, optimized for phones, powered by cloud AI. 🏥📱☁️

text

---

## ✅ Batch 6 Complete!

### 📊 Summary of Changes Made:

| File | Change | Reason |
|------|--------|--------|
| `server/app/core/config.py` | Removed Ollama configs | No local AI |
| `server/app/services/stt/engine.py` | Cloud-only providers | Phone can't run AI |
| `server/app/services/llm/engine.py` | Cloud-only providers | Phone can't run AI |
| `server/.env.example` | Removed Ollama vars | Not needed |
| `.env.example` (root) | Removed Ollama vars | Not needed |
| `server/app/main.py` | Updated for cloud mode | Better messaging |
| `README.md` | Cloud-only instructions | Phone-friendly guide |

### 🎯 Architecture Now:
Phone (Recording Only) → Internet → Cloud APIs (All AI Processing)

text

- **Phone does**: Recording, UI, display
- **Cloud does**: STT, LLM, Database, Auth
- **All free**: Groq + Neon.tech + Vercel

The app is now fully cloud-based and phone-optimized! 🎉
