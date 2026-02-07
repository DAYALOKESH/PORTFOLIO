'use client';

import { useState } from 'react';
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { motion } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, Twitter } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setStatus('sent');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const socialLinks = [
        { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/' },
        { name: 'GitHub', icon: Github, href: 'https://github.com/' },
        { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/' },
    ];

    return (
        <div className="pt-24 min-h-screen">
            <Section className="py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
                        Get in <span className="text-gradient">Touch</span>
                    </h1>
                    <p className="text-xl text-muted text-center max-w-2xl mx-auto mb-16">
                        Have a project in mind or just want to chat? I&apos;d love to hear from you.
                    </p>

                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <Mail className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Email</h3>
                                        <a href="mailto:hello@example.com" className="text-muted hover:text-accent transition-colors">
                                            hello@example.com
                                        </a>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-accent/10 rounded-lg">
                                        <MapPin className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Location</h3>
                                        <p className="text-muted">San Francisco, CA</p>
                                    </div>
                                </div>
                            </Card>

                            <div className="pt-4">
                                <h3 className="font-semibold text-white mb-4">Connect</h3>
                                <div className="flex gap-4">
                                    {socialLinks.map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-slate-900 border border-white/10 rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all"
                                        >
                                            <link.icon className="w-5 h-5 text-muted hover:text-accent transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card className="lg:col-span-3 p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                        placeholder="What's this about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
                                >
                                    {status === 'sending' ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : status === 'sent' ? (
                                        'Message Sent!'
                                    ) : (
                                        <>
                                            <Send size={18} /> Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </Card>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
}
