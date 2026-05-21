from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_env: str = "development"
    project_name: str = "DeepShield AI"
    api_v1_prefix: str = "/api/v1"
    secret_key: str
    access_token_expire_minutes: int = 60
    database_url: str
    redis_url: str
    supabase_url: str
    supabase_service_key: str
    upload_dir: str = "/app/uploads"
    reports_dir: str = "/app/reports"
    max_upload_mb: int = 500
    allowed_extensions: str = "mp4,mov,avi,mkv"
    jwt_algorithm: str = "HS256"
    cors_origins: str = "http://localhost:3000"
    rate_limit_default: str = "30/minute"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()
