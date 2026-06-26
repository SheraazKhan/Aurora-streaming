import { create } from "zustand";

interface PlayerState {
  isMiniPlayer: boolean;
  miniPlayerUrl: string;
  miniPlayerTitle: string;
  sleepTimerMinutes: number | null;
  sleepTimerEnd: number | null;
  showEpisodeDrawer: boolean;
  setMiniPlayer: (active: boolean, url?: string, title?: string) => void;
  setSleepTimer: (minutes: number | null) => void;
  setShowEpisodeDrawer: (show: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isMiniPlayer: false,
  miniPlayerUrl: "",
  miniPlayerTitle: "",
  sleepTimerMinutes: null,
  sleepTimerEnd: null,
  showEpisodeDrawer: false,
  setMiniPlayer: (active, url = "", title = "") =>
    set({ isMiniPlayer: active, miniPlayerUrl: url, miniPlayerTitle: title }),
  setSleepTimer: (minutes) =>
    set({
      sleepTimerMinutes: minutes,
      sleepTimerEnd: minutes ? Date.now() + minutes * 60 * 1000 : null,
    }),
  setShowEpisodeDrawer: (show) => set({ showEpisodeDrawer: show }),
}));
