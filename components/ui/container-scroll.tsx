"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useScroll, useTransform, motion, useSpring } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Smooth springs for fluid motion
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  // Mobile scroll transforms
  const rotateMobile = useTransform(smoothProgress, [0, 0.45], [10, 0]);
  const scaleMobile = useTransform(smoothProgress, [0, 0.45], [0.93, 1]);
  const translateMobile = useTransform(smoothProgress, [0, 0.45], [40, 0]);
  const opacityMobile = useTransform(smoothProgress, [0, 0.35], [0.3, 1]);

  // Desktop scroll transforms
  const rotateDesktop = useTransform(smoothProgress, [0, 0.45], [18, 0]);
  const scaleDesktop = useTransform(smoothProgress, [0, 0.45], [1.05, 1]);
  const translateDesktop = useTransform(smoothProgress, [0, 0.45], [0, -100]);

  // Unified dynamic values
  const rotateX = isMobile ? rotateMobile : rotateDesktop;
  const scale = isMobile ? scaleMobile : scaleDesktop;
  const translate = isMobile ? translateMobile : translateDesktop;
  const opacity = isMobile ? opacityMobile : useTransform(smoothProgress, [0, 0.1], [1, 1]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center relative p-2 md:p-20 overflow-hidden w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="py-8 md:py-24 w-full relative">
        <motion.div 
          style={{ translateY: translate, opacity }} 
          className="max-w-5xl mx-auto text-center mb-6 md:mb-12"
        >
          {titleComponent}
        </motion.div>
        
        <Card rotate={rotateX} scale={scale} opacity={opacity} isMobile={isMobile}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Card = ({
  rotate,
  scale,
  opacity,
  isMobile,
  children,
}: {
  rotate: any;
  scale: any;
  opacity: any;
  isMobile: boolean;
  children: React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [isMobile]);

  // Auto oscillating glow for mobile/touch devices
  useEffect(() => {
    if (!isMobile) return;
    let t = 0;
    let raf: number;
    function animate() {
      t += 0.008;
      setGlowPos({
        x: 50 + Math.sin(t) * 30,
        y: 50 + Math.cos(t * 0.6) * 20,
      });
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isMobile]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: rotate,
        scale,
        opacity,
        transformStyle: "preserve-3d",
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl mx-auto h-auto md:h-[40rem] w-full border-4 border-[#6C6C6C] p-3 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl relative overflow-hidden group"
    >
      {/* Interactive shader glow overlay */}
      <div
        className="absolute inset-0 rounded-[30px] pointer-events-none z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 240, 255, 0.07), transparent 50%), radial-gradient(400px circle at ${100 - glowPos.x}% ${glowPos.y}%, rgba(167, 139, 250, 0.04), transparent 45%)`,
        }}
      />
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 p-4 md:p-8 flex flex-col justify-center relative z-[1]">
        {children}
      </div>
    </motion.div>
  );
};
