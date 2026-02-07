# Middleware Layer - API Integration Guide

This directory contains the API contracts and integration specifications between the Frontend (Next.js) and Backend (FastAPI).

---

## API Base Configuration

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:8000` |
| Production | `https://api.yourdomain.com` |

---

## Authentication

### Login Flow

```
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=admin@portfolio.local&password=admin123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using the Token

Include in all authenticated requests:
```
Authorization: Bearer <access_token>
```

---

## API Endpoints

### Public (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/v1/posts` | List published posts |
| GET | `/api/v1/posts/{slug}` | Get post by slug |
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/comments/post/{id}` | Get comments for post |
| POST | `/api/v1/comments` | Create comment |

### Admin (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/posts` | Create post |
| PUT | `/api/v1/posts/{id}` | Update post |
| DELETE | `/api/v1/posts/{id}` | Archive post |
| POST | `/api/v1/projects` | Create project |
| PUT | `/api/v1/projects/{id}` | Update project |
| DELETE | `/api/v1/projects/{id}` | Delete project |
| POST | `/api/v1/media/upload` | Upload image |
| PUT | `/api/v1/comments/{id}/approve` | Approve comment |
| DELETE | `/api/v1/comments/{id}` | Delete comment |

---

## Rate Limiting

| Endpoint Pattern | Limit |
|-----------------|-------|
| `GET /posts` | 100/minute |
| `POST /auth/login` | 5/minute |
| `POST /comments` | 10/hour |
| `POST /media/upload` | 20/hour |

**Rate Limit Response (429):**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded: 5 per 1 minute"
}
```

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `bad_request` | Invalid request format |
| 401 | `unauthorized` | Missing or invalid token |
| 403 | `forbidden` | Insufficient permissions |
| 404 | `not_found` | Resource not found |
| 409 | `conflict` | Duplicate resource |
| 422 | `validation_error` | Field validation failed |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_error` | Server error |

### Validation Error Response (422)

```json
{
  "error": "validation_error",
  "message": "Request validation failed",
  "details": [
    {
      "field": "body -> title",
      "message": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## CORS Configuration

**Allowed Origins (Development):**
- `http://localhost:3000`

**Allowed Methods:** All (`*`)
**Allowed Headers:** All (`*`)
**Credentials:** Enabled

---

## Frontend Integration

### Install Dependencies

```bash
cd frontend
npm install axios zustand
```

### Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### API Client Usage

```typescript
import { postsApi, authApi } from "@/lib/api";

// Login
const token = await authApi.login({
  username: "admin@example.com",
  password: "password"
});

// Fetch posts
const posts = await postsApi.list({ limit: 10 });

// Create post (requires auth)
const newPost = await postsApi.create({
  title: "My Post",
  content_markdown: "# Hello World",
});
```

### Auth Store Usage

```typescript
import { useAuthStore } from "@/lib/store";

function Component() {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  
  if (!isAuthenticated()) {
    return <LoginForm />;
  }
  
  return <Dashboard user={user} />;
}
```

---

## API Documentation

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OpenAPI JSON:** http://localhost:8000/api/v1/openapi.json
