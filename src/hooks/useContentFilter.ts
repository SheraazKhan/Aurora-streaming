"use client";
import { useProfileStore } from "@/store/profileStore";
import type { MediaItem } from "../../types/movie";

const KIDS_GENRE_IDS = [16, 10751, 10762, 10770];

export function useContentFilter() {
  const { activeProfile } = useProfileStore();
  const isKids = activeProfile?.isKids ?? false;

  const filterContent = (items: MediaItem[]): MediaItem[] => {
    if (!isKids) return items;
    return items.filter((item) => {
      if (!item.genre_ids || item.genre_ids.length === 0) return true;
      return item.genre_ids.some((id) => KIDS_GENRE_IDS.includes(id));
    });
  };

  return { filterContent, isKids };
}
