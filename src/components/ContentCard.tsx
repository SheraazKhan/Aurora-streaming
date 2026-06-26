"use client";
import Image from "next/image";
import { Play, Plus } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import { useToastStore } from "@/store/toastStore";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import type { MediaItem } from "../../types/movie";
import ProgressBar from "@/components/ui/ProgressBar";

interface ContentCardProps {
  movie: MediaItem;
  variant?: "poster" | "backdrop" | "top10";
  rank?: number;
  progress?: number;
}

export default function ContentCard({ movie, variant = "backdrop", rank, progress }: ContentCardProps) {
  const openModal = useModalStore((state) => state.openModal);
  const addToast = useToastStore((state) => state.addToast);
  const { user } = useAuth();

  const imagePath = variant === "poster"
    ? movie.poster_path
    : (movie.backdrop_path || movie.poster_path);

  const cardHeight = variant === "poster" ? "h-64 md:h-80" : "h-32 md:h-44";
  const cardWidth = variant === "poster" ? "min-w-[150px] md:min-w-[180px]" : "min-w-[220px] md:min-w-[300px]";

  const saveShow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.email) {
      addToast("Please sign in to save shows.", "info");
      return;
    }
    const isTV = !!(movie.first_air_date || movie.name);
    try {
      await setDoc(doc(db, "users", user.email), {
        savedShows: arrayUnion({
          id: movie.id,
          title: movie.title || movie.name,
          img: movie.backdrop_path || movie.poster_path,
          overview: movie.overview,
          release_date: movie.release_date || "",
          first_air_date: movie.first_air_date || "",
          vote_average: movie.vote_average || 0,
          media_type: isTV ? "tv" : "movie",
        }),
      }, { merge: true });
      addToast("Added to My List!");
    } catch {
      addToast("Failed to save. Try again.", "error");
    }
  };

  return (
    <div
      className={`group relative flex-none ${cardWidth} ${cardHeight} transition-all duration-300 hover:scale-105 z-10 hover:z-20 cursor-pointer snap-start`}
    >
      {variant === "top10" && rank !== undefined && (
        <span className="absolute -left-3 bottom-0 text-7xl md:text-8xl font-black text-white/15 z-30 select-none leading-none drop-shadow-lg">
          {rank}
        </span>
      )}

      <div onClick={() => openModal(movie)} className="relative h-full w-full rounded-xl overflow-hidden">
        {imagePath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${imagePath}`}
            alt={movie.title || movie.name || "poster"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 30vw"
          />
        ) : (
          <div className="w-full h-full bg-surface-2 flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="bg-accent rounded-full p-1.5">
              <Play className="text-black h-3 w-3 fill-black" />
            </div>
            <p className="text-white text-xs font-semibold truncate">
              {movie.title || movie.name}
            </p>
          </div>
          {movie.vote_average && (
            <p className="text-accent text-[10px] font-medium">
              {Math.round(movie.vote_average * 10)}% Match
            </p>
          )}
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>

      <button
        onClick={saveShow}
        className="absolute top-2 right-2 z-50 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/70 border border-white/10 transition"
      >
        <Plus className="h-4 w-4 text-white" />
      </button>
    </div>
  );
}
