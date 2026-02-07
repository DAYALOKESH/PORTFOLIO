'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import api from '@/lib/api/api';
import { BlogPost, Tag } from '@/types';
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";

export default function RecentPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data.slice(0, 3)); // Get top 3
      } catch (error) {
        console.error('Failed to fetch recent posts', error);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <Section id="blog">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-lg text-accent">
                <FileText size={24} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Recent Thoughts</h2>
        </div>
        <Link 
            href="/blog" 
            className="hidden md:flex items-center gap-2 text-muted hover:text-white transition-colors group"
        >
            View all posts <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
            <Card className="flex flex-col h-full group cursor-pointer hover:border-accent/50 transition-colors">
              <div className="flex gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag: Tag | string) => (
                  <span key={typeof tag === 'string' ? tag : tag.name} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-muted mb-6 flex-grow line-clamp-3 text-sm">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-xs text-muted/60">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}
                </span>
                <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  Read <ArrowRight size={12} className="inline ml-1" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors"
        >
            View all posts <ArrowRight size={16} />
        </Link>
      </div>
    </Section>
  );
}
