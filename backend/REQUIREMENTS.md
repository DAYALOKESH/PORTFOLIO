# BACKEND LAYER REQUIREMENTS
# Scope: Business Logic, Data Models, Database, File Services

> **Tech Stack:** Python 3.11, FastAPI, SQLModel, PostgreSQL 16, Redis (Optional), Pydantic.

---

## 1. DIRECTORY STRUCTURE

```text
/backend
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── posts.py
│   │   │   │   ├── media.py
│   │   │   │   └── projects.py
│   │   │   └── api.py           # Router aggregation
│   │   └── deps.py              # Dependencies (get_current_user, get_db)
│   ├── core/
│   │   ├── config.py            # Env vars (Settings)
│   │   ├── security.py          # JWT logic, Password Hashing
│   │   └── logging.py           # Structured logging
│   ├── db/
│   │   ├── session.py           # Engine & SessionLocal
│   │   └── init_db.py           # Initial data seeding
│   ├── models/
│   │   ├── user.py              # User & Admin models
│   │   ├── post.py              # BlogPost, Tag models
│   │   ├── project.py           # Portfolio Project models
│   │   └── comment.py           # Comment models
│   ├── services/
│   │   ├── s3.py                # AWS S3 / Cloudflare R2 wrapper
│   │   └── markdown.py          # Processing & Sanitization
│   └── main.py                  # Entry point
├── alembic/                     # Migrations
├── alembic.ini
└── requirements.txt
```

---

## 2. DATA MODELS (SQLModel)

### 2.1 `User`
*   **Purpose:** Admin authentication.
*   **Fields:**
    *   `id`: UUID (Primary Key, default=uuid4)
    *   `email`: String (Unique, Index)
    *   `hashed_password`: String
    *   `full_name`: String (Optional)
    *   `is_active`: Boolean (Default True)
    *   `is_superuser`: Boolean (Default False)

### 2.2 `BlogPost`
*   **Purpose:** Content storage.
*   **Fields:**
    *   `id`: UUID (PK)
    *   `title`: String (Max 255)
    *   `slug`: String (Unique, Index)
    *   `excerpt`: String (Max 500)
    *   `content_markdown`: Text (Raw input)
    *   `content_html`: Text (Sanitized output)
    *   `featured_image_url`: String (Optional)
    *   `status`: Enum (`draft`, `published`, `archived`)
    *   `view_count`: Integer (Default 0)
    *   `published_at`: Datetime (Nullable)
    *   `created_at`: Datetime (Default Now)
    *   `updated_at`: Datetime (Default Now, OnUpdate Now)
*   **Relationships:**
    *   `tags`: Many-to-Many with `Tag`.
    *   `comments`: One-to-Many with `Comment`.

### 2.3 `Tag`
*   **Fields:** `id` (UUID), `name` (String, Unique), `slug` (String, Unique).

### 2.4 `Project` (Portfolio)
*   **Fields:**
    *   `id`: UUID
    *   `title`: String
    *   `description`: Text
    *   `tech_stack`: JSON (List of strings) or String (Comma separated)
    *   `repo_url`: String (Optional)
    *   `live_url`: String (Optional)
    *   `thumbnail_url`: String
    *   `order`: Integer (For sorting)

---

## 3. CORE LOGIC & SERVICES

### 3.1 Markdown Pipeline (`services/markdown.py`)
*   **Input:** Raw Markdown String.
*   **Process:**
    1.  Convert to HTML using `markdown` lib.
    2.  Extensions: `fenced_code`, `tables`, `toc`, `nl2br`.
    3.  **Sanitize:** Use `bleach`.
        *   **Allowed Tags:** `h1-h6`, `p`, `b`, `i`, `strong`, `em`, `a`, `img`, `pre`, `code`, `ul`, `ol`, `li`, `blockquote`, `table`, `thead`, `tbody`, `tr`, `th`, `td`.
        *   **Allowed Attributes:** `a` -> `href`, `target`; `img` -> `src`, `alt`, `title`.
*   **Output:** Safe HTML String.

### 3.2 S3 Service (`services/s3.py`)
*   **Library:** `boto3`.
*   **Functions:**
    *   `upload_file(file_obj, bucket, key, content_type)`
    *   `delete_file(bucket, key)`
    *   `generate_presigned_url(bucket, key)` (Optional, if private bucket).
*   **Naming Strategy:** Rename uploads to `{uuid4()}_{original_filename}` to prevent collisions.

### 3.3 Auth Service (`core/security.py`)
*   **Hashing:** `passlib[bcrypt]`.
*   **Token:** `pyjwt`.
*   **Flow:**
    1.  User posts credentials.
    2.  Verify password.
    3.  Create access token with `exp` (7 days).
    4.  Return token.

---

## 4. DATABASE & MIGRATIONS
*   **Alembic:** Must be configured to detect `SQLModel` changes.
*   **env.py:** Import all models (`from app.models import *`) so autogenerate works.
*   **Startup:** `main.py` should run `alembic upgrade head` on startup (or via separate entry script in Docker).

## 5. CONFIGURATION
*   **Pydantic Settings (`core/config.py`):**
    ```python
    class Settings(BaseSettings):
        API_V1_STR: str = "/api/v1"
        PROJECT_NAME: str = "Portfolio API"
        POSTGRES_SERVER: str
        POSTGRES_USER: str
        POSTGRES_PASSWORD: str
        POSTGRES_DB: str
        SECRET_KEY: str
        ALGORITHM: str = "HS256"
        AWS_ACCESS_KEY_ID: str
        AWS_SECRET_ACCESS_KEY: str
        AWS_BUCKET: str
        
        class Config:
            env_file = ".env"
    ```
