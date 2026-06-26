"use client";
import { X, Maximize2 } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { useModalStore } from "@/store/modalStore";

export default function MiniPlayer() {
  const { isMiniPlayer, miniPlayerUrl, miniPlayerTitle, setMiniPlayer } = usePlayerStore();
  const setPlaying = useModalStore((s) => s.setPlaying);

  if (!isMiniPlayer || !miniPlayerUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-scale-in group">
      <div className="relative aspect-video bg-black">
        <iframe
          src={miniPlayerUrl}
          className="w-full h-full border-none"
          allowFullScreen
          allow="autoplay"
          title="mini-player"
        />
      </div>
      <div className="bg-surface-1 px-3 py-2 flex items-center justify-between">
        <p className="text-white text-xs font-medium truncate flex-1">{miniPlayerTitle}</p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setMiniPlayer(false);
              setPlaying(true);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Expand"
          >
            <Maximize2 size={14} className="text-gray-400" />
          </button>
          <button
            onClick={() => {
              setMiniPlayer(false);
              setPlaying(false);
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
            title="Close"
          >
            <X size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
