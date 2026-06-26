"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-accent text-black font-semibold hover:bg-accent-hover",
  secondary: "bg-white text-black font-semibold hover:bg-gray-200",
  ghost: "bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/10",
  glass: "glass text-white hover:bg-white/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2 text-base rounded-lg",
  lg: "px-8 py-3 text-lg rounded-xl min-h-[48px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-accent ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
