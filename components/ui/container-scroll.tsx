"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleRange = isMobile ? [1, 1] : [1.05, 1];
  const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100]);

  if (isMobile) {
    return (
      <div className="relative p-2">
        {/* Mobile: whileInView animations for visible scroll effect */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-60px" }}
          className="py-8 w-full relative"
        >
          <div className="max-w-5xl mx-auto text-center mb-8">
            {titleComponent}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-40px" }}
          >
            <MobileCard>{children}</MobileCard>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{ perspective: "1000px" }}
      >
        <Header titleComponent={titleComponent} translate={translate} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
  isMobile?: boolean;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

/** Mobile card — auto height so content isn't cut, with ambient glow */
function MobileCard({ children }: { children: React.ReactNode }) {
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
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
  }, []);

  return (
    <div
      className="max-w-5xl mx-auto w-full border-4 border-[#6C6C6C] p-2 bg-[#222222] rounded-[30px] shadow-2xl relative overflow-hidden"
      style={{
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
    >
      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 rounded-[30px] pointer-events-none z-10 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 240, 255, 0.07), transparent 50%), radial-gradient(400px circle at ${100 - glowPos.x}% ${glowPos.y}%, rgba(167, 139, 250, 0.04), transparent 45%)`,
        }}
      />
      <div className="w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 p-4 flex flex-col justify-center relative z-[1]">
        {children}
      </div>
    </div>
  );
}

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
  isMobile?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setGlowPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    []
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl relative overflow-hidden group"
    >
      {/* Interactive shader glow overlay */}
      <div
        className="absolute inset-0 rounded-[30px] pointer-events-none z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, rgba(0, 240, 255, 0.07), transparent 50%), radial-gradient(400px circle at ${100 - glowPos.x}% ${glowPos.y}%, rgba(167, 139, 250, 0.04), transparent 45%)`,
        }}
      />
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl p-4 md:p-8 flex flex-col justify-center relative z-[1]">
        {children}
      </div>
    </motion.div>
  );
};
