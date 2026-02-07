"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export default function Section({ children, id, className, delay = 0 }: SectionProps) {
  return (
    <section id={id} className={clsx("py-20 md:py-32 relative", className)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        className="container-width"
      >
        {children}
      </motion.div>
    </section>
  );
}
