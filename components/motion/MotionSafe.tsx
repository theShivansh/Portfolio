"use client";

import type { ReactNode } from "react";
import type { MotionPreference } from "@/lib/motion";
import { useHtmlData } from "@/lib/use-html-data";

/** The live motion preference; "full" during SSR. */
export function useMotionPreference(): MotionPreference {
  return useHtmlData("motion", "full") === "reduced" ? "reduced" : "full";
}

/** Renders `children` only with full motion, otherwise the static fallback. */
export function MotionSafe({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return useMotionPreference() === "full" ? children : fallback;
}
