"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { useModalStore } from "@/store/modalStore";
import { Search as SearchIcon, Loader2, SlidersHorizontal } from "lucide-react";
import requests from "@/services/requests";
import Badge from "@/components/ui/Badge";
import type { MediaItem, Genre } from "../../../types/movie";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<"all" | "movie" | "tv">("all");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const loadingRef = useRef(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
      .then(({ data }) => setGenres(data.genres || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function getResults() {
      if (!debouncedSearch && !selectedGenre) {
        setResults([]);
        setPage(1);
        setHasMore(true);
        return;
      }

      setLoading(true);
      try {
        let url: string;
        if (debouncedSearch) {
          url = requests.searchMulti(debouncedSearch, 1);
        } else {
          const type = mediaType === "all" ? "movie" : mediaType;
          url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=${sortBy}&page=1&language=en-US`;
        }
        const { data } = await axios.get(url);
        const filtered = data.results.filter((item: MediaItem) => item.poster_path);
        setResults(filtered);
        setPage(1);
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }
    getResults();
  }, [debouncedSearch, selectedGenre, mediaType, sortBy]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    const nextPage = page + 1;
    try {
      let url: string;
      if (debouncedSearch) {
        url = requests.searchMulti(debouncedSearch, nextPage);
      } else {
        const type = mediaType === "all" ? "movie" : mediaType;
        url = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${selectedGenre}&sort_by=${sortBy}&page=${nextPage}&language=en-US`;
      }
      const { data } = await axios.get(url);
      const newResults = data.results.filter((item: MediaItem) => item.poster_path);
      setResults((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        return [...prev, ...newResults.filter((m: MediaItem) => !ids.has(m.id))];
      });
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error("Load more error:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [page, debouncedSearch, hasMore, selectedGenre, mediaType, sortBy]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16">
      <div className="flex items-center gap-3 mb-6 max-w-3xl mx-auto">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            className="w-full bg-surface-2 text-white pl-12 pr-4 py-3 rounded-xl outline-none border border-white/10 focus:border-accent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border transition ${
            showFilters ? "bg-accent/15 border-accent text-accent" : "bg-surface-2 border-white/10 text-gray-300 hover:text-white"
          }`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {showFilters && (
        <div className="glass-card p-4 mb-6 max-w-3xl mx-auto animate-slide-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-sm font-semibold">Filters</h3>
            <button onClick={() => { setSelectedGenre(null); setMediaType("all"); setSortBy("popularity.desc"); }} className="text-xs text-gray-400 hover:text-accent transition">
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Type</label>
              <div className="flex gap-2">
                {(["all", "movie", "tv"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setMediaType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      mediaType === t ? "bg-accent text-black" : "bg-surface-2 text-gray-300 hover:bg-surface-3"
                    }`}
                  >
                    {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {genres.slice(0, 12).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                      selectedGenre === g.id ? "bg-accent text-black" : "bg-surface-2 text-gray-300 hover:bg-surface-3"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs mb-2 block">Sort By</label>
              <div className="flex gap-2">
                {[
                  { value: "popularity.desc", label: "Popular" },
                  { value: "vote_average.desc", label: "Rating" },
                  { value: "release_date.desc", label: "Newest" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      sortBy === s.value ? "bg-accent text-black" : "bg-surface-2 text-gray-300 hover:bg-surface-3"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
                <div className="flex gap-1.5 mt-1">
                  {movie.vote_average && <Badge variant="accent">{Math.round(movie.vote_average * 10)}%</Badge>}
                  {movie.media_type && <Badge>{movie.media_type}</Badge>}
                </div>
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

      {!loading && (debouncedSearch || selectedGenre) && results.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No results found.</p>
      )}
    </div>
  );
}
