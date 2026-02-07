export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
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

export interface Project {
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

export interface PostCreate {
  title: string;
  slug?: string;
  excerpt?: string;
  content_markdown: string;
  featured_image_url?: string;
  status: "draft" | "published";
  tags: string[];
}

export interface ProjectCreate {
  title: string;
  description: string;
  tech_stack: string[];
  repo_url?: string;
  live_url?: string;
  thumbnail_url: string;
  order?: number;
  is_featured?: boolean;
}
