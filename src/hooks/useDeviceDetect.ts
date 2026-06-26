"use client";
import { useState, useEffect } from "react";

interface DeviceInfo {
  isTV: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}

export function useDeviceDetect(): DeviceInfo {
  const [device, setDevice] = useState<DeviceInfo>({
    isTV: false,
    isMobile: false,
    isDesktop: true,
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isTV =
      ua.includes("tv") ||
      ua.includes("smarttv") ||
      ua.includes("android tv") ||
      ua.includes("webos") ||
      ua.includes("tizen") ||
      (window.screen.width >= 1280 && !("ontouchstart" in window) && ua.includes("android"));
    const isMobile =
      !isTV && ("ontouchstart" in window || ua.includes("mobile") || window.innerWidth < 768);
    const isDesktop = !isTV && !isMobile;

    setDevice({ isTV, isMobile, isDesktop });
  }, []);

  return device;
}
