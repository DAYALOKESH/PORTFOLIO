"use client";

import Section from "../ui/Section";
import { resumeData } from "@/data/resume";
import { Mail, MapPin, Sparkles } from "lucide-react";
import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <Section id="contact" className="pb-32">
      <motion.div
        ref={ref}
        className="glass p-8 md:p-12 rounded-2xl text-center relative overflow-hidden"
        style={{ scale: smoothScale, opacity: smoothOpacity, y: smoothY }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={isInView ? {
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              } : {}}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <motion.div
            className="inline-flex items-center gap-2 text-accent mb-4"
            animate={isInView ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={20} />
            <span className="text-sm font-mono">Available for opportunities</span>
            <Sparkles size={20} />
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Let's Build Something{" "}
            <motion.span
              className="text-accent"
              animate={isInView ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              } : {}}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Amazing
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-muted text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            I am currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </motion.p>

          <motion.div
            className="flex flex-col md:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.a
              href={`mailto:${resumeData.personalInfo.email}`}
              className="px-8 py-4 bg-accent text-white rounded-full font-bold flex items-center gap-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <Mail size={20} className="relative z-10" />
              <span className="relative z-10">Say Hello</span>
            </motion.a>

            <motion.div
              className="flex items-center gap-2 text-muted"
              whileHover={{ scale: 1.05, color: "#fff" }}
            >
              <MapPin size={20} />
              <span>{resumeData.personalInfo.location}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
}
