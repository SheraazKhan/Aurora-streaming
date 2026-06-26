"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, List, Moon, SkipForward, Maximize2, Minimize2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";

interface PlayerOverlayProps {
  title: string;
  subtitle?: string;
  isTV: boolean;
  onBack: () => void;
  onNextEpisode: () => void;
  playerUrl: string;
}

export default function PlayerOverlay({
  title,
  subtitle,
  isTV,
  onBack,
  onNextEpisode,
  playerUrl,
}: PlayerOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<NodeJS.Timeout | null>(null);
  const { setMiniPlayer, setShowEpisodeDrawer, setSleepTimer, sleepTimerEnd } = usePlayerStore();

  const resetHideTimer = useCallback(() => {
    setVisible(true);
    if (hideTimer) clearTimeout(hideTimer);
    const timer = setTimeout(() => setVisible(false), 3000);
    setHideTimer(timer);
    return () => clearTimeout(timer);
  }, [hideTimer]);

  useEffect(() => {
    const cleanup = resetHideTimer();
    return cleanup;
  }, []);

  const handleMouseMove = () => resetHideTimer();

  const sleepRemaining = sleepTimerEnd ? Math.max(0, Math.ceil((sleepTimerEnd - Date.now()) / 60000)) : null;

  return (
    <div
      className="absolute inset-0 z-40"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      <div className={`absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div>
            <p className="text-white text-sm font-semibold">{title}</p>
            {subtitle && <p className="text-gray-300 text-xs">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex items-center gap-2">
          {isTV && (
            <>
              <button
                onClick={() => setShowEpisodeDrawer(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
              >
                <List size={14} /> Episodes
              </button>
              <button
                onClick={onNextEpisode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent/90 hover:bg-accent text-black text-xs font-medium transition"
              >
                <SkipForward size={14} /> Next
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sleepRemaining !== null && (
            <span className="text-gray-300 text-xs bg-black/40 px-2 py-1 rounded-lg">
              Sleep: {sleepRemaining}m
            </span>
          )}
          <button
            onClick={() => {
              const minutes = sleepTimerEnd ? null : 30;
              setSleepTimer(minutes);
            }}
            className={`p-2 rounded-lg transition ${sleepTimerEnd ? "bg-accent/20 text-accent" : "bg-white/10 text-white hover:bg-white/20"}`}
            title="Sleep Timer"
          >
            <Moon size={16} />
          </button>
          <button
            onClick={() => setMiniPlayer(true, playerUrl, title)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
            title="Mini Player"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
