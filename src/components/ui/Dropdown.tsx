"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  value: number;
  options: { label: string; value: number }[];
  onChange: (value: number) => void;
  className?: string;
}

export default function Dropdown({ value, options, onChange, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-surface-2 border border-white/10 px-3 py-2 rounded-lg text-sm text-white hover:border-white/30 transition min-w-[80px]"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const currentIdx = options.findIndex((o) => o.value === value);
            const nextIdx = e.key === "ArrowDown"
              ? Math.min(currentIdx + 1, options.length - 1)
              : Math.max(currentIdx - 1, 0);
            onChange(options[nextIdx].value);
          }
        }}
      >
        <span>{selected?.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 glass-card py-1 min-w-full max-h-60 overflow-y-auto scrollbar-hide animate-scale-in">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition hover:bg-white/10 ${
                option.value === value ? "text-accent font-medium" : "text-white"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
