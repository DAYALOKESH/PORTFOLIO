"use client";

import Section from "../ui/Section";
import Card from "../ui/Card";
import { resumeData } from "@/data/resume";
import { Briefcase } from "lucide-react";
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  SlideIn
} from "@/components/animations/scroll-animations";

export default function Experience() {
  return (
    <Section id="experience">
      <ScrollReveal direction="up" distance={40}>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-white/5 rounded-lg text-accent">
            <Briefcase size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Experience</h2>
        </div>
      </ScrollReveal>

      <StaggerContainer className="space-y-8" staggerDelay={0.15}>
        {resumeData.experience.map((job, idx) => (
          <StaggerItem key={idx}>
            <SlideIn direction={idx % 2 === 0 ? 'left' : 'right'} distance={80}>
              <Card className="relative group overflow-hidden">
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Timeline dot */}
                <div className="absolute left-0 top-8 w-3 h-3 rounded-full bg-accent hidden md:block -ml-[1.85rem] ring-4 ring-background" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                        {job.role}
                      </h3>
                      <p className="text-lg text-muted">{job.company}</p>
                    </div>
                    <div className="text-sm font-mono text-muted/60 text-right">
                      <p>{job.period}</p>
                      <p>{job.location}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 text-muted/80 list-disc list-inside">
                    {job.description.map((desc, i) => (
                      <li key={i} className="leading-relaxed">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </SlideIn>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
