import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ThemeConfig {
  name: string;
  accent: string;
  accentHover: string;
  accentSecondary: string;
  surface0: string;
  surface1: string;
}

export const themes: Record<string, ThemeConfig> = {
  aurora: {
    name: "Aurora",
    accent: "#14b8a6",
    accentHover: "#0d9488",
    accentSecondary: "#6366f1",
    surface0: "#0a0e1a",
    surface1: "#111827",
  },
  ember: {
    name: "Ember",
    accent: "#f97316",
    accentHover: "#ea580c",
    accentSecondary: "#ef4444",
    surface0: "#1a0a0a",
    surface1: "#1f1111",
  },
  midnight: {
    name: "Midnight",
    accent: "#8b5cf6",
    accentHover: "#7c3aed",
    accentSecondary: "#ec4899",
    surface0: "#0f0a1a",
    surface1: "#161127",
  },
  forest: {
    name: "Forest",
    accent: "#22c55e",
    accentHover: "#16a34a",
    accentSecondary: "#84cc16",
    surface0: "#0a1a0e",
    surface1: "#111f14",
  },
};

interface ThemeState {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: "aurora",
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    { name: "aurora-theme" }
  )
);

export function applyTheme(themeName: string) {
  const theme = themes[themeName];
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--color-accent", theme.accent);
  root.style.setProperty("--color-accent-hover", theme.accentHover);
  root.style.setProperty("--color-accent-secondary", theme.accentSecondary);
  root.style.setProperty("--color-surface-0", theme.surface0);
  root.style.setProperty("--color-surface-1", theme.surface1);
  root.style.setProperty("--background", theme.surface0);
  document.body.style.backgroundColor = theme.surface0;
}
