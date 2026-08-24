import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "CrimeLens Forensic & Intelligence Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    PORT: int = int(os.getenv("PORT", 5000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "crimelens_level4_secret_key")
    ENVIRONMENT: str = os.getenv("NODE_ENV", "development")
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
