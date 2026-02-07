"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function Card({ children, className, hoverEffect = true }: CardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, borderColor: "rgba(255,255,255,0.2)" } : undefined}
      className={clsx(
        "glass rounded-xl p-6 md:p-8 transition-colors duration-300",
        "bg-white/5 border border-white/5", // Fallback/Base
        className
      )}
    >
      {children}
    </motion.div>
  );
}
