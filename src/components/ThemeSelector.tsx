"use client";
import { useEffect } from "react";
import { useThemeStore, themes, applyTheme } from "@/store/themeStore";

export default function ThemeSelector() {
  const { currentTheme, setTheme } = useThemeStore();

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <div className="space-y-2">
      <span className="text-gray-400 text-xs block mb-2">Theme</span>
      <div className="grid grid-cols-2 gap-1.5">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition ${
              currentTheme === key
                ? "bg-white/15 text-white border border-white/20"
                : "bg-surface-2 text-gray-400 hover:bg-surface-3 border border-transparent"
            }`}
          >
            <div
              className="w-3 h-3 rounded-full flex-none"
              style={{ backgroundColor: theme.accent }}
            />
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
}
