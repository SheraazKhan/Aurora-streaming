"use client";
import { useEffect, useState } from "react";
import { Moon, X } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useModalStore } from "@/store/modalStore";

const TIMER_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "2 hours", value: 120 },
];

interface SleepTimerProps {
  show: boolean;
  onClose: () => void;
}

export default function SleepTimer({ show, onClose }: SleepTimerProps) {
  const { sleepTimerEnd, setSleepTimer } = usePlayerStore();
  const setPlaying = useModalStore((s) => s.setPlaying);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!sleepTimerEnd) {
      setRemaining(null);
      return;
    }
    const interval = setInterval(() => {
      const left = Math.max(0, sleepTimerEnd - Date.now());
      setRemaining(Math.ceil(left / 1000));
      if (left <= 0) {
        setSleepTimer(null);
        setPlaying(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sleepTimerEnd, setSleepTimer, setPlaying]);

  if (!show) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute bottom-20 left-6 z-50 glass-card p-4 w-64 animate-scale-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <Moon size={16} className="text-accent" />
          <span className="text-sm font-semibold">Sleep Timer</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
          <X size={14} />
        </button>
      </div>

      {remaining !== null ? (
        <div className="text-center py-2">
          <p className="text-2xl font-bold text-accent">{formatTime(remaining)}</p>
          <p className="text-gray-400 text-xs mt-1">remaining</p>
          <button
            onClick={() => setSleepTimer(null)}
            className="mt-3 text-xs text-gray-300 hover:text-white underline transition"
          >
            Cancel Timer
          </button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {TIMER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSleepTimer(opt.value);
                onClose();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
