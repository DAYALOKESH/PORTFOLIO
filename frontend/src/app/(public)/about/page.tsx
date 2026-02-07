'use client';

import Section from "@/components/ui/Section";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-24">
            {/* Hero Section */}
            <Section className="py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        About <span className="text-gradient">Me</span>
                    </h1>
                    <p className="text-xl text-muted leading-relaxed mb-8">
                        I&apos;m a passionate software engineer with expertise in backend development,
                        distributed systems, and building scalable applications. I love solving complex
                        problems and creating elegant solutions that make a real impact.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            className="px-6 py-3 bg-accent hover:bg-accent/80 text-white font-medium rounded-lg transition-colors"
                        >
                            Download Resume
                        </a>
                        <Link
                            href="/skills"
                            className="px-6 py-3 border border-white/20 hover:border-accent/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2 group"
                        >
                            View Skills <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </Section>

            {/* Experience Section */}
            <Experience />

            {/* Education Section */}
            <Education />
        </div>
    );
}
