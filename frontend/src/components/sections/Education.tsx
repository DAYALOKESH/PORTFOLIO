"use client";

import Section from "../ui/Section";
import Card from "../ui/Card";
import { resumeData } from "@/data/resume";
import { GraduationCap } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ScrollReveal
} from "@/components/animations/scroll-animations";

interface EducationData {
  institution: string;
  degree: string;
  period: string;
  location: string;
  details?: string[];
}

export default function Education() {
  return (
    <Section id="education">
      <ScrollReveal direction="up" distance={40}>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white/5 rounded-lg text-accent">
            <GraduationCap size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Education</h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        {resumeData.education.map((edu, idx) => (
          <EducationCard key={idx} edu={edu} index={idx} />
        ))}
      </div>
    </Section>
  );
}

function EducationCard({ edu, index }: { edu: EducationData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 20 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      style={{ perspective: 1000 }}
    >
      <Card className="group relative overflow-hidden">
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        <div className="relative z-10">
          <motion.h3
            className="text-xl font-bold text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            {edu.institution}
          </motion.h3>

          <motion.p
            className="text-accent mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            {edu.degree}
          </motion.p>

          <motion.div
            className="flex justify-between text-sm text-muted font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <span>{edu.period}</span>
            <span>{edu.location}</span>
          </motion.div>

          {edu.details && (
            <ul className="mt-4 list-disc list-inside text-muted/80 text-sm">
              {edu.details.map((d: string, i: number) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  {d}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
