"use client";

import Section from "../ui/Section";
import Card from "../ui/Card";
import { resumeData } from "@/data/resume";
import { Code2, ExternalLink } from "lucide-react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import {
  ScrollReveal
} from "@/components/animations/scroll-animations";

interface ProjectData {
  title: string;
  link?: string;
  techStack: string[];
  description: string[];
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="projects">
      <ScrollReveal direction="up" distance={40}>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white/5 rounded-lg text-accent">
            <Code2 size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Selected Projects</h2>
        </div>
      </ScrollReveal>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resumeData.projects.map((project, idx) => (
          <ProjectCard key={idx} project={project} index={idx} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 3D rotation based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], index % 2 === 0 ? [-5, 5] : [5, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 1000,
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
        scale: smoothScale,
        opacity: smoothOpacity,
      }}
      className="transform-gpu"
    >
      <Card className="flex flex-col h-full group relative overflow-hidden">
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full"
          animate={isInView ? { translateX: ["100%", "-100%"] } : {}}
          transition={{ duration: 1.5, delay: index * 0.2, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <motion.h3
              className="text-2xl font-bold text-white group-hover:text-accent transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {project.title}
            </motion.h3>
            {project.link && (
              <motion.a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-white transition-colors"
                whileHover={{ scale: 1.2, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink size={20} />
              </motion.a>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech: string, techIdx: number) => (
              <motion.span
                key={tech}
                className="px-3 py-1 text-xs font-mono rounded-full bg-white/5 border border-white/10 text-muted hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all duration-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2 + techIdx * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>

          <ul className="space-y-3 text-muted/80 text-sm flex-grow">
            {project.description.slice(0, 3).map((desc: string, i: number) => (
              <motion.li
                key={i}
                className="flex gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              >
                <motion.span
                  className="text-accent mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1, type: "spring" }}
                />
                <span>{desc}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
}
