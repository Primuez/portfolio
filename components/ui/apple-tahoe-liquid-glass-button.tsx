'use client';

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Base64-encoded WebP displacement map for SVG liquid glass filter
const WEBP_DISPLACEMENT_MAP = "https://assets.codepen.io/252820/glass-displacement.webp";

const glassButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 ease-out cursor-pointer select-none overflow-hidden border border-white/[0.08] hover:border-white/[0.15] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan",
  {
    variants: {
      size: {
        sm: "h-9 px-4 text-xs gap-1.5 rounded-xl",
        md: "h-11 px-6 text-sm gap-2 rounded-2xl",
        lg: "h-14 px-8 text-base gap-2.5 rounded-2xl",
        xl: "h-16 px-10 text-lg gap-3 rounded-3xl",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
  glassColor?: string;
  glowColor?: string;
  asChild?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, glassColor, glowColor, ...props }, ref) => {
    const filterId = React.useId().replace(/:/g, "");
    
    return (
      <>
        {/* SVG Filter for liquid glass displacement effect */}
        <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <defs>
            <filter id={`liquid-glass-${filterId}`} primitiveUnits="objectBoundingBox">
              <feImage
                href={WEBP_DISPLACEMENT_MAP}
                result="displacement-map"
                x="0"
                y="0"
                width="1"
                height="1"
                preserveAspectRatio="none"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="displacement-map"
                scale="0.03"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Scoped styles for the liquid glass effect */}
        <style>{`
          .btn-liquid-lens-${filterId} {
            background-color: ${glassColor || "oklch(from white l c h / 5%)"};
            backdrop-filter: blur(12px) url(#liquid-glass-${filterId}) saturate(160%);
            -webkit-backdrop-filter: blur(12px) saturate(160%);
            box-shadow:
              inset 0 1px 1px 0 rgba(255, 255, 255, 0.08),
              inset 0 -1px 1px 0 rgba(0, 0, 0, 0.12),
              0 1px 3px 0 rgba(0, 0, 0, 0.15),
              0 4px 12px -2px rgba(0, 0, 0, 0.1),
              0 0 0 0.5px rgba(255, 255, 255, 0.06);
            transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .btn-liquid-${filterId}:hover .btn-liquid-lens-${filterId} {
            backdrop-filter: blur(16px) url(#liquid-glass-${filterId}) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            box-shadow:
              inset 0 1px 2px 0 rgba(255, 255, 255, 0.12),
              inset 0 -1px 1px 0 rgba(0, 0, 0, 0.08),
              0 2px 8px 0 rgba(0, 0, 0, 0.2),
              0 8px 24px -4px ${glowColor || "rgba(0, 240, 255, 0.15)"},
              0 0 0 0.5px rgba(255, 255, 255, 0.1);
          }
          .btn-liquid-${filterId}:active .btn-liquid-lens-${filterId} {
            backdrop-filter: blur(20px) url(#liquid-glass-${filterId}) saturate(200%);
            -webkit-backdrop-filter: blur(20px) saturate(200%);
          }
        `}</style>

        <button
          className={cn(
            glassButtonVariants({ size }),
            `btn-liquid-${filterId}`,
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Glass lens backdrop layer */}
          <span
            className={`btn-liquid-lens-${filterId} absolute inset-0 -z-10 rounded-[inherit] pointer-events-none`}
          />
          {/* Content layer */}
          <span
            className={cn(
              "btn-liquid-text relative z-10 w-full flex items-center justify-center font-mono uppercase tracking-widest",
              contentClassName
            )}
          >
            {children}
          </span>
        </button>
      </>
    );
  }
);

GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
