'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, FileText, FolderKanban } from 'lucide-react';
import api from '@/lib/api/api';
import { BlogPost, Project } from '@/types';

export default function DashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, projectsRes] = await Promise.all([
          api.get('/posts/admin/all'),
          api.get('/projects'),
        ]);
        setPosts(postsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalViews = posts.reduce((sum, post) => sum + post.view_count, 0);
  const publishedPosts = posts.filter(p => p.status === 'published').length;

  if (loading) return <div className="text-center p-10">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/posts/editor"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} /> New Post
          </Link>
          <Link
            href="/admin/projects/editor"
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} /> New Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Posts" value={posts.length} icon={FileText} color="text-blue-500" />
        <StatCard title="Published" value={publishedPosts} icon={FileText} color="text-green-500" />
        <StatCard title="Total Projects" value={projects.length} icon={FolderKanban} color="text-purple-500" />
        <StatCard title="Total Views" value={totalViews} icon={Eye} color="text-yellow-500" />
      </div>

      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 5).map((post) => (
                <tr key={post.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-white">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{post.view_count}</td>
                  <td className="px-4 py-3">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/editor?id=${post.id}`} className="text-indigo-400 hover:text-indigo-300">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-slate-800 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );
}
