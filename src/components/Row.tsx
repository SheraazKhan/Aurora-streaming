"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "@/components/ContentCard";
import type { MediaItem } from "../../types/movie";

interface Props {
  title: string;
  fetchUrl: string;
  variant?: "standard" | "large" | "top10" | "poster";
}

function Row({ title, fetchUrl, variant = "standard" }: Props) {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [isMoved, setIsMoved] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  const cardVariant = variant === "poster" ? "poster" : variant === "top10" ? "top10" : "backdrop";

  return (
    <div className="mt-8 group/row">
      <h2 className="text-xl font-bold text-white mb-3 px-6 md:px-12 lg:px-16">{title}</h2>

      <div className="relative">
        <button
          className={`absolute top-0 bottom-0 left-0 z-40 w-12 flex items-center justify-center bg-gradient-to-r from-surface-0/80 to-transparent opacity-0 transition group-hover/row:opacity-100 ${!isMoved && 'hidden'}`}
          onClick={() => handleClick("left")}
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center overflow-x-scroll scrollbar-hide gap-3 px-6 md:px-12 lg:px-16 scroll-smooth snap-x snap-mandatory py-4"
        >
          {movies.map((movie, index) => (
            <ContentCard
              key={movie.id}
              movie={movie}
              variant={cardVariant}
              rank={variant === "top10" ? index + 1 : undefined}
            />
          ))}
        </div>

        <button
          className="absolute top-0 bottom-0 right-0 z-40 w-12 flex items-center justify-center bg-gradient-to-l from-surface-0/80 to-transparent opacity-0 transition group-hover/row:opacity-100"
          onClick={() => handleClick("right")}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </div>
  );
}

export default Row;
