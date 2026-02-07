"""
Core configuration module for the Portfolio API.
Loads settings from environment variables using Pydantic Settings.
"""
from functools import lru_cache
from typing import Any

from pydantic import field_validator, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Portfolio API"
    DEBUG: bool = False
    
    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "portfolio"
    POSTGRES_PASSWORD: str = "portfolio_dev_password"
    POSTGRES_DB: str = "portfolio_db"
    
    @property
    def DATABASE_URL(self) -> str:
        """Construct the database URL from components."""
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> list[str]:
        """Parse CORS origins from string or list."""
        if isinstance(v, str):
            # Handle JSON-like string format
            if v.startswith("["):
                import json
                return json.loads(v)
            # Handle comma-separated format
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # AWS S3 (Optional - for future use)
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET: str = ""
    AWS_REGION: str = "us-east-1"
    
    # Local Storage (for development)
    LOCAL_STORAGE_PATH: str = "./uploads"
    USE_LOCAL_STORAGE: bool = True


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
