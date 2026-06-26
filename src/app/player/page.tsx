"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useCallback } from "react";

function PlayerContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "movie";
  const s = searchParams.get("s") || "1";
  const e = searchParams.get("e") || "1";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl = type === "tv"
    ? `https://www.2embed.skin/embedtv/${id}&s=${s}&e=${e}`
    : `https://www.2embed.skin/embed/${id}`;

  const notifyParent = useCallback((event: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: "PLAYER_EVENT", event }, "*");
    }
  }, []);

  useEffect(() => {
    notifyParent("loaded");
    const iframe = iframeRef.current;
    if (!iframe) return;

    let loadCount = 0;
    let hasNotifiedEnded = false;

    // Method 1: iframe load event — fires when the embed navigates internally
    const handleLoad = () => {
      loadCount++;
      // Skip first 2 loads (initial page + player setup)
      // Any load after that while playing = video ended or player navigated
      if (loadCount > 2 && !hasNotifiedEnded) {
        hasNotifiedEnded = true;
        notifyParent("ended");
      }
    };
    iframe.addEventListener("load", handleLoad);

    // Method 2: Focus heuristic — when video ends, many players
    // shift focus or the iframe loses interactivity.
    // We detect when the user's mouse leaves the iframe area after
    // being inside for a long time (they watched the whole video).
    let mouseEnterTime = 0;
    const handleMouseEnter = () => { mouseEnterTime = Date.now(); };
    const handleMouseLeave = () => {
      // If the mouse was inside the player for > 10 minutes and left,
      // that's a signal the video might have ended
      if (mouseEnterTime > 0 && Date.now() - mouseEnterTime > 10 * 60 * 1000) {
        // Don't auto-trigger, just note it for potential use
      }
    };
    iframe.addEventListener("mouseenter", handleMouseEnter);
    iframe.addEventListener("mouseleave", handleMouseLeave);

    // Method 3: Periodic check — try to detect if iframe src was changed
    // or if the iframe navigated to about:blank
    const checkInterval = setInterval(() => {
      if (!iframe || hasNotifiedEnded) return;
      try {
        const loc = iframe.contentWindow?.location?.href;
        if (loc && (loc === "about:blank" || loc.includes("about:blank"))) {
          hasNotifiedEnded = true;
          notifyParent("ended");
        }
      } catch {
        // Cross-origin: expected, video still playing
      }
    }, 5000);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.removeEventListener("mouseenter", handleMouseEnter);
      iframe.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(checkInterval);
    };
  }, [notifyParent, embedUrl]);

  // Full-screen player with no navbar/chrome
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999 }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        style={{ width: "100%", height: "100%", border: "none" }}
        allowFullScreen
        allow="autoplay; encrypted-media"
        title="player"
      />
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div style={{ position: "fixed", inset: 0, background: "#000" }} />}>
      <PlayerContent />
    </Suspense>
  );
}
