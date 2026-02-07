"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { resumeData } from "@/data/resume";
import { useRef } from "react";

export default function Hero() {
  const { name, role, summary } = resumeData.personalInfo;
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects on scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Split name for staggered effect
  const nameParts = name.split(" ");

  return (
    <section
      ref={ref}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Primary gradient blob */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Secondary gradient blob */}
        <motion.div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px]"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        className="container-width z-10"
        style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
      >
        {/* Intro text with typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            className="text-accent font-mono mb-4 tracking-widest text-sm uppercase flex items-center gap-2"
          >
            <motion.span
              className="w-8 h-[2px] bg-accent"
              initial={{ width: 0 }}
              animate={{ width: 32 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            Portfolio 2026
          </motion.p>
        </motion.div>

        {/* Name with staggered character animation */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-white overflow-hidden">
          {nameParts.map((part, i) => (
            <span key={i} className="inline-block mr-4 md:mr-8 overflow-hidden">
              {part.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  className="inline-block"
                  initial={{ y: 100, opacity: 0, rotateX: 90 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.15 + charIndex * 0.03,
                    duration: 0.6,
                    ease: [0.25, 0.4, 0.25, 1]
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Role with slide and fade */}
        <motion.p
          initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
          className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed"
        >
          {role}
        </motion.p>

        {/* Summary with reveal animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-8 text-muted/80 max-w-xl text-sm md:text-base relative"
        >
          <motion.div
            className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent via-accent/50 to-transparent"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 1.4, duration: 0.8 }}
          />
          <p className="pl-4">{summary}</p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-accent rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
