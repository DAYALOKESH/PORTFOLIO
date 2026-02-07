'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import api from '@/lib/api/api';
import { Project } from '@/types';
import clsx from 'clsx';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project', error);
      }
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await api.put(`/projects/${project.id}`, {
        ...project,
        is_featured: !project.is_featured,
      });
      fetchProjects();
    } catch (error) {
      console.error('Error toggling featured status', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <Link
          href="/admin/projects/editor"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" /> New Project
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading projects...</div>
      ) : (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Thumbnail</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Tech Stack</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-12 w-20 rounded bg-slate-800 overflow-hidden">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{project.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs text-slate-300">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={clsx(
                        'p-1 rounded-full transition-colors',
                        project.is_featured ? 'text-yellow-400 hover:text-yellow-300' : 'text-slate-600 hover:text-slate-500'
                      )}
                    >
                      <Star size={18} fill={project.is_featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/projects/editor?id=${project.id}`}
                      className="inline-flex items-center text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="inline-flex items-center text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
               {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
