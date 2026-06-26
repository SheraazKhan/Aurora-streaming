"use client";
import { useEffect, useState, useCallback } from "react";
import { SkipForward, X } from "lucide-react";

interface Props {
  onPlay: () => void;
  onCancel: () => void;
  episodeLabel: string;
}

export default function NextEpisodeCountdown({ onPlay, onCancel, episodeLabel }: Props) {
  const [seconds, setSeconds] = useState(15);

  const stableOnPlay = useCallback(onPlay, [onPlay]);

  useEffect(() => {
    if (seconds <= 0) {
      stableOnPlay();
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, stableOnPlay]);

  const progress = ((15 - seconds) / 15) * 100;

  return (
    <div className="absolute bottom-20 right-6 z-50 bg-black/90 backdrop-blur-sm border border-white/20 rounded-xl p-4 w-72 shadow-2xl animate-slide-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white text-sm font-medium">Next Episode</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-white transition">
          <X size={16} />
        </button>
      </div>
      <p className="text-gray-300 text-xs mb-3">{episodeLabel}</p>
      <div className="w-full bg-gray-700 rounded-full h-1 mb-3">
        <div
          className="bg-teal-500 h-1 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs">{seconds}s</span>
        <button
          onClick={stableOnPlay}
          className="flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
        >
          <SkipForward size={14} /> Play Now
        </button>
      </div>
    </div>
  );
}
