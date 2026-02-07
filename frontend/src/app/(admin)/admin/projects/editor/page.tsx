'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api/api';
import ImageUploader from '@/components/admin/ImageUploader';
import TagInput from '@/components/admin/TagInput';

function ProjectEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');
  const isEditing = !!projectId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: [] as string[],
    repo_url: '',
    live_url: '',
    thumbnail_url: '',
    order: 0,
    is_featured: false,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProject(projectId);
    }
  }, [isEditing, projectId]);

  const fetchProject = async (id: string) => {
    try {
      const response = await api.get(`/projects/${id}`);
      const project = response.data;
      setFormData({
        title: project.title,
        description: project.description,
        tech_stack: project.tech_stack,
        repo_url: project.repo_url || '',
        live_url: project.live_url || '',
        thumbnail_url: project.thumbnail_url || '',
        order: project.order,
        is_featured: project.is_featured,
      });
    } catch (error) {
      console.error('Failed to fetch project details', error);
      // Fallback
      try {
           const allRes = await api.get('/projects');
           const project = allRes.data.find((p: { id: string }) => p.id === id);
           if (project) {
              setFormData({
                title: project.title,
                description: project.description,
                tech_stack: project.tech_stack,
                repo_url: project.repo_url || '',
                live_url: project.live_url || '',
                thumbnail_url: project.thumbnail_url || '',
                order: project.order,
                is_featured: project.is_featured,
            });
           }
      } catch (e) {
          console.error("Failed fallback fetch", e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/projects/${projectId}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      router.push('/admin/projects');
    } catch (error) {
      console.error('Failed to save project', error);
      alert('Failed to save project. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-16 bg-slate-950/80 backdrop-blur-sm z-10 py-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">{isEditing ? 'Edit Project' : 'New Project'}</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Save size={16} />
          Save Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Project Title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none h-32 resize-none"
              placeholder="Detailed description of the project"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Repository URL</label>
              <input
                type="url"
                value={formData.repo_url}
                onChange={(e) => setFormData({ ...formData, repo_url: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Live URL</label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
           <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tech Stack</label>
            <TagInput
              tags={formData.tech_stack}
              onChange={(tags) => setFormData({ ...formData, tech_stack: tags })}
              placeholder="Add technologies (e.g. React, Python)..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Thumbnail</label>
            <ImageUploader
              value={formData.thumbnail_url}
              onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
            />
          </div>

          <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-4">
             <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Featured Project</label>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Order Priority</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                 className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
               <p className="text-xs text-slate-500">Higher numbers appear first (or last depending on sort)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectEditorPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 p-10">Loading Editor...</div>}>
      <ProjectEditorContent />
    </Suspense>
  );
}
