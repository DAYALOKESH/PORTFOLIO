# Admin Panel Frontend Implementation Tasks

> **For UI Agent**: This document lists all frontend tasks for implementing the admin panel and CMS. Backend is complete.

---

## 1. Dependencies to Install

```bash
npm install zustand axios @uiw/react-md-editor react-markdown
```

---

## 2. API Client & Types

### Create: `src/lib/api/api.ts`
- Axios instance with `baseURL: "http://localhost:8000/api/v1"`
- Request interceptor: attach `Authorization: Bearer <token>` from auth store
- Response interceptor: on 401, call `logout()` and redirect to `/login`

### Create: `src/lib/stores/auth-store.ts`
```typescript
interface AuthStore {
  token: string | null;
  user: User | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  isAuthenticated: boolean;
}
```
- Use `zustand` with `persist` middleware (localStorage)
- Login: POST `/auth/login` (form data: username, password) → store token
- After login: GET `/auth/me` → store user

### Create: `src/types/index.ts`
```typescript
interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_markdown: string;
  content_html: string;
  featured_image_url: string | null;
  status: "draft" | "published" | "archived";
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  repo_url: string | null;
  live_url: string | null;
  thumbnail_url: string;
  order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface PostCreate {
  title: string;
  slug?: string;
  excerpt?: string;
  content_markdown: string;
  featured_image_url?: string;
  status: "draft" | "published";
  tags: string[];
}

interface ProjectCreate {
  title: string;
  description: string;
  tech_stack: string[];
  repo_url?: string;
  live_url?: string;
  thumbnail_url: string;
  order?: number;
  is_featured?: boolean;
}
```

---

## 3. Route Structure

Create the following route group structure:

```
src/app/
├── (admin)/
│   ├── layout.tsx          # Auth guard + admin shell
│   ├── login/
│   │   └── page.tsx        # Login form
│   └── admin/
│       ├── layout.tsx      # Sidebar + header
│       ├── dashboard/
│       │   └── page.tsx    # Stats overview
│       ├── posts/
│       │   ├── page.tsx    # Posts list table
│       │   └── editor/
│       │       └── page.tsx # Create/edit post
│       ├── projects/
│       │   ├── page.tsx    # Projects list
│       │   └── editor/
│       │       └── page.tsx # Create/edit project
│       └── media/
│           └── page.tsx    # Media gallery
```

---

## 4. Page Specifications

### Login Page (`(admin)/login/page.tsx`)
- **Design**: Dark themed, centered card, gradient accent background
- **Fields**: Email input, Password input
- **Actions**: Login button, loading state
- **Flow**: 
  - Submit → POST `/auth/login` (form-data: username=email, password)
  - Store token → GET `/auth/me` → store user
  - Redirect to `/admin/dashboard`

### Admin Layout (`(admin)/admin/layout.tsx`)
- **Sidebar**: Navigation links with icons
  - Dashboard (LayoutDashboard icon)
  - Posts (FileText icon)
  - Projects (FolderKanban icon)
  - Media (Image icon)
- **Header**: User avatar, name, logout button
- **Auth Guard**: If not authenticated, redirect to `/login`

### Dashboard (`admin/dashboard/page.tsx`)
- **Stats Cards**:
  - Total Posts (GET `/posts/admin/all`)
  - Published Posts (filter by status)
  - Total Projects (GET `/projects`)
  - Total Views (sum of view_count)
- **Quick Actions**: "New Post" button, "New Project" button
- **Recent Posts**: Last 5 posts table

### Posts List (`admin/posts/page.tsx`)
- **Table Columns**: Title, Status (badge), Views, Created, Actions
- **Filters**: Status dropdown (all/draft/published/archived)
- **Actions**: Edit (link to editor), Delete (with confirmation)
- **API**: GET `/posts/admin/all?status_filter=<status>`

### Post Editor (`admin/posts/editor/page.tsx`)
- **Mode**: Create (no query param) or Edit (`?id=<uuid>`)
- **Fields**:
  - Title (text input)
  - Slug (text input, auto-generate button)
  - Tags (comma-separated input)
  - Featured Image (URL input + upload button)
  - Content (Markdown editor with preview)
  - Status (draft/published toggle)
- **Markdown Editor**: Use `@uiw/react-md-editor` with dark theme
- **Actions**: 
  - Save Draft (POST/PUT with status=draft)
  - Publish (POST/PUT with status=published)
- **API**: 
  - Create: POST `/posts`
  - Update: PUT `/posts/{id}`

### Projects List (`admin/projects/page.tsx`)
- **Grid/Table**: Thumbnail, Title, Tech Stack (pills), Featured (star), Actions
- **Actions**: Edit, Delete, Toggle Featured
- **Drag-and-drop reorder** (optional, calls PUT `/projects/reorder`)
- **API**: GET `/projects`

### Project Editor (`admin/projects/editor/page.tsx`)
- **Fields**:
  - Title (text input)
  - Description (textarea)
  - Tech Stack (tag input, comma-separated)
  - Repository URL (text input)
  - Live URL (text input)
  - Thumbnail (URL input + upload button)
  - Featured (checkbox)
  - Order (number input)
- **API**: 
  - Create: POST `/projects`
  - Update: PUT `/projects/{id}`

### Media Gallery (`admin/media/page.tsx`)
- **Upload Zone**: Drag-and-drop area
- **Gallery Grid**: Thumbnails with copy URL button
- **Delete**: Hover action with confirmation
- **API**: 
  - Upload: POST `/media/upload` (multipart/form-data)
  - Delete: DELETE `/media/delete?key=<key>`

---

## 5. Shared Components

### `src/components/admin/Sidebar.tsx`
- Logo at top
- Navigation items with icons and active state
- Collapsible on mobile
- Lucide icons: LayoutDashboard, FileText, FolderKanban, Image, LogOut

### `src/components/admin/AdminHeader.tsx`
- Breadcrumbs
- User info (name, avatar)
- Logout button

### `src/components/admin/MarkdownEditor.tsx`
- Wrapper around `@uiw/react-md-editor`
- Controlled component (value, onChange)
- Dark theme configuration
- Height: 500px minimum

### `src/components/admin/ImageUploader.tsx`
- Dropzone with preview
- Progress indicator
- Returns URL after upload

### `src/components/admin/TagInput.tsx`
- Comma-separated tag entry
- Pills display with remove button

---

## 6. API Endpoints Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/login` | No | Login (form-data) |
| GET | `/auth/me` | Yes | Get current user |
| GET | `/posts` | No | List published posts |
| GET | `/posts/admin/all` | Yes | List all posts (admin) |
| GET | `/posts/{slug}` | No | Get post by slug |
| POST | `/posts` | Yes | Create post |
| PUT | `/posts/{id}` | Yes | Update post |
| DELETE | `/posts/{id}` | Yes | Delete/archive post |
| GET | `/projects` | No | List projects |
| GET | `/projects/{id}` | No | Get project |
| POST | `/projects` | Yes | Create project |
| PUT | `/projects/{id}` | Yes | Update project |
| DELETE | `/projects/{id}` | Yes | Delete project |
| PUT | `/projects/reorder` | Yes | Reorder projects |
| POST | `/media/upload` | Yes | Upload image |
| DELETE | `/media/delete` | Yes | Delete image |

---

## 7. Design Guidelines

- **Theme**: Dark mode by default (slate-950 background)
- **Accent**: Indigo-500 for primary actions
- **Cards**: Rounded-lg, slate-900 background, subtle border
- **Tables**: Striped rows, hover effect
- **Buttons**: Primary (indigo), Secondary (slate), Danger (red)
- **Forms**: Full-width inputs with labels above
- **Loading**: Skeleton loaders and spinner on buttons
- **Animations**: Framer Motion for page transitions

---

## 8. Testing Checklist

After implementation, verify:
- [ ] Login with valid/invalid credentials
- [ ] Session persists on page refresh
- [ ] Unauthenticated access redirects to login
- [ ] Create, edit, delete blog post
- [ ] Markdown preview renders correctly
- [ ] Create, edit, delete project
- [ ] Image upload works (check /uploads folder or S3)
- [ ] Published posts appear on public blog
