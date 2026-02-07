# MIDDLEWARE / API LAYER REQUIREMENTS
# Scope: Interface Contracts, Communication, Security, Integration

> **Tech Stack:** OpenAPI (Swagger), REST, JWT, CORS.

---

## 1. INTERFACE STANDARDS

### 1.1 Content-Type
*   **Requests:** `application/json` (except File Uploads: `multipart/form-data`).
*   **Responses:** `application/json`.

### 1.2 Status Codes
*   `200 OK`: Success (GET, PUT, PATCH).
*   `201 Created`: Success (POST).
*   `204 No Content`: Success (DELETE).
*   `400 Bad Request`: Validation failure (Pydantic error).
*   `401 Unauthorized`: Missing or invalid Bearer token.
*   `403 Forbidden`: Token valid but insufficient permissions (e.g., Guest trying to delete).
*   `404 Not Found`: Resource does not exist.
*   `422 Unprocessable Entity`: Field validation error (Detailed Pydantic breakdown).
*   `500 Internal Server Error`: Unhandled exception.

---

## 2. API ENDPOINT SPECIFICATIONS

### 2.1 Authentication Module
*   **`POST /api/v1/auth/login`**
    *   **Request (Form Data):** `username` (str), `password` (str).
    *   **Response:**
        ```json
        {
          "access_token": "eyJhbGciOi...",
          "token_type": "bearer"
        }
        ```

### 2.2 Blog Module (Public)
*   **`GET /api/v1/posts`**
    *   **Query Params:**
        *   `skip`: int (default 0)
        *   `limit`: int (default 10)
        *   `tag`: str (optional)
    *   **Response:**
        ```json
        [
          {
            "id": "uuid",
            "title": "My Post",
            "slug": "my-post",
            "excerpt": "...",
            "published_at": "2023-10-27T...",
            "featured_image_url": "..."
          }
        ]
        ```
*   **`GET /api/v1/posts/{slug}`**
    *   **Response:** Full `BlogPost` object including `content_html`.

### 2.3 Blog Module (Admin Protected)
> **Requirement:** Header `Authorization: Bearer <token>`

*   **`POST /api/v1/posts`**
    *   **Body:**
        ```json
        {
          "title": "New Post",
          "content_markdown": "# Hello World",
          "status": "draft",
          "tags": ["tech", "python"]
        }
        ```
    *   **Behavior:**
        *   Auto-generate `slug` from title if not provided.
        *   Render `content_html` from markdown.
        *   Set `created_at` to now.
*   **`PUT /api/v1/posts/{id}`**
    *   **Body:** Partial fields allowed.
    *   **Behavior:** Re-render HTML if markdown changes. Update `updated_at`.
*   **`DELETE /api/v1/posts/{id}`**
    *   **Behavior:** Soft delete. Set `status` = `archived` or flag `is_deleted`.

### 2.4 Media Module (Admin Protected)
*   **`POST /api/v1/media/upload`**
    *   **Body:** `Multipart/Form-Data` -> `file`.
    *   **Validation:**
        *   Check `content_type` in [`image/jpeg`, `image/png`, `image/webp`].
        *   Check `size` < 5MB.
    *   **Response:**
        ```json
        {
          "filename": "uuid-original.jpg",
          "url": "https://s3.amazonaws.com/bucket/uuid-original.jpg"
        }
        ```

### 2.5 Portfolio Module
*   **`GET /api/v1/projects`**
    *   **Response:** List of projects sorted by `order`.
*   **`POST /api/v1/projects`** (Admin)
    *   **Body:** Project creation payload.

---

## 3. SECURITY & INTEGRATION POLICIES

### 3.1 CORS (Cross-Origin Resource Sharing)
*   **Middleware:** `CORSMiddleware`.
*   **Policy:**
    *   `allow_origins`: List loaded from env `CORS_ORIGINS`.
    *   Dev: `["http://localhost:3000"]`.
    *   Prod: `["https://yourdomain.com", "https://admin.yourdomain.com"]`.
    *   `allow_credentials`: `True`.
    *   `allow_methods`: `["*"]`.
    *   `allow_headers`: `["*"]`.

### 3.2 Rate Limiting
*   **Library:** `slowapi`.
*   **Rules:**
    *   Public Read (`GET /posts`): 100/minute.
    *   Login Attempts (`POST /login`): 5/minute.
    *   Comments (`POST /comments`): 3/hour per IP.

### 3.3 Error Handling
*   **Global Exception Handler:**
    *   Catch `RequestValidationError`: Return 422 with clear field names.
    *   Catch `SQLAlchemyError`: Return 500 (Log internal details, generic message to user).

### 3.4 API Documentation
*   **OpenAPI:** `/docs` (Swagger UI) and `/redoc` (ReDoc) enabled in Dev and Staging. Disabled or protected in Production.
