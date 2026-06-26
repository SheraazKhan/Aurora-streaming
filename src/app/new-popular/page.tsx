"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import { Calendar, TrendingUp, Tv, Film } from "lucide-react";
import requests from "@/services/requests";
import Badge from "@/components/ui/Badge";
import type { MediaItem } from "../../../types/movie";

type Tab = "coming" | "everyone" | "top10tv" | "top10movies";

const tabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
  { key: "coming", label: "Coming Soon", icon: Calendar },
  { key: "everyone", label: "Everyone's Watching", icon: TrendingUp },
  { key: "top10tv", label: "Top 10 TV", icon: Tv },
  { key: "top10movies", label: "Top 10 Movies", icon: Film },
];

export default function NewPopularPage() {
  const [activeTab, setActiveTab] = useState<Tab>("coming");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const openModal = useModalStore((s) => s.openModal);

  useEffect(() => {
    setLoading(true);
    const urls: Record<Tab, string> = {
      coming: requests.fetchUpcomingMovies,
      everyone: requests.fetchTrending,
      top10tv: requests.fetchTrendingTV,
      top10movies: requests.fetchTopRated,
    };
    axios.get(urls[activeTab]).then(({ data }) => {
      setResults((data.results || []).slice(0, 20));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16">
      <h1 className="text-3xl font-bold text-white mb-6">New & Popular</h1>

      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key
                ? "bg-accent text-black"
                : "bg-surface-2 text-gray-300 hover:bg-surface-3"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((movie, index) => (
            <div
              key={movie.id}
              onClick={() => openModal(movie)}
              className="flex gap-4 bg-surface-1 rounded-xl p-3 cursor-pointer hover:bg-surface-2 transition group"
            >
              {(activeTab === "top10tv" || activeTab === "top10movies") && (
                <span className="text-4xl font-black text-white/20 w-12 flex items-center justify-center flex-none">
                  {index + 1}
                </span>
              )}
              <div className="relative w-32 md:w-40 aspect-video rounded-lg overflow-hidden flex-none">
                {(movie.backdrop_path || movie.poster_path) && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path || movie.poster_path}`}
                    alt={movie.title || movie.name || ""}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-white font-semibold text-sm md:text-base truncate group-hover:text-accent transition">
                  {movie.title || movie.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {movie.vote_average && <Badge variant="accent">{Math.round(movie.vote_average * 10)}%</Badge>}
                  <span className="text-gray-400 text-xs">
                    {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
