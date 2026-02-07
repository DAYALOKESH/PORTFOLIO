# FRONTEND LAYER REQUIREMENTS
# Scope: UI/UX, Client Logic, Animations, Admin Dashboard

> **Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, React-Markdown.

---

## 1. DIRECTORY STRUCTURE & FILE NAMING

### 1.1 Root Structure
```text
/frontend
├── public/                   # Static assets (fonts, favicon)
├── src/
│   ├── app/                  # App Router
│   │   ├── (public)/         # Public Facing Layout Group
│   │   ├── (admin)/          # Admin Dashboard Layout Group
│   │   ├── api/              # Next.js Server Actions / API Proxies (Optional)
│   │   ├── globals.css       # Tailwind directives
│   │   └── layout.tsx        # Root Layout (Providers)
│   ├── components/           # Reusable UI
│   │   ├── ui/               # Atomic Design (Button, Input, Card)
│   │   ├── layout/           # Navbar, Footer, Sidebar
│   │   ├── blog/             # Blog specific components
│   │   ├── portfolio/        # Portfolio specific components
│   │   └── admin/            # CMS components
│   ├── lib/
│   │   ├── api.ts            # Axios configuration
│   │   ├── utils.ts          # cn() helper
│   │   └── store.ts          # Zustand Global Store
│   ├── types/                # Global TypeScript Interfaces
│   └── hooks/                # Custom React Hooks
└── tailwind.config.ts        # Design System Config
```

### 1.2 Naming Conventions
*   **Components:** `PascalCase.tsx` (e.g., `HeroSection.tsx`).
*   **Hooks:** `camelCase.ts` prefixed with `use` (e.g., `useScrollProgress.ts`).
*   **Utilities:** `kebab-case.ts` (e.g., `date-formatter.ts`).
*   **CSS Classes:** Utility-first (Tailwind). Avoid custom CSS files unless for specific animations not possible in Tailwind.

---

## 2. UI/UX DESIGN SYSTEM

### 2.1 Typography
*   **Font Family:** `Inter` (Sans) for UI, `Merriweather` or `Playfair Display` (Serif) for Blog Content.
*   **Scale:**
    *   `h1`: `text-4xl md:text-6xl font-bold tracking-tighter`
    *   `h2`: `text-3xl font-semibold tracking-tight`
    *   `body`: `text-base leading-relaxed text-slate-300`

### 2.2 Color Palette (Dark Mode Default)
*   **Backgrounds:**
    *   `bg-slate-950` (Main Page Background)
    *   `bg-slate-900` (Cards / Sidebar)
*   **Accents:**
    *   `text-indigo-500` (Primary Links / Buttons)
    *   `text-rose-500` (Errors / Delete Actions)
    *   `border-slate-800` (Dividers)

### 2.3 Animations (Framer Motion)
*   **Standard Reveal:**
    ```typescript
    export const fadeInUp = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    };
    ```
*   **Staggered List:**
    ```typescript
    export const staggerContainer = {
      animate: {
        transition: { staggerChildren: 0.1 }
      }
    };
    ```
*   **Page Transitions:** Wrap main content in `<AnimatePresence mode="wait">`.

---

## 3. COMPONENT SPECIFICATIONS

### 3.1 Core UI Components (`/src/components/ui`)
*   **`Button.tsx`:** Variants: `default` (Solid Indigo), `ghost` (Transparent), `outline`. Loading state spinner support.
*   **`Input.tsx`:** Styled inputs with `focus:ring-2` aesthetics. Error message support.
*   **`Modal.tsx`:** Reusable dialog with `Backdrop` blur effect.

### 3.2 Blog Components (`/src/components/blog`)
*   **`PostCard.tsx`:**
    *   Displays: Thumbnail, Title, Excerpt, Date, Tags.
    *   Interaction: Hover scales image slightly.
*   **`MarkdownRenderer.tsx`:**
    *   Uses `react-markdown` + `remark-gfm` + `rehype-highlight`.
    *   Custom renderers for `img` (use Next.js `<Image>`), `code` (syntax highlighting), `table` (styled scrolling).
*   **`TableOfContents.tsx`:**
    *   Sticky sidebar on desktop.
    *   Parses headings (`h2`, `h3`) from content.
    *   Active state highlighting based on scroll position.

### 3.3 Admin Components (`/src/components/admin`)
*   **`MarkdownEditor.tsx`:**
    *   **Layout:** Split pane (50% Write / 50% Preview). Mobile: Tabs.
    *   **Features:**
        *   Toolbar: Bold, Italic, H1-H3, Quote, Code, Link, Image.
        *   **Image Upload:** Drag & drop handler that calls `uploadImage` API, waits for URL, and inserts `![Alt](url)`.
        *   **Auto-Save:** `useEffect` hook with debounce (30s) calling `saveDraft`.
*   **`StatusBadge.tsx`:** Visual indicator for `Draft` (Gray), `Published` (Green).

---

## 4. STATE MANAGEMENT (Zustand)

### 4.1 `useAuthStore`
```typescript
interface AuthState {
  token: string | null;
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  hydrated: boolean; // To prevent hydration mismatch
}
```
*   **Persistence:** Use `persist` middleware to save token to `localStorage`.

### 4.2 `useGlobalUI` (Optional)
*   Manage global UI states like "Sidebar Open" (Mobile) or "Search Modal Open".

---

## 5. ROUTING & PAGES

### 5.1 Public Routes
*   `/`: **Home**. Hero section + "Latest Projects" + "Recent Posts".
*   `/projects`: **Portfolio Grid**. Filtering by Tech Stack (e.g., "React", "Python").
*   `/blog`: **Blog Index**. Search bar, Category filter.
*   `/blog/[slug]`: **Post Detail**. ISR (Incremental Static Regeneration) or Dynamic Rendering.

### 5.2 Admin Routes (Protected)
*   **Middleware:** Check `useAuthStore`. If no token, redirect to `/login`.
*   `/admin/dashboard`: Stats (Total Views, Total Posts).
*   `/admin/posts`: Data Table of posts with Actions (Edit, Delete).
*   `/admin/posts/new`: Empty Editor.
*   `/admin/posts/[id]`: Editor pre-filled with fetched data.

---

## 6. INTEGRATION REQUIREMENTS
*   **API Client:** Create a configured Axios instance (`api.ts`).
    *   **Interceptor:** Automatically attach `Authorization: Bearer {token}` to requests.
    *   **Error Handling:** Global 401/403 handler -> Redirect to Login.
*   **Image Optimization:** Configure `next.config.js` to allow images from the S3 bucket domain.

## 7. ACCESSIBILITY (A11Y)
*   **Semantic HTML:** Use `<article>`, `<nav>`, `<aside>`, `<main>`.
*   **Keyboard Nav:** Ensure all interactive elements (buttons, links) have `:focus-visible` styles.
*   **Contrast:** Ensure text meets WCAG AA standards (Gray-300 on Slate-950 usually passes).
