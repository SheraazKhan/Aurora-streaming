"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import { Loader2 } from "lucide-react";
import type { MediaItem } from "../../../../types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const genreMap: Record<string, { id: number; name: string; type: string }> = {
  action: { id: 28, name: "Action", type: "movie" },
  comedy: { id: 35, name: "Comedy", type: "movie" },
  horror: { id: 27, name: "Horror", type: "movie" },
  romance: { id: 10749, name: "Romance", type: "movie" },
  documentary: { id: 99, name: "Documentary", type: "movie" },
  thriller: { id: 53, name: "Thriller", type: "movie" },
  animation: { id: 16, name: "Animation", type: "movie" },
  "sci-fi": { id: 878, name: "Sci-Fi", type: "movie" },
  drama: { id: 18, name: "Drama", type: "movie" },
  crime: { id: 80, name: "Crime", type: "movie" },
  family: { id: 10751, name: "Family", type: "movie" },
  fantasy: { id: 14, name: "Fantasy", type: "movie" },
  mystery: { id: 9648, name: "Mystery", type: "movie" },
  "action-adventure-tv": { id: 10759, name: "Action & Adventure", type: "tv" },
  "animation-tv": { id: 16, name: "Animation", type: "tv" },
  "comedy-tv": { id: 35, name: "Comedy", type: "tv" },
  "crime-tv": { id: 80, name: "Crime", type: "tv" },
  "drama-tv": { id: 18, name: "Drama", type: "tv" },
  "sci-fi-tv": { id: 10765, name: "Sci-Fi & Fantasy", type: "tv" },
};

export default function GenrePage() {
  const params = useParams();
  const genre = params.genre as string;
  const [results, setResults] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const openModal = useModalStore((s) => s.openModal);

  const genreInfo = genreMap[genre] || { id: 28, name: genre, type: "movie" };

  const fetchPage = useCallback(async (p: number) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/discover/${genreInfo.type}?api_key=${API_KEY}&with_genres=${genreInfo.id}&page=${p}&language=en-US`
      );
      return { items: data.results as MediaItem[], totalPages: data.total_pages };
    } catch {
      return { items: [], totalPages: 0 };
    }
  }, [genreInfo.id, genreInfo.type]);

  useEffect(() => {
    setLoading(true);
    fetchPage(1).then(({ items, totalPages }) => {
      setResults(items.filter((m) => m.poster_path));
      setHasMore(1 < totalPages);
      setLoading(false);
    });
  }, [fetchPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage(nextPage).then(({ items, totalPages }) => {
          setResults((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            return [...prev, ...items.filter((m) => m.poster_path && !ids.has(m.id))];
          });
          setHasMore(nextPage < totalPages);
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, loading, fetchPage]);

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16">
      <h1 className="text-3xl font-bold text-white mb-8">{genreInfo.name}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {results.map((movie) => (
          <div
            key={movie.id}
            onClick={() => openModal(movie)}
            className="relative aspect-[2/3] cursor-pointer rounded-xl overflow-hidden transition-transform hover:scale-105 group"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name || "poster"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
              <div>
                <p className="text-white text-sm font-semibold truncate">{movie.title || movie.name}</p>
                {movie.vote_average && (
                  <p className="text-accent text-xs">{Math.round(movie.vote_average * 10)}% Match</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-10 pb-10">
          <Loader2 className="animate-spin text-accent h-8 w-8" />
        </div>
      )}
    </div>
  );
}
