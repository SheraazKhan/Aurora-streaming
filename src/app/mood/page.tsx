"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import { ArrowLeft, Loader2 } from "lucide-react";
import { moods, type MoodConfig } from "@/services/moodMappings";
import type { MediaItem } from "../../../types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const openModal = useModalStore((s) => s.openModal);

  useEffect(() => {
    if (!selectedMood) return;
    const mood = moods[selectedMood];
    if (!mood) return;

    setLoading(true);
    const genreStr = mood.genres.join(",");
    axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreStr}&sort_by=popularity.desc&page=1&language=en-US`)
      .then(({ data }) => setResults(data.results.filter((m: MediaItem) => m.poster_path).slice(0, 20)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [selectedMood]);

  if (!selectedMood) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16">
        <h1 className="text-3xl font-bold text-white mb-3">What&apos;s Your Mood?</h1>
        <p className="text-gray-400 mb-10">Pick a vibe and we&apos;ll find something perfect</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(moods).map(([key, mood]) => (
            <button
              key={key}
              onClick={() => setSelectedMood(key)}
              className={`bg-gradient-to-br ${mood.color} rounded-2xl p-6 text-left transition-transform hover:scale-105 group`}
            >
              <span className="text-4xl block mb-3">{mood.emoji}</span>
              <h3 className="text-white font-bold text-lg">{mood.name}</h3>
              <p className="text-white/70 text-xs mt-1">{mood.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const mood = moods[selectedMood];

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16">
      <button
        onClick={() => setSelectedMood(null)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <ArrowLeft size={18} /> Back to Moods
      </button>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">{mood.emoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-white">{mood.name}</h1>
          <p className="text-gray-400 text-sm">{mood.description}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent h-8 w-8" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => openModal(movie)}
              className="relative aspect-[2/3] cursor-pointer rounded-xl overflow-hidden transition-transform hover:scale-105 group"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title || movie.name || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <p className="text-white text-sm font-semibold truncate">{movie.title || movie.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
