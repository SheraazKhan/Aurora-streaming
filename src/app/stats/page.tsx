"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import { getWatchHistory, getAllRatings, type WatchHistoryEntry, type Rating } from "@/lib/firestore";
import { Clock, Film, ThumbsUp, Heart, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function StatsPage() {
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { activeProfile } = useProfileStore();

  useEffect(() => {
    if (!user?.email || !activeProfile?.id) {
      setLoading(false);
      return;
    }
    Promise.all([
      getWatchHistory(user.email, activeProfile.id, 100),
      getAllRatings(user.email, activeProfile.id),
    ]).then(([h, r]) => {
      setHistory(h);
      setRatings(r);
    }).finally(() => setLoading(false));
  }, [user?.email, activeProfile?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4 md:px-10 flex items-center justify-center">
        <p className="text-gray-400">Sign in to see your viewing stats.</p>
      </div>
    );
  }

  const totalSeconds = history.reduce((sum, h) => sum + h.progress, 0);
  const totalHours = Math.round(totalSeconds / 3600);
  const totalTitles = history.length;
  const completed = history.filter((h) => h.completed).length;
  const movies = history.filter((h) => h.mediaType === "movie").length;
  const tvShows = history.filter((h) => h.mediaType === "tv").length;
  const liked = ratings.filter((r) => r.rating === "up" || r.rating === "love").length;

  const stats = [
    { icon: Clock, label: "Hours Watched", value: totalHours, color: "text-accent" },
    { icon: Film, label: "Titles Watched", value: totalTitles, color: "text-indigo-400" },
    { icon: TrendingUp, label: "Completed", value: completed, color: "text-green-400" },
    { icon: ThumbsUp, label: "Liked", value: liked, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 px-4 md:px-10 lg:px-16 pb-20">
      <h1 className="text-3xl font-bold text-white mb-2">Viewing Stats</h1>
      <p className="text-gray-400 mb-8">Your watching activity at a glance</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-5 text-center">
            <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Content Split</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Movies</span>
                <span className="text-accent">{movies}</span>
              </div>
              <div className="w-full bg-surface-3 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${totalTitles ? (movies / totalTitles) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">TV Shows</span>
                <span className="text-indigo-400">{tvShows}</span>
              </div>
              <div className="w-full bg-surface-3 rounded-full h-2">
                <div className="bg-indigo-400 h-2 rounded-full transition-all" style={{ width: `${totalTitles ? (tvShows / totalTitles) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm">No watch history yet. Start watching!</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((entry) => (
                <div key={`${entry.mediaId}-${entry.season}-${entry.episode}`} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{entry.title}</p>
                    <p className="text-gray-500 text-xs">
                      {entry.season ? `S${entry.season} E${entry.episode}` : "Movie"}
                      {entry.completed && " · Completed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {history.length === 0 && ratings.length === 0 && (
        <div className="text-center mt-16">
          <Heart className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-white text-lg font-semibold mb-2">No stats yet</h3>
          <p className="text-gray-400 text-sm">Start watching and rating content to see your personalized stats here.</p>
        </div>
      )}
    </div>
  );
}
