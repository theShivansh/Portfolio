"use client";

import { useEffect } from "react";
import { isTrackEvent, track } from "@/lib/analytics";

/**
 * One delegated listener for every [data-track] link on the site, so
 * individual links stay server-rendered.
 */
export function Tracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const name = el.dataset.track;
      if (isTrackEvent(name)) track(name, { project: el.dataset.project });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
