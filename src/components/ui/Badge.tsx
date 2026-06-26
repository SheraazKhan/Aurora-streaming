"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "warning" | "new" | "top10";
}

const variants = {
  default: "bg-white/10 text-white border-white/20",
  accent: "bg-accent/20 text-accent border-accent/30",
  warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  new: "bg-red-500/90 text-white border-red-400",
  top10: "bg-red-600 text-white border-red-500 font-bold",
};

export default function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-wider rounded border ${variants[variant]}`}>
      {children}
    </span>
  );
}
