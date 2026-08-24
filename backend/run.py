import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"[CrimeLens Python Backend] Starting on http://localhost:{settings.PORT}")
    print(f"[CrimeLens Python Backend] API Docs: http://localhost:{settings.PORT}/docs")
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=False)
