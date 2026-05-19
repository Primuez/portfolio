"use client";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export default function FloatingMobileCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Show after scrolling past the 100dvh hero
    setIsVisible(latest > 300);
  });

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: isVisible ? 0 : 100, opacity: isVisible ? 1 : 0 }}
      className="fixed bottom-6 left-0 right-0 z-50 px-6 md:hidden pointer-events-none"
    >
      <a
        href="#contact"
        className="w-full min-h-[56px] pointer-events-auto bg-cyan-500 text-black font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-95 transition-transform flex items-center justify-center"
      >
        Start a Project
      </a>
    </motion.div>
  );
}
