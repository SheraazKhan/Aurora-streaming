"use client";
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProfileStore } from "@/store/profileStore";
import { setRating as saveRating, getRating, type Rating } from "@/lib/firestore";
import { useToastStore } from "@/store/toastStore";

interface RatingButtonsProps {
  mediaId: number;
}

export default function RatingButtons({ mediaId }: RatingButtonsProps) {
  const [currentRating, setCurrentRating] = useState<Rating["rating"] | null>(null);
  const { user } = useAuth();
  const { activeProfile } = useProfileStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!user?.email || !activeProfile?.id) return;
    getRating(user.email, activeProfile.id, mediaId).then((r) => {
      if (r) setCurrentRating(r.rating);
    });
  }, [user?.email, activeProfile?.id, mediaId]);

  const handleRate = async (rating: Rating["rating"]) => {
    if (!user?.email || !activeProfile?.id) {
      addToast("Sign in to rate", "info");
      return;
    }
    const newRating = currentRating === rating ? null : rating;
    if (newRating) {
      await saveRating(user.email, activeProfile.id, mediaId, newRating);
      setCurrentRating(newRating);
      const labels = { up: "Liked!", down: "Not for me", love: "Loved it!" };
      addToast(labels[newRating]);
    } else {
      setCurrentRating(null);
    }
  };

  const btnClass = (type: Rating["rating"]) =>
    `flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
      currentRating === type
        ? "border-accent bg-accent/20 text-accent"
        : "border-white/30 bg-white/10 text-white hover:border-white/60 hover:bg-white/20"
    }`;

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => handleRate("up")} className={btnClass("up")} title="Like">
        <ThumbsUp size={16} />
      </button>
      <button onClick={() => handleRate("down")} className={btnClass("down")} title="Not for me">
        <ThumbsDown size={16} />
      </button>
      <button onClick={() => handleRate("love")} className={btnClass("love")} title="Love it">
        <Heart size={16} className={currentRating === "love" ? "fill-accent" : ""} />
      </button>
    </div>
  );
}
