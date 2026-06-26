"use client";
import { Share2 } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

interface ShareButtonProps {
  title: string;
  mediaId: number;
  mediaType: "movie" | "tv";
}

export default function ShareButton({ title, mediaId, mediaType }: ShareButtonProps) {
  const addToast = useToastStore((s) => s.addToast);

  const handleShare = async () => {
    const url = `${window.location.origin}?play=${mediaType}-${mediaId}`;
    const shareData = {
      title: `Watch "${title}" on Aurora`,
      text: `Check out "${title}" on Aurora Streaming`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      addToast("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/60 hover:bg-white/20 transition"
      title="Share"
    >
      <Share2 size={16} className="text-white" />
    </button>
  );
}
