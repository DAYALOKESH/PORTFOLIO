"use client";

import Section from "../ui/Section";
import { resumeData } from "@/data/resume";
import { Cpu } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  ScaleOnScroll
} from "@/components/animations/scroll-animations";

export default function Skills() {
  const { skills } = resumeData;

  return (
    <Section id="skills">
      <ScrollReveal direction="up" distance={40}>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white/5 rounded-lg text-accent">
            <Cpu size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Technical Arsenal</h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
        <StaggerItem>
          <SkillGroup title="Languages" items={skills.languages} accentColor="from-blue-500 to-cyan-500" />
        </StaggerItem>
        <StaggerItem>
          <SkillGroup title="Frameworks" items={skills.frameworks} accentColor="from-purple-500 to-pink-500" />
        </StaggerItem>
        <StaggerItem>
          <SkillGroup title="Tools" items={skills.developerTools} accentColor="from-orange-500 to-yellow-500" />
        </StaggerItem>
        <StaggerItem>
          <SkillGroup title="Libraries" items={skills.libraries} accentColor="from-green-500 to-emerald-500" />
        </StaggerItem>
      </StaggerContainer>
    </Section>
  );
}

function SkillGroup({ title, items, accentColor }: { title: string; items: string[], accentColor: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  return (
    <ScaleOnScroll>
      <div ref={ref} className="space-y-4 relative group">
        {/* Animated background glow */}
        <div className={`absolute -inset-4 bg-gradient-to-r ${accentColor} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-xl`} />

        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 relative z-10">{title}</h3>
        <div className="flex flex-wrap gap-2 relative z-10">
          {items.map((item, index) => (
            <motion.span
              key={item}
              className="text-muted hover:text-white transition-colors cursor-default text-sm px-2 py-1 rounded bg-white/5 hover:bg-white/10"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              whileHover={{ scale: 1.05, y: -2 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </ScaleOnScroll>
  )
}
