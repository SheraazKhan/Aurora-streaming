"use client";
import { useEffect, useCallback } from "react";

export function useTVNavigation(enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select'
        )
      ).filter((el) => el.offsetParent !== null);

      const current = document.activeElement as HTMLElement;
      const currentIdx = focusable.indexOf(current);

      const getRect = (el: HTMLElement) => el.getBoundingClientRect();

      switch (e.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowDown": {
          e.preventDefault();
          if (currentIdx === -1) {
            focusable[0]?.focus();
            return;
          }

          const currentRect = getRect(current);
          let bestEl: HTMLElement | null = null;
          let bestDist = Infinity;

          for (const el of focusable) {
            if (el === current) continue;
            const rect = getRect(el);
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const ccx = currentRect.left + currentRect.width / 2;
            const ccy = currentRect.top + currentRect.height / 2;

            let valid = false;
            if (e.key === "ArrowRight" && cx > ccx + 10) valid = true;
            if (e.key === "ArrowLeft" && cx < ccx - 10) valid = true;
            if (e.key === "ArrowDown" && cy > ccy + 10) valid = true;
            if (e.key === "ArrowUp" && cy < ccy - 10) valid = true;

            if (valid) {
              const dist = Math.hypot(cx - ccx, cy - ccy);
              if (dist < bestDist) {
                bestDist = dist;
                bestEl = el;
              }
            }
          }

          if (bestEl) bestEl.focus();
          break;
        }
        case "Enter": {
          if (current && current !== document.body) {
            current.click();
          }
          break;
        }
        case "Escape":
        case "Backspace": {
          window.history.back();
          break;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, handleKeyDown]);
}
