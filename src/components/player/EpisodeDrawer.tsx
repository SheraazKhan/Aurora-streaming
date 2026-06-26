"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import requests from "@/services/requests";
import type { Episode } from "../../../types/movie";

interface EpisodeDrawerProps {
  tvId: number;
  currentSeason: number;
  currentEpisode: number;
  totalSeasons: number;
  onSelectEpisode: (season: number, episode: number) => void;
}

export default function EpisodeDrawer({
  tvId,
  currentSeason,
  currentEpisode,
  totalSeasons,
  onSelectEpisode,
}: EpisodeDrawerProps) {
  const { showEpisodeDrawer, setShowEpisodeDrawer } = usePlayerStore();
  const [season, setSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showEpisodeDrawer) return;
    setLoading(true);
    axios.get(requests.fetchSeasonDetails(tvId, season))
      .then(({ data }) => setEpisodes(data.episodes || []))
      .catch(() => setEpisodes([]))
      .finally(() => setLoading(false));
  }, [tvId, season, showEpisodeDrawer]);

  if (!showEpisodeDrawer) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowEpisodeDrawer(false)} />
      <div className="relative w-full max-w-md bg-surface-1 border-l border-white/5 overflow-y-auto animate-slide-in">
        <div className="sticky top-0 bg-surface-1/95 backdrop-blur-xl p-4 border-b border-white/5 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Episodes</h2>
            <button onClick={() => setShowEpisodeDrawer(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition">
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {Array.from({ length: totalSeasons }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setSeason(i + 1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  season === i + 1 ? "bg-accent text-black" : "bg-surface-2 text-gray-300 hover:bg-surface-3"
                }`}
              >
                Season {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-2 rounded-xl animate-pulse" />
            ))
          ) : (
            episodes.map((ep) => {
              const isCurrent = season === currentSeason && ep.episode_number === currentEpisode;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    onSelectEpisode(season, ep.episode_number);
                    setShowEpisodeDrawer(false);
                  }}
                  className={`w-full flex gap-3 p-3 rounded-xl transition text-left ${
                    isCurrent ? "bg-accent/15 border border-accent/30" : "bg-surface-2/50 hover:bg-surface-2 border border-transparent"
                  }`}
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden flex-none bg-surface-3">
                    {ep.still_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                        alt={ep.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    )}
                    {isCurrent && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <Play size={16} className="text-accent fill-accent" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500 text-xs">{ep.episode_number}.</span>
                      <span className="text-white text-sm font-medium truncate">{ep.name}</span>
                    </div>
                    {ep.runtime && <span className="text-gray-500 text-xs">{ep.runtime}m</span>}
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{ep.overview}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
