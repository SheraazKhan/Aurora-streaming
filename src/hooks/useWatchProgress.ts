"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import { saveWatchProgress, type WatchHistoryEntry } from "@/lib/firestore";

interface WatchProgressParams {
  isPlaying: boolean;
  mediaId: number;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string;
  backdropPath: string;
  season?: number;
  episode?: number;
  estimatedDuration?: number;
}

export function useWatchProgress({
  isPlaying,
  mediaId,
  mediaType,
  title,
  posterPath,
  backdropPath,
  season,
  episode,
  estimatedDuration = 5400,
}: WatchProgressParams) {
  const { user } = useAuth();
  const { activeProfile } = useProfileStore();
  const elapsedRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying || !user?.email || !activeProfile?.id) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    elapsedRef.current = 0;

    intervalRef.current = setInterval(() => {
      elapsedRef.current += 30;
      const entry: WatchHistoryEntry = {
        mediaId,
        mediaType,
        title,
        posterPath,
        backdropPath,
        progress: elapsedRef.current,
        duration: estimatedDuration,
        season,
        episode,
        lastWatched: null,
        completed: elapsedRef.current >= estimatedDuration * 0.9,
      };
      saveWatchProgress(user.email!, activeProfile.id, entry).catch(() => {});
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, mediaId, mediaType, title, posterPath, backdropPath, season, episode, estimatedDuration, user?.email, activeProfile?.id]);
}
