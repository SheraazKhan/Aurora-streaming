"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import { useModalStore } from "@/store/modalStore";
import { subscribeWatchHistory, type WatchHistoryEntry } from "@/lib/firestore";
import Image from "next/image";
import { Play } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";

export default function ContinueWatchingRow() {
  const [entries, setEntries] = useState<WatchHistoryEntry[]>([]);
  const { user } = useAuth();
  const { activeProfile } = useProfileStore();
  const openModal = useModalStore((s) => s.openModal);
  const setPlaying = useModalStore((s) => s.setPlaying);

  useEffect(() => {
    if (!user?.email || !activeProfile?.id) return;
    const unsub = subscribeWatchHistory(user.email, activeProfile.id, (items) => {
      setEntries(items.filter((e) => !e.completed));
    });
    return unsub;
  }, [user?.email, activeProfile?.id]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-3 px-6 md:px-12 lg:px-16">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-16 py-4">
        {entries.map((entry) => (
          <button
            key={`${entry.mediaId}-${entry.season}-${entry.episode}`}
            onClick={() => {
              openModal({
                id: entry.mediaId,
                title: entry.title,
                poster_path: entry.posterPath,
                backdrop_path: entry.backdropPath,
                media_type: entry.mediaType,
              });
              setPlaying(true);
            }}
            className="group relative flex-none w-56 md:w-72 rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-video">
              {entry.backdropPath ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${entry.backdropPath}`}
                  alt={entry.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              ) : (
                <div className="w-full h-full bg-surface-2" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <div className="bg-accent rounded-full p-3">
                  <Play className="text-black fill-black" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-surface-2 p-3">
              <p className="text-white text-sm font-medium truncate">{entry.title}</p>
              {entry.season && (
                <p className="text-gray-400 text-xs mt-0.5">S{entry.season} E{entry.episode}</p>
              )}
              <ProgressBar progress={(entry.progress / entry.duration) * 100} className="mt-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
