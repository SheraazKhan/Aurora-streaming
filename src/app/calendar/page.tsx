"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useModalStore } from "@/store/modalStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import requests from "@/services/requests";
import Badge from "@/components/ui/Badge";
import type { MediaItem } from "../../../types/movie";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [upcoming, setUpcoming] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const openModal = useModalStore((s) => s.openModal);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(requests.fetchUpcomingMovies),
      axios.get(requests.fetchOnTheAir),
    ]).then(([movies, tv]) => {
      const all = [
        ...(movies.data.results || []).map((m: MediaItem) => ({ ...m, media_type: "movie" as const })),
        ...(tv.data.results || []).map((m: MediaItem) => ({ ...m, media_type: "tv" as const })),
      ];
      setUpcoming(all);
    }).finally(() => setLoading(false));
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getReleasesForDay = (day: Date) => {
    return upcoming.filter((m) => {
      const date = m.release_date || m.first_air_date;
      if (!date) return false;
      return isSameDay(new Date(date), day);
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16 pb-20">
      <h1 className="text-3xl font-bold text-white mb-2">Content Calendar</h1>
      <p className="text-gray-400 mb-8">Upcoming movies and TV shows</p>

      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 transition">
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h2 className="text-white font-semibold text-lg">{format(currentMonth, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg bg-surface-2 hover:bg-surface-3 transition">
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-gray-500 text-xs py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: monthStart.getDay() }, (_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((day) => {
              const releases = getReleasesForDay(day);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[80px] md:min-h-[100px] p-1.5 rounded-xl border transition ${
                    isToday ? "border-accent/50 bg-accent/5" : "border-white/5 bg-surface-1"
                  } ${releases.length > 0 ? "cursor-pointer hover:border-accent/30" : ""}`}
                >
                  <span className={`text-xs ${isToday ? "text-accent font-bold" : "text-gray-500"}`}>
                    {format(day, "d")}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {releases.slice(0, 2).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => openModal(m)}
                        className="w-full text-left"
                      >
                        <span className="text-[9px] text-white truncate block bg-accent/20 rounded px-1 py-0.5">
                          {m.title || m.name}
                        </span>
                      </button>
                    ))}
                    {releases.length > 2 && (
                      <span className="text-[8px] text-gray-500">+{releases.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <h3 className="text-white font-semibold mb-4">All Upcoming</h3>
            <div className="space-y-3">
              {upcoming
                .filter((m) => m.release_date || m.first_air_date)
                .sort((a, b) => {
                  const da = a.release_date || a.first_air_date || "";
                  const db = b.release_date || b.first_air_date || "";
                  return da.localeCompare(db);
                })
                .slice(0, 20)
                .map((m) => (
                  <div
                    key={m.id}
                    onClick={() => openModal(m)}
                    className="flex gap-4 bg-surface-1 rounded-xl p-3 cursor-pointer hover:bg-surface-2 transition"
                  >
                    <div className="relative w-20 aspect-[2/3] rounded-lg overflow-hidden flex-none">
                      {m.poster_path && (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                          alt={m.title || m.name || ""}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-white font-medium text-sm truncate">{m.title || m.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{m.media_type === "tv" ? "TV" : "Movie"}</Badge>
                        <span className="text-gray-400 text-xs">
                          {format(new Date(m.release_date || m.first_air_date || ""), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mt-2 line-clamp-2">{m.overview}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
