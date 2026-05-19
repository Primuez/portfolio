"use client";
import { motion } from "motion/react";
import { ShaderBackground } from "./ShaderBackground";
import { ArrowUpRight, Github } from "lucide-react";

export default function GithubShowcase() {
  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden border-y border-white/10">
      {/* PERFORMANCE FIX: Only render heavy Canvas on md+ screens.
        Mobile gets a sleek, dark gradient fallback to save battery and boost FPS. */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] to-[#111] md:bg-none">
        <div className="hidden md:block w-full h-full">
          <ShaderBackground />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md bg-black/40 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl shadow-cyan-500/10"
        >
          <div className="flex flex-col gap-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium w-fit">
              <Github className="w-4 h-4" />
              <span>Open Source</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Architected in public.
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Explore the repositories, custom automation scripts, and WebGL experiments that power our elite AI infrastructure.
            </p>
          </div>

          <a
            href="https://github.com/primuez"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-cyan-400 transition-colors duration-300 min-h-[44px]"
          >
            <span>View GitHub</span>
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
