# MEDACCESS: Smart Emergency Patient Information System 🏥⚡

> **Smart India Hackathon 2026 — Problem Statement: MHT07**  
> **Theme:** MedTech / HealthTech  
> **Team:** Zero To One  

MedAccess is a privacy-preserving emergency patient identification and rapid triage system designed for paramedics, ER doctors, and trauma units working under pressure during the **Golden Hour** (the critical first 60 minutes after trauma).

---

## 🌟 Key Capabilities

1. **High-Speed Biometric Identification (< 500ms)**:
   - Facial embedding and vector cosine similarity matching.
   - Immediate identity resolution with confidence scoring.
2. **Clinical Emergency UI**:
   - High-contrast clinical minimalism (Emergency Red, Deep Blue, Medical Green).
   - Massive touch targets designed for tablets in bouncing ambulances.
   - Ultra-low latency feedback (< 200ms).
3. **Critical Medical Cards**:
   - Instant Blood Group indicator with Universal Donor badges.
   - Severe Allergies & Drug Contraindications banner (e.g., Penicillin, NSAIDs).
   - Active medications & pre-existing chronic conditions.
   - One-tap emergency contact direct dialer.
4. **Claude AI Emergency Triage Intelligence**:
   - Automated Golden Hour clinical summarization powered by Claude API.
   - Triage priority classification (Level 1: Resuscitation, Level 2: Emergent, Level 3: Urgent).
   - Flagged contraindicated medications and actionable paramedic protocols.
5. **HIPAA & ABDM Audit Compliance**:
   - Immutable access trail recording Clinician ID, IP address, device ID, location coordinates, and clinical justification.
   - 30+ day retention compliance (§ 164.312(b)).

---

## 📁 Repository Structure

```
d:\Threshold\
├── database/
│   ├── schema.sql           # PostgreSQL schema (patients, profiles, biometrics, logs)
│   └── seed.sql             # Realistic emergency demo records
├── backend/                 # Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/          # Supabase & Env configs + local fallback store
│   │   ├── controllers/     # Patient, Biometric, AI Triage, Audit controllers
│   │   ├── services/        # Vector matching algorithm & Claude AI client
│   │   ├── middleware/      # HIPAA audit logging middleware
│   │   ├── routes/          # Express route definitions
│   │   └── server.ts        # Server entry point
│   ├── Dockerfile           # Production container for Railway
│   └── package.json
└── frontend/                # React + Vite + TypeScript + Tailwind CSS
    ├── src/
    │   ├── components/      # EmergencyHeader, BiometricScanner, PatientCard, etc.
    │   ├── services/        # Backend API service
    │   ├── types/           # Shared TypeScript interfaces
    │   └── App.tsx          # Main Emergency workflow
    ├── vercel.json          # Vercel deployment rewrite rule
    └── package.json
```

---

## 🚀 Quick Start (Local Run)

The application includes an **in-memory fallback emergency store** pre-seeded with 3 realistic trauma/emergency profiles. You can run and test both backend and frontend immediately without configuring external credentials.

### 1. Start the Backend API
```bash
cd backend
npm install
npm run dev
```
The backend starts on `http://localhost:3000` with the following endpoints:
- `GET  /health` — Healthcheck
- `GET  /api/v1/patients/:id` — Fetch patient & medical profile
- `GET  /api/v1/patients/search?q=...` — Fallback search by phone, code, or name
- `POST /api/v1/biometrics/identify` — Match facial embedding vector or token
- `POST /api/v1/ai/triage-summary` — Claude AI emergency triage analysis
- `GET  /api/v1/audit/logs` — Retrieve HIPAA access audit trail

### 2. Start the Frontend UI
```bash
cd frontend
npm install
npm run dev
```
The frontend launches at `http://localhost:5173`.

---

## 🗄️ Setting Up Supabase Database (Optional)

To connect a live cloud PostgreSQL database:
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Navigate to **SQL Editor** in Supabase and paste the contents of `database/schema.sql`.
3. Paste and run `database/seed.sql` to populate sample emergency patients.
4. Copy your **Project URL** and **Service Role Secret** into `backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
5. Restart the backend. It will automatically detect Supabase and query PostgreSQL directly!

---

## 🤖 Configuring Claude API (Optional)

To enable live Claude API calls:
1. Obtain an API key from Anthropic Console.
2. In `backend/.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
3. Restart the backend. Claude will dynamically generate real-time Golden Hour triage analyses. *(If omitted, the built-in clinical decision engine generates accurate emergency recommendations instantly).*

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Push this repository to GitHub.
2. In Vercel, import the repository and set Root Directory to `frontend`.
3. Set environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://medaccess-backend.up.railway.app/api/v1`).
4. Click **Deploy**.

### Backend (Railway)
1. In Railway, create a **New Project** → **Deploy from GitHub repo**.
2. Set Root Directory to `backend` (or use the included `Dockerfile`).
3. Add environment variables: `PORT=3000`, `NODE_ENV=production`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`.
4. Deploy and copy the public Railway domain to your frontend environment.

