'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Eye, Clock } from 'lucide-react';
import api from '@/lib/api/api';
import { BlogPost } from '@/types';
import Section from "@/components/ui/Section";

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${slug}`);
                setPost(response.data);
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
        );
    }

    if (!post) {
        return notFound();
    }

    const readingTime = Math.ceil(post.content_markdown.split(/\s+/).length / 200);

    return (
        <div className="pt-24 min-h-screen">
            <Section className="py-12">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft size={18} /> Back to Blog
                </Link>

                {/* Header */}
                <header className="max-w-3xl mb-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                            <span
                                key={typeof tag === 'string' ? tag : tag.id}
                                className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full"
                            >
                                {typeof tag === 'string' ? tag : tag.name}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-muted mb-8">
                        {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted/60 border-t border-b border-white/5 py-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            {post.published_at
                                ? new Date(post.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                                : 'Draft'
                            }
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            {readingTime} min read
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            {post.view_count} views
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {post.featured_image_url && (
                    <div className="max-w-4xl mb-12 rounded-xl overflow-hidden border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                {/* Content */}
                <article className="max-w-3xl prose prose-invert prose-lg 
          prose-headings:font-bold prose-headings:text-white
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-accent prose-code:bg-slate-900 prose-code:px-2 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-white/10
          prose-blockquote:border-l-accent prose-blockquote:text-muted
          prose-li:text-muted
        ">
                    <ReactMarkdown>{post.content_markdown}</ReactMarkdown>
                </article>

                {/* Footer */}
                <div className="max-w-3xl mt-16 pt-8 border-t border-white/10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 border border-white/10 hover:border-accent/50 rounded-lg text-white font-medium transition-all"
                    >
                        <ArrowLeft size={18} /> More Articles
                    </Link>
                </div>
            </Section>
        </div>
    );
}
