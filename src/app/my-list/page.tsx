"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, arrayRemove } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { X, PlayCircle } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import type { MediaItem, SavedShow } from "../../../types/movie";

export default function MyListPage() {
  const [movies, setMovies] = useState<SavedShow[]>([]);
  const { user } = useAuth();
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    if (user?.email) {
      return onSnapshot(doc(db, "users", user.email), (snapshot) => {
        if (snapshot.exists()) {
          setMovies(snapshot.data()?.savedShows || []);
        }
      });
    }
  }, [user?.email]);

  const handleOpenModal = (movie: SavedShow) => {
    const movieData: MediaItem = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.img || "",
      backdrop_path: movie.img || "",
      overview: movie.overview ?? "",
      first_air_date: movie.first_air_date,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      media_type: movie.media_type,
    };
    openModal(movieData);
  };

  const removeMovie = async (movie: SavedShow) => {
    try {
      if (user?.email) {
        const userDoc = doc(db, "users", user.email);
        await updateDoc(userDoc, {
          savedShows: arrayRemove(movie),
        });
      }
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  };

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <div className="pt-28 px-4 md:px-10">
        <h1 className="text-2xl font-bold text-white mb-8 md:text-4xl">My List</h1>

        {movies.length === 0 ? (
          <p className="text-gray-400 text-lg italic">Your list is currently empty.</p>
        ) : (
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="group relative h-28 w-full cursor-pointer transition transform duration-200 hover:scale-105 md:h-36 lg:h-44"
              >
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.img}`}
                  alt={movie.title}
                  fill
                  className="rounded object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-3 rounded">
                  <div className="flex justify-between items-start">
                    <PlayCircle
                      className="text-white h-8 w-8 hover:text-gray-300 cursor-pointer"
                      onClick={() => handleOpenModal(movie)}
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMovie(movie);
                      }}
                      className="bg-white/20 hover:bg-red-600 p-1 rounded-full transition"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  <div className="flex-1 flex items-end" onClick={() => handleOpenModal(movie)}>
                    <p className="text-xs font-bold text-white md:text-sm lg:text-base line-clamp-1">
                      {movie.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
