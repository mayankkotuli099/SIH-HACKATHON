# 🛡️ CrimeLens Backend Service

REST API, AI Intelligence Processing & Data Pipeline Service for the **CrimeLens** Forensic Platform.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Verify API status:
   - Health check: `GET http://localhost:5000/api/health`
   - Live Telemetry: `GET http://localhost:5000/api/telemetry/live`
   - Entities: `GET http://localhost:5000/api/entities`
