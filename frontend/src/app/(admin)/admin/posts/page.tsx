'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '@/lib/api/api';
import { BlogPost } from '@/types';
import clsx from 'clsx';

export default function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts/admin/all', {
        params: { status: filter === 'all' ? undefined : filter }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link
          href="/admin/posts/editor"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} className="mr-2" /> New Post
        </Link>
      </div>

      <div className="flex gap-2 border-b border-slate-800 pb-4">
        {['all', 'published', 'draft', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400">Loading posts...</div>
      ) : (
        <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Views</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{post.title}</td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        post.status === 'published'
                          ? 'bg-green-500/10 text-green-400'
                          : post.status === 'draft'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-red-500/10 text-red-400'
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{post.view_count}</td>
                  <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/posts/editor?id=${post.id}`}
                      className="inline-flex items-center text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No posts found.
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
