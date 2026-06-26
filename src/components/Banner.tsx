"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import requests from "@/services/requests";
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaItem } from "../../types/movie";
import Badge from "@/components/ui/Badge";

function Banner() {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const openModal = useModalStore((state) => state.openModal);
  const setPlaying = useModalStore((state) => state.setPlaying);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchTrending);
        const results = request.data.results?.filter((m: MediaItem) => m.backdrop_path) || [];
        setMovies(results.slice(0, 8));
      } catch (error) {
        console.error("Error fetching banner movies:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [movies.length]);

  const goTo = useCallback((direction: "prev" | "next") => {
    setCurrentIndex((prev) =>
      direction === "next"
        ? (prev + 1) % movies.length
        : (prev - 1 + movies.length) % movies.length
    );
  }, [movies.length]);

  const movie = movies[currentIndex];

  if (!movie) return <div className="h-[80vh] w-full bg-surface-1 animate-pulse" />;

  const year = movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0];
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) : null;

  return (
    <header className="relative h-[65vh] md:h-[80vh] lg:h-[95vh] text-white overflow-hidden">
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${m.backdrop_path}`}
            alt={m.title || m.name || "Banner"}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-surface-0 via-surface-0/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-0 via-transparent to-surface-0/30" />

      <div className="relative flex h-full flex-col justify-end pb-32 space-y-5 px-6 md:px-12 lg:px-16 z-10">
        <div className="animate-slide-up">
          <div className="flex items-center gap-3 mb-3">
            {rating && (
              <Badge variant="accent">{rating}% Match</Badge>
            )}
            {year && <Badge>{year}</Badge>}
            <Badge>HD</Badge>
          </div>

          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl drop-shadow-lg max-w-3xl leading-tight">
            {movie.title || movie.name || movie.original_name}
          </h1>

          <p className="mt-4 max-w-md text-sm text-gray-300 md:max-w-xl md:text-base lg:max-w-2xl lg:text-lg line-clamp-3 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => {
                openModal(movie);
                setPlaying(true);
              }}
              className="flex items-center gap-x-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 md:px-8 md:py-3 md:text-base"
            >
              <Play fill="black" size={18} /> Play
            </button>
            <button
              onClick={() => openModal(movie)}
              className="flex items-center gap-x-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 md:px-8 md:py-3 md:text-base"
            >
              <Info size={18} /> More Info
            </button>
          </div>
        </div>
      </div>

      {movies.length > 1 && (
        <>
          <button
            onClick={() => goTo("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => goTo("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white hover:bg-black/50 transition"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-accent" : "w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
    </header>
  );
}

export default Banner;
