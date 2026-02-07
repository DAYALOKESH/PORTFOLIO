# GLOBAL ARCHITECTURAL BLUEPRINT
# Personal Portfolio & Integrated CMS (Next.js + FastAPI)

> **Role:** Master Source of Truth
> **Purpose:** This document serves as the absolute reference for all AI agents (Global and Local). It defines every layer, interface, and logic flow with granular precision to prevent ambiguity.

---

## 1. SYSTEM IDENTITY & STANDARDS

### 1.1 Core Technology Stack (Frozen)
*   **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand (State), React Markdown.
*   **Backend:** Python 3.11+, FastAPI, SQLModel (SQLAlchemy + Pydantic), Pydantic Settings.
*   **Database:** PostgreSQL 16 (Relational Data), Redis (Optional - Caching/Rate Limiting).
*   **Storage:** S3-Compatible Storage (AWS S3 / Cloudflare R2).
*   **DevOps:** Docker Compose (Local Dev), Vercel (Frontend Prod), Railway/Render (Backend Prod).

### 1.2 Global Coding Standards
*   **Strict Typing:** `no-explicit-any` in TypeScript. Full Pydantic models in Python.
*   **Naming Conventions:**
    *   **Files:** `kebab-case.tsx` (Frontend), `snake_case.py` (Backend).
    *   **Variables:** `camelCase` (TS), `snake_case` (Python).
    *   **Components:** `PascalCase` (TS).
    *   **Database:** `snake_case` tables and columns.
*   **API Response Standard:** All API responses MUST follow a standardized envelope (unless standard HTTP 204 No Content).

---

## 2. LAYER 1: FRONTEND SPECIFICATIONS (The "Visual Agent")

### 2.1 File Structure Strategy
```text
/frontend
├── src/
│   ├── app/
│   │   ├── (public)/                 # Route Group: Public Facing
│   │   │   ├── layout.tsx            # Public Navbar/Footer
│   │   │   ├── page.tsx              # Homepage (Hero + Featured)
│   │   │   ├── projects/             # Projects Listing
│   │   │   │   └── page.tsx
│   │   │   ├── blog/                 # Blog Listing
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/           # Blog Post Detail
│   │   │   │       └── page.tsx
│   │   │   └── about/
│   │   ├── (admin)/                  # Route Group: CMS (Protected)
│   │   │   ├── layout.tsx            # Sidebar + Auth Guard
│   │   │   ├── login/
│   │   │   └── admin/
│   │   │       ├── dashboard/        # Stats
│   │   │       ├── posts/            # CRUD List
│   │   │       ├── posts/editor/     # New/Edit (Query Param ?id=)
│   │   │       └── media/            # Gallery
│   ├── components/
│   │   ├── ui/                       # Atoms (Button, Input, Modal)
│   │   ├── animations/               # Framer Motion Wrappers
│   │   ├── admin/                    # MarkdownEditor, MediaUploader
│   │   └── layout/                   # Navbar, Footer, Sidebar
│   ├── lib/
│   │   ├── api/                      # Axios Instances
│   │   ├── store/                    # Zustand Stores
│   │   └── hooks/                    # Custom React Hooks
│   └── types/                        # Shared TS Interfaces
```

### 2.2 Design System & Aesthetics (Tailwind + Framer)
*   **Theme:** "Cyber-Professional". Deep dark backgrounds, crisp typography, subtle neon accents.
*   **Colors (Tailwind Config):**
    *   `bg-main`: `slate-950` (#020617)
    *   `bg-card`: `slate-900` (#0f172a)
    *   `text-primary`: `slate-50`
    *   `text-secondary`: `slate-400`
    *   `accent`: `indigo-500` (Hover: `indigo-400`)
*   **Animation Constants (Framer Motion):**
    *   **Page Transition:** `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}`
    *   **Hover:** `whileHover={{ scale: 1.02 }}`
    *   **Stagger:** `variants={{ show: { transition: { staggerChildren: 0.1 } } }}`

### 2.3 Critical Component Specs

#### A. Markdown Editor (`src/components/admin/MarkdownEditor.tsx`)
*   **State:** Controlled component. Two panes: `Edit` (Textarea) and `Preview` (ReactMarkdown).
*   **Toolbar:** Bold, Italic, Code, Link, **Image (Upload)**.
*   **Image Handling:** Drag & Drop in textarea -> Triggers API Upload -> Inserts `![Alt](s3-url)` at cursor.
*   **Sync:** Scroll synchronization between Edit and Preview panes.

#### B. Comment Section (`src/components/blog/CommentSection.tsx`)
*   **Architecture:** Recursive component `CommentNode`.
*   **Props:** `postId: string`, `depth: number`.
*   **Logic:** Fetch comments for post. Render tree. If `depth < 3`, show "Reply" button. If `depth >= 3`, flatten or link.
*   **Auth:** Public users can comment but must pass CAPTCHA (or simple math challenge) to prevent spam.

### 2.4 State Management (Zustand)
*   **`useAuthStore`:**
    *   `token`: string | null
    *   `user`: User | null
    *   `login(token, user)`: Set local storage + state.
    *   `logout()`: Clear all.
    *   `isAuthenticated()`: boolean selector.

---

## 3. LAYER 2: MIDDLEWARE & API SPECIFICATIONS (The "Interface Agent")

### 3.1 API Standards
*   **Base URL:** `/api/v1`
*   **Auth Header:** `Authorization: Bearer <token>`
*   **Date Format:** ISO 8601 UTC (`YYYY-MM-DDTHH:mm:ssZ`)

### 3.2 Endpoint Catalog (Minute Details)

#### A. Authentication
*   `POST /auth/login`
    *   **Input:** `OAuth2PasswordRequestForm` (username, password)
    *   **Output:** `{ "access_token": "ey...", "token_type": "bearer" }`
    *   **Logic:** Verify hash. Expiry: 7 days.

#### B. Content (Public)
*   `GET /posts`
    *   **Query Params:** `page` (int), `limit` (int), `tag` (str).
    *   **Output:** `PaginatedResponse<PostPublic>`
    *   **Filtering:** Only return `is_published=True`.
*   `GET /posts/{slug}`
    *   **Output:** `PostDetail` (includes rendered HTML + prev/next links).

#### C. Content (Admin - Protected)
*   `POST /admin/posts`
    *   **Input:** `PostCreate` (title, content, slug, featured_image, tags[])
    *   **Logic:** Auto-generate slug if empty. Sanitize HTML server-side.
*   `PATCH /admin/posts/{id}`
    *   **Input:** `PostUpdate` (all fields optional).
*   `DELETE /admin/posts/{id}`
    *   **Logic:** Soft delete (`is_deleted = True`) unless `hard_delete=True` param passed.

#### D. Media (S3)
*   `POST /media/upload`
    *   **Input:** `MultipartFile`.
    *   **Logic:**
        1.  Validate MIME type (image/jpeg, image/png, image/webp).
        2.  Rename file: `{uuid}-{timestamp}.{ext}`.
        3.  Optimize (Resize if > 2000px width).
        4.  Upload to S3.
    *   **Output:** `{ "url": "https://bucket.s3.../file.jpg", "key": "..." }`

---

## 4. LAYER 3: BACKEND & DATA SPECIFICATIONS (The "Logic Agent")

### 4.1 Database Schemas (SQLModel/SQLAlchemy)

#### Table: `users`
*   `id`: UUID (PK)
*   `email`: VARCHAR(255) (Unique, Index)
*   `hashed_password`: VARCHAR
*   `full_name`: VARCHAR
*   `role`: VARCHAR ("admin", "guest")

#### Table: `posts`
*   `id`: UUID (PK)
*   `title`: VARCHAR(255)
*   `slug`: VARCHAR(255) (Unique, Index)
*   `excerpt`: TEXT
*   `content_raw`: TEXT (Markdown)
*   `content_html`: TEXT (Sanitized HTML)
*   `featured_image`: VARCHAR(512) (URL)
*   `is_published`: BOOLEAN (Index)
*   `view_count`: INTEGER (Default 0)
*   `created_at`: DATETIME (UTC)
*   `updated_at`: DATETIME (UTC)
*   `published_at`: DATETIME (Nullable)
*   **Relationships:** `tags` (Link Model), `comments` (One-to-Many).

#### Table: `comments`
*   `id`: UUID (PK)
*   `post_id`: UUID (FK -> posts.id)
*   `parent_id`: UUID (FK -> comments.id, Nullable)
*   `author_name`: VARCHAR(100)
*   `author_email`: VARCHAR(255) (Private, not serialized to public)
*   `content`: TEXT
*   `is_approved`: BOOLEAN (Default False if strict, True if lenient)
*   `ip_address`: VARCHAR(45)

### 4.2 Application Configuration (`config.py`)
*   Use `pydantic_settings.BaseSettings`.
*   **Required Env Vars:**
    *   `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_SERVER`, `POSTGRES_DB`
    *   `SECRET_KEY` (For JWT)
    *   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_REGION`
    *   `CORS_ORIGINS` (List of allowed domains)

### 4.3 Service Logic (The "Brain")
*   **Markdown Service:**
    *   Use `markdown` library with extensions: `fenced_code`, `tables`, `toc`.
    *   Use `bleach` to clean the output HTML. **Crucial:** Allow only specific tags (`p`, `h1-h6`, `code`, `pre`, `img`, `a`, `ul`, `ol`, `li`, `blockquote`, `table`, etc.).
*   **Image Service:**
    *   Use `Pillow (PIL)`.
    *   Function: `process_image(file_bytes) -> bytes`.
    *   Logic: Convert to WebP, quality=80, max-width=1920.

---

## 5. DEVELOPMENT WORKFLOW & SETUP

### 5.1 Local Environment
*   **Docker Compose (`docker-compose.yml`):**
    *   Service `db`: Postgres 16 image.
    *   Service `redis`: Alpine image.
    *   *Note:* Backend and Frontend run natively on host for better DX (Hot Reload), connecting to Dockerized DB.

### 5.2 Dependency Management
*   **Frontend:** `package.json` (npm/bun).
*   **Backend:** `requirements.txt` (pip).

### 5.3 Implementation Order (Critical Path)
1.  **Backend Core:** Config + DB Connection + User Model + Login Endpoint.
2.  **Frontend Core:** Next.js scaffolding + Auth Store + Login Page.
3.  **Content Model:** Backend `Post` CRUD + S3 Service.
4.  **Content UI:** Admin Dashboard + Markdown Editor.
5.  **Public UI:** Homepage + Blog Listing + Post Detail.
6.  **Engagement:** Comments System.
7.  **Polish:** Animations + Dark Mode Refinements + SEO.

---

## 6. TESTING & VALIDATION

### 6.1 Backend Tests (`pytest`)
*   **Unit:** Test Markdown processing, Image resizing logic.
*   **Integration:** Test API endpoints with `TestClient` and a temporary SQLite DB.
*   **Coverage:** Aim for 80%+ on business logic files.

### 6.2 Frontend Tests
*   **Unit:** Jest/Vitest for utility functions.
*   **E2E:** Playwright (Optional) for "Login -> Create Post -> Publish" flow.