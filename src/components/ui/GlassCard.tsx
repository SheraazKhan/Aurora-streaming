"use client";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "flat" | "interactive";
}

const variantStyles = {
  elevated: "glass-card shadow-xl",
  flat: "glass-card shadow-none",
  interactive: "glass-card shadow-lg hover:shadow-xl hover:border-white/12 transition-all duration-300 cursor-pointer hover:scale-[1.02]",
};

export default function GlassCard({ variant = "elevated", className = "", children, ...props }: GlassCardProps) {
  return (
    <div className={`${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
