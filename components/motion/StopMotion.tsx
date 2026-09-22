"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { currentMotion, stopMotionFps } from "@/lib/motion";

export type StopMotionTrigger = "once" | "view" | "hover" | "click" | "loop";

type Props = {
  /** One SVG path `d` per frame (see lib/sketch.ts `frames`). */
  frames: string[];
  viewBox: string;
  trigger?: StopMotionTrigger;
  /** Play the sequence backwards (e.g. an arrow being erased). */
  reverse?: boolean;
  fps?: number;
  /** Frames per play for "hover" and "loop"; they cycle ("boil"). */
  cycles?: number;
  strokeWidth?: number;
  className?: string;
  /** Accessible label. Omit for decorative drawings (they get aria-hidden). */
  label?: string;
};

/**
 * Frame-by-frame SVG line animation, the hand-drawn "boil".
 * Reduced motion shows the final frame and never plays.
 */
export function StopMotion({
  frames,
  viewBox,
  trigger = "view",
  reverse = false,
  fps = stopMotionFps,
  cycles = 1,
  strokeWidth = 1.6,
  className,
  label,
}: Props) {
  const ordered = reverse ? [...frames].reverse() : frames;
  const last = ordered.length - 1;
  const [index, setIndex] = useState(last);
  const timer = useRef<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
  }, []);

  // State only changes inside timer ticks, never synchronously on start.
  // Reduced motion never starts a timer, so the final frame stays put.
  const run = useCallback(
    (loop: boolean) => {
      if (currentMotion() === "reduced" || ordered.length < 2) return;
      stop();
      let i = -1;
      const total = loop ? Number.POSITIVE_INFINITY : ordered.length * cycles;
      timer.current = window.setInterval(() => {
        i += 1;
        if (i >= total) {
          setIndex(last);
          stop();
          return;
        }
        setIndex(i % ordered.length);
      }, 1000 / fps);
    },
    [ordered.length, cycles, fps, last, stop],
  );

  useEffect(() => {
    if (trigger === "once") run(false);
    if (trigger === "loop") run(true);
    if (trigger !== "view" || !ref.current) return stop;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          run(false);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [trigger, run, stop]);

  const handlers =
    trigger === "hover"
      ? { onPointerEnter: () => run(false), onFocus: () => run(false) }
      : trigger === "click"
        ? { onClick: () => run(false) }
        : {};

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      {...handlers}
    >
      <path d={ordered[index]} />
    </svg>
  );
}
