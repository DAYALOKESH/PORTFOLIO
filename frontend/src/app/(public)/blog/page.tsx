'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import api from '@/lib/api/api';
import { BlogPost, Tag } from '@/types';
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <Section className="pt-32 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Engineering Blog</h1>
        <p className="text-xl text-muted max-w-2xl">
          Thoughts on distributed systems, backend architecture, and building scalable software.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
            <Card className="flex flex-col h-full group cursor-pointer hover:border-accent/50 transition-colors">
              <div className="flex gap-2 mb-4 flex-wrap">
                {post.tags.map((tag: Tag | string) => (
                  <span key={typeof tag === 'string' ? tag : tag.name} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-muted mb-6 flex-grow line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-sm text-muted/60">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                </span>
                <span className="flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight size={16} />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
