'use client';

import Section from "@/components/ui/Section";
import { resumeData } from "@/data/resume";
import { Cpu, Code, Database, Wrench, Library } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    ScrollReveal,
    StaggerContainer,
    StaggerItem,
    ScaleOnScroll
} from "@/components/animations/scroll-animations";
import { FloatingIcons, type FloatingIconsProps } from "@/components/ui/floating-icons";

// Tech Skill Icons - subtle monochrome with accent hints
const IconPython = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 6 4.02 6 5.5V8h6v1H5.5C3.02 9 2 11.04 2 13.5S3.02 18 5.5 18H8v-2.5C8 12.02 10.02 10 12.5 10h5c1.1 0 2-.9 2-2V5.5C19.5 4.02 17.52 2 12 2z" fill="currentColor" opacity="0.7" />
        <path d="M12 22c5.52 0 6-2.02 6-3.5V16h-6v-1h6.5c2.48 0 3.5-2.04 3.5-4.5S20.98 6 18.5 6H16v2.5c0 3.48-2.02 5.5-4.5 5.5h-5c-1.1 0-2 .9-2 2v2.5c0 1.48 1.98 3.5 7.5 3.5z" fill="currentColor" opacity="0.5" />
    </svg>
);

const IconReact = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.8" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" transform="rotate(120 12 12)" />
    </svg>
);

const IconDocker = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 4h2v2h-2V4zm-3 0h2v2h-2V4zm-3 0h2v2H7V4zm-3 3h2v2H4V7zm3 0h2v2H7V7zm3 0h2v2h-2V7zm3 0h2v2h-2V7zm3 0h2v2h-2V7z" fill="currentColor" opacity="0.6" />
        <path d="M21.8 11c-.4-.3-.9-.5-1.4-.5-.2 0-.5 0-.7.1-.2-1.1-.8-2-1.6-2.6l-.3-.2-.2.3c-.4.5-.5 1.4-.5 2 0 .6.1 1.1.4 1.6-.6.3-1.5.5-2.3.5H2.1l-.1.5c-.1.9 0 1.8.3 2.6.5 1.2 1.3 2.1 2.3 2.7 1.1.6 2.9 1 4.9 1 1 0 2-.1 3-.3 1.1-.2 2.2-.7 3.1-1.2.8-.5 1.5-1.1 2.1-1.9.9-1.1 1.5-2.4 1.8-3.7h.2c.8 0 1.5-.3 1.9-.8.2-.2.3-.4.4-.7l.1-.3-.3-.2z" fill="currentColor" opacity="0.6" />
    </svg>
);

const IconPostgreSQL = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 4.24 2 7v10c0 2.76 4.48 5 10 5s10-2.24 10-5V7c0-2.76-4.48-5-10-5z" fill="currentColor" opacity="0.4" />
        <ellipse cx="12" cy="7" rx="10" ry="5" fill="currentColor" opacity="0.6" />
    </svg>
);

const IconTypeScript = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor" opacity="0.5" />
        <path d="M14.5 17v-3.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M6 11h6m-3 0v6" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    </svg>
);

const IconAWS = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12l2-6h2l2 6m-5-2h4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M12 12l1-6h1.5l1.5 4 1.5-4H19l1 6" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M4 16c0 0 4 2 8 2s8-2 8-2" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </svg>
);

const IconFastAPI = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.4" />
        <path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
    </svg>
);

const IconGit = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.6 10.3L13.7 2.4c-.5-.5-1.3-.5-1.8 0l-1.6 1.6 2 2c.5-.2 1-.3 1.5-.1.7.2 1.2.7 1.4 1.4.2.5.1 1-.1 1.5l1.9 1.9c.5-.2 1-.3 1.5-.1.9.2 1.5 1.1 1.5 2 0 1.1-.9 2-2 2s-2-.9-2-2c0-.4.1-.7.3-1l-1.8-1.8v4.7c.6.3 1 .9 1 1.6 0 1.1-.9 2-2 2s-2-.9-2-2c0-.7.3-1.3 1-1.6V9.4c-.6-.3-1-.9-1-1.6 0-.3.1-.6.2-.8l-2-2L2.4 12c-.5.5-.5 1.3 0 1.8l7.9 7.9c.5.5 1.3.5 1.8 0l9.5-9.5c.5-.5.5-1.3 0-1.9z" fill="currentColor" opacity="0.6" />
    </svg>
);

const IconNextJS = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.5" />
        <path d="M9 8v8l8-8" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M15 8v6" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    </svg>
);

const IconRedis = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12l8-4 8 4-8 4-8-4z" fill="currentColor" opacity="0.5" />
        <path d="M4 12v4l8 4 8-4v-4" fill="currentColor" opacity="0.3" />
        <path d="M4 8l8-4 8 4-8 4-8-4z" fill="currentColor" opacity="0.7" />
    </svg>
);

const IconKubernetes = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="currentColor" opacity="0.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.8" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1" opacity="0.8" />
    </svg>
);

const IconGraphQL = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L3 8v8l9 5 9-5V8l-9-5z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
        <circle cx="12" cy="3" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="3" cy="8" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="3" cy="16" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="12" cy="21" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="21" cy="16" r="2" fill="currentColor" opacity="0.7" />
        <circle cx="21" cy="8" r="2" fill="currentColor" opacity="0.7" />
    </svg>
);

const IconTailwind = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.8 1.3.9.9 1.9 2 4.2 2 2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.8-1.3-.9-.9-1.9-2-4.2-2z" fill="currentColor" opacity="0.6" />
        <path d="M7.5 12c-2.7 0-4.4 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.8 1.3.9.9 1.9 2 4.2 2 2.7 0 4.4-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.8-1.3-.9-.9-1.9-2-4.2-2z" fill="currentColor" opacity="0.6" />
    </svg>
);

const IconMongoDB = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2c0 0-1 3-1 6s1 4 1 5v9s.5-1 1-2c0-3 0-7 0-7s1-2 1-5-2-6-2-6z" fill="currentColor" opacity="0.7" />
        <path d="M12 13c-3 0-5-2-5-5s2-5 5-5" fill="currentColor" opacity="0.3" />
        <path d="M12 13c3 0 5-2 5-5s-2-5-5-5" fill="currentColor" opacity="0.5" />
    </svg>
);

const IconLinux = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="6" fill="currentColor" opacity="0.5" />
        <circle cx="10" cy="7" r="1" fill="currentColor" opacity="0.8" />
        <circle cx="14" cy="7" r="1" fill="currentColor" opacity="0.8" />
        <path d="M8 14c-2 2-3 4-3 6h14c0-2-1-4-3-6" fill="currentColor" opacity="0.4" />
    </svg>
);

const IconGo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12c0 0 2-3 5-3h8c3 0 5 3 5 3s-2 3-5 3H8c-3 0-5-3-5-3z" fill="currentColor" opacity="0.5" />
        <circle cx="16" cy="12" r="2" fill="currentColor" opacity="0.8" />
        <circle cx="16" cy="12" r="1" fill="currentColor" opacity="0.3" />
    </svg>
);

// Define floating icons with positions - spread more around the edges
const floatingIcons: FloatingIconsProps['icons'] = [
    { id: 1, icon: IconPython, className: 'top-[12%] left-[5%]' },
    { id: 2, icon: IconReact, className: 'top-[8%] right-[8%]' },
    { id: 3, icon: IconDocker, className: 'top-[85%] left-[6%]' },
    { id: 4, icon: IconPostgreSQL, className: 'bottom-[12%] right-[5%]' },
    { id: 5, icon: IconTypeScript, className: 'top-[5%] left-[25%]' },
    { id: 6, icon: IconAWS, className: 'top-[6%] right-[25%]' },
    { id: 7, icon: IconFastAPI, className: 'bottom-[8%] left-[20%]' },
    { id: 8, icon: IconGit, className: 'top-[40%] left-[3%]' },
    { id: 9, icon: IconNextJS, className: 'top-[75%] right-[8%]' },
    { id: 10, icon: IconRedis, className: 'bottom-[35%] right-[3%]' },
    { id: 11, icon: IconKubernetes, className: 'top-[55%] right-[4%]' },
    { id: 12, icon: IconGraphQL, className: 'top-[65%] left-[4%]' },
    { id: 13, icon: IconTailwind, className: 'top-[3%] left-[50%]' },
    { id: 14, icon: IconMongoDB, className: 'bottom-[5%] right-[35%]' },
    { id: 15, icon: IconLinux, className: 'top-[22%] right-[4%]' },
    { id: 16, icon: IconGo, className: 'bottom-[20%] left-[4%]' },
];

export default function SkillsPage() {
    const { skills } = resumeData;

    const allCategories = [
        { title: "Languages", items: skills.languages, icon: Code, color: "from-blue-500/80 to-cyan-500/80" },
        { title: "Frameworks", items: skills.frameworks, icon: Database, color: "from-purple-500/80 to-pink-500/80" },
        { title: "Developer Tools", items: skills.developerTools, icon: Wrench, color: "from-orange-500/80 to-yellow-500/80" },
        { title: "Libraries", items: skills.libraries, icon: Library, color: "from-green-500/80 to-emerald-500/80" },
    ];

    return (
        <div className="pt-24 min-h-screen relative overflow-hidden">
            {/* Subtle gradient background */}
            <div className="fixed inset-0 -z-20">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Floating Icons Background - subtle layer */}
            <div className="fixed inset-0 z-0 opacity-85">
                <FloatingIcons icons={floatingIcons} className="text-white" />
            </div>

            <Section className="py-20 relative z-10">
                <ScrollReveal direction="up" distance={40}>
                    <div className="text-center mb-16">
                        <motion.div
                            className="inline-flex items-center gap-2 text-accent mb-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Cpu size={24} />
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Technical <span className="text-gradient">Arsenal</span>
                        </h1>
                        <p className="text-xl text-muted max-w-2xl mx-auto">
                            A comprehensive overview of my technical skills and expertise across different domains.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Skills Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-5xl mx-auto" staggerDelay={0.15}>
                    {allCategories.map((category) => (
                        <StaggerItem key={category.title}>
                            <SkillCategory
                                title={category.title}
                                items={category.items}
                                icon={category.icon}
                                accentColor={category.color}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                {/* Proficiency Section */}
                <ScrollReveal direction="up" delay={0.3}>
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold mb-8 text-center">Proficiency Levels</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <ProficiencyCard
                                level="Expert"
                                skills={["Python", "FastAPI", "PostgreSQL", "Docker"]}
                                color="from-green-500/90 to-emerald-500/90"
                            />
                            <ProficiencyCard
                                level="Advanced"
                                skills={["React", "Next.js", "TypeScript", "AWS"]}
                                color="from-blue-500/90 to-cyan-500/90"
                            />
                            <ProficiencyCard
                                level="Proficient"
                                skills={["Kubernetes", "Go", "GraphQL", "Redis"]}
                                color="from-purple-500/90 to-pink-500/90"
                            />
                        </div>
                    </div>
                </ScrollReveal>
            </Section>
        </div>
    );
}

function SkillCategory({
    title,
    items,
    icon: Icon,
    accentColor,
}: {
    title: string;
    items: string[];
    icon: any;
    accentColor: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });

    return (
        <ScaleOnScroll>
            <div
                ref={ref}
                className="relative p-6 rounded-xl border border-white/[0.08] bg-background/60 backdrop-blur-xl group hover:border-white/20 transition-all duration-500"
            >
                {/* Subtle background glow */}
                <div className={`absolute -inset-px bg-gradient-to-r ${accentColor} opacity-0 group-hover:opacity-[0.08] blur-xl transition-opacity duration-500 rounded-xl`} />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${accentColor}`}>
                            <Icon size={20} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <span className="ml-auto text-xs text-muted/60 font-mono">{items.length}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {items.map((item, itemIndex) => (
                            <motion.span
                                key={item}
                                className="px-2.5 py-1 text-sm rounded-md bg-white/[0.03] border border-white/[0.06] text-muted/80 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-default"
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{
                                    duration: 0.3,
                                    delay: itemIndex * 0.02,
                                    ease: "easeOut"
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </ScaleOnScroll>
    );
}

function ProficiencyCard({ level, skills, color }: { level: string; skills: string[]; color: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            className="p-5 rounded-xl border border-white/[0.08] bg-background/60 backdrop-blur-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
        >
            <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${color} text-white text-xs font-semibold mb-4`}>
                {level}
            </div>
            <div className="space-y-1.5">
                {skills.map((skill, i) => (
                    <motion.p
                        key={skill}
                        className="text-sm text-muted/70"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                    >
                        {skill}
                    </motion.p>
                ))}
            </div>
        </motion.div>
    );
}
