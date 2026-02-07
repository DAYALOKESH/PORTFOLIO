'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import api from '@/lib/api/api';
import { Project } from '@/types';
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import clsx from 'clsx';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [techStacks, setTechStacks] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
        
        // Extract unique tech stacks
        const stacks = new Set<string>();
        response.data.forEach((p: Project) => p.tech_stack.forEach(t => stacks.add(t)));
        setTechStacks(Array.from(stacks).sort());
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.tech_stack.includes(filter));

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
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Portfolio Projects</h1>
        <p className="text-xl text-muted max-w-2xl">
          A showcase of my work in backend engineering, distributed systems, and full-stack development.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
            filter === 'all' 
              ? "bg-accent/20 border-accent text-accent" 
              : "bg-transparent border-white/10 text-muted hover:border-white/20"
          )}
        >
          All
        </button>
        {techStacks.map(stack => (
          <button
            key={stack}
            onClick={() => setFilter(stack)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              filter === stack 
                ? "bg-accent/20 border-accent text-accent" 
                : "bg-transparent border-white/10 text-muted hover:border-white/20"
            )}
          >
            {stack}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col h-full group hover:border-accent/50 transition-colors p-0 overflow-hidden">
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {project.is_featured && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-white text-xs font-bold rounded shadow-lg">
                  FEATURED
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                {project.title}
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech_stack.slice(0, 4).map(tech => (
                  <span key={tech} className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    {tech}
                  </span>
                ))}
                {project.tech_stack.length > 4 && (
                    <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        +{project.tech_stack.length - 4}
                    </span>
                )}
              </div>

              <p className="text-muted mb-6 flex-grow text-sm leading-relaxed line-clamp-4">
                {project.description}
              </p>

              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    <Github size={16} /> Source
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors ml-auto"
                  >
                    Live Demo <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
