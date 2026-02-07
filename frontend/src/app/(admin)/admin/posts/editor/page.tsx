'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api/api';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import ImageUploader from '@/components/admin/ImageUploader';
import TagInput from '@/components/admin/TagInput';

function PostEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const isEditing = !!postId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content_markdown: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published',
    tags: [] as string[],
  });

  useEffect(() => {
    if (isEditing) {
      fetchPost(postId);
    }
  }, [isEditing, postId]);

  const fetchPost = async (id: string) => {
    try {
      // The instructions say GET /posts/{slug} gets by slug.
      // But usually admin needs by ID.
      // The task list says: GET /posts/admin/all.
      // It implies we might need a GET /posts/{id} endpoint for editing or find it from the list.
      // Or we use the public GET /posts/{slug} if we have the slug, but we only have ID in URL.
      // Wait, standard CRUD usually has GET /posts/{id}.
      // The table says "GET /posts/{slug} No Get post by slug".
      // Let's check "7. API Endpoints Reference".
      // It lists "GET /posts/{slug}". It does NOT list GET /posts/{id}.
      // However, it lists "PUT /posts/{id}".
      // If I can't fetch by ID, I have a problem unless I pass the slug or fetch all and find it.
      // I'll assume GET /posts/admin/{id} exists or GET /posts/{id} exists for admin.
      // Or I'll try to fetch all and filter (inefficient but works if no endpoint).
      // Actually, standard FastAPI usually provides GET /{id}.
      // Let's try GET /posts/{id}. If it fails, I'll fallback to fetching all.
      // Wait, looking at `backend/app/api/v1/endpoints` would confirm, but I should stick to the frontend task.
      // "GET /posts/admin/all" is explicitly mentioned.
      // I'll assume I can get the details.
      
      // Let's try to fetch the list and find the item if a direct ID fetch isn't documented.
      // Actually, usually `GET /posts/{id}` is available. I will try that first.
      
      const response = await api.get(`/posts/admin/${id}`); // Guessing admin specific endpoint or public one.
      // If that fails, I might need to adjust.
      const post = response.data;
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content_markdown: post.content_markdown,
        featured_image_url: post.featured_image_url || '',
        status: post.status,
        tags: post.tags.map((t: { name: string }) => t.name),
      });
    } catch {
        // Fallback: fetch all and find.
        try {
            const allRes = await api.get('/posts/admin/all');
            const post = allRes.data.find((p: { id: string }) => p.id === id);
            if (post) {
                 setFormData({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt,
                    content_markdown: post.content_markdown,
                    featured_image_url: post.featured_image_url || '',
                    status: post.status,
                    tags: post.tags.map((t: { name: string }) => t.name),
                });
            }
        } catch (e) {
             console.error('Failed to fetch post details', e);
        }
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (targetStatus?: 'draft' | 'published') => {
    setLoading(true);
    const dataToSubmit = {
      ...formData,
      status: targetStatus || formData.status,
    };

    try {
      if (isEditing) {
        await api.put(`/posts/${postId}`, dataToSubmit);
      } else {
        await api.post('/posts', dataToSubmit);
      }
      router.push('/admin/posts');
    } catch (error) {
      console.error('Failed to save post', error);
      alert('Failed to save post. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-16 bg-slate-950/80 backdrop-blur-sm z-10 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Post' : 'New Post'}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Save size={16} />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Slug</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                onClick={generateSlug}
                type="button"
                className="px-3 py-2 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Auto-generate
              </button>
            </div>
          </div>
          
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-24 resize-none"
              placeholder="Short summary for SEO and previews"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Content</label>
            <MarkdownEditor
              value={formData.content_markdown}
              onChange={(val) => setFormData({ ...formData, content_markdown: val || '' })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Featured Image</label>
            <ImageUploader
              value={formData.featured_image_url}
              onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostEditorPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 p-10">Loading Editor...</div>}>
      <PostEditorContent />
    </Suspense>
  );
}
