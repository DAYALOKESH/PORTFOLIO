# Development Workflow & Checklist

This file tracks the active development status of the Portfolio & CMS project.

## 1. Initialization Phase
- [x] Create Global Blueprint (`REQUIREMENTS.md`)
- [x] Create Layer-Specific Requirements (`docs/REQUIREMENTS_*.md`)
- [x] Initialize Backend Directory Structure

## 2. Backend Implementation
- [x] Setup Virtual Env & `requirements.txt`
- [x] User Model & Auth Endpoint
- [x] Blog Post Model & CRUD Endpoints
- [x] S3 Integration
- [x] Markdown Pipeline
- [ ] **Verify:** Database Setup (Docker Compose for Postgres)
- [ ] **Verify:** Run and Test API

## 3. Frontend Implementation
- [x] Install Next.js & Tailwind
- [x] Setup basic directory structure
- [x] **UI:** Navbar (Responsive, Glassmorphism)
- [x] **UI:** Hero Section (Animated)
- [x] **UX:** Page Transitions (`template.tsx`)
- [x] Setup Zustand Stores (Auth)
- [x] Admin Dashboard UI (Layout)
- [x] Markdown Editor Component
- [ ] Public Portfolio Grid
- [ ] Public Blog Listing

## 4. Integration & Polish
- [ ] Connect Frontend to Backend API
- [ ] Dark Mode Polish
- [ ] Deployment Configuration (Dockerfile)