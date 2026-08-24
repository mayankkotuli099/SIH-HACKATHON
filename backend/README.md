# 🛡️ CrimeLens Backend Service (Python & FastAPI)

High-performance REST API Gateway, Graph Analytics & Neural Copilot Intelligence Service for **CrimeLens**.

---

## ⚡ Tech Stack
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous, High-throughput)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Data Validation & Schemas**: [Pydantic v2](https://docs.pydantic.dev/)
- **Architecture**: Modular domain routers with forensic intelligence & graph algorithms

---

## 🚀 Getting Started

### 1. Requirements
- Python 3.11+

### 2. Installation
```bash
cd backend
pip install -r requirements.txt
```

### 3. Running the Server
```bash
# Direct Python runner:
python run.py

# Or via Uvicorn CLI:
uvicorn app.main:app --reload --port 5000

# Or from project root:
npm run server
```

The API service will start on: **`http://localhost:5000`**

---

## 📖 Interactive API Documentation
Once running, explore and test the endpoints via interactive Swagger UI:
- **Swagger UI**: [http://localhost:5000/docs](http://localhost:5000/docs)
- **ReDoc**: [http://localhost:5000/redoc](http://localhost:5000/redoc)

---

## 📡 API Endpoints Overview

| Domain | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | Service status & Level 4 verification |
| **Auth** | `POST` | `/api/auth/login` | Investigator login & token issuance |
| **Auth** | `POST` | `/api/auth/register` | Register field investigator |
| **Auth** | `GET` | `/api/auth/me` | Current operator profile |
| **Dashboard** | `GET` | `/api/dashboard/overview` | Real-time metrics & telemetry stream |
| **Dashboard** | `POST` | `/api/dashboard/query` | Dispatch manual target query |
| **Entities** | `GET` | `/api/entities` | Search and filter suspect dossiers |
| **Entities** | `GET` | `/api/entities/{id}` | Full Entity 360 biometrics & accounts |
| **Network** | `GET` | `/api/network/clusters` | Syndicate topology clusters & graph nodes |
| **Network** | `POST` | `/api/network/path` | Shortest path between suspect nodes |
| **Timeline** | `GET` | `/api/timeline` | Multi-source chronological event trace |
| **Cases** | `GET` | `/api/cases` | Active investigation dockets & evidence |
| **Cases** | `POST` | `/api/cases` | Register new case file |
| **AI Copilot** | `POST` | `/api/chat/query` | Neural cross-modal NLP query engine |
| **Settings** | `GET` | `/api/settings` | Inference parameters & security settings |
| **Settings** | `POST` | `/api/settings` | Update & synchronize settings |
