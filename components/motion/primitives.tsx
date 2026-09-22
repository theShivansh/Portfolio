import type { ReactNode } from "react";
import { roughArrow, roughLine, roughUnderline } from "@/lib/sketch";
import styles from "./primitives.module.css";

/** Scroll-linked entrance using a CSS view timeline. No JS, no observer. */
export function Reveal({ children, as: Tag = "div", className = "" }: { children: ReactNode; as?: "div" | "li" | "section" | "article"; className?: string }) {
  return <Tag className={`reveal ${className}`}>{children}</Tag>;
}

/**
 * The margin column: chapter number and a short name, like the header of a
 * notebook page. Goes in `.sheet > .margin`.
 */
export function SectionMarker({ n, label, note }: { n: string; label: string; note?: string }) {
  return (
    <div className={`margin ${styles.marker}`}>
      <p className={styles.markerN} aria-hidden="true">
        {n}
      </p>
      <p className="meta">{label}</p>
      {note ? <p className={`hand field-only ${styles.markerNote}`}>{note}</p> : null}
    </div>
  );
}

/**
 * A handwritten note with an optional rough arrow. `fieldOnly` notes appear
 * only in field mode; the rest are part of the page.
 */
export function Annotation({
  children,
  arrow,
  fieldOnly = false,
  className = "",
  seed = 3,
}: {
  children: ReactNode;
  arrow?: "left" | "right" | "down" | "up";
  fieldOnly?: boolean;
  className?: string;
  seed?: number;
}) {
  const paths = {
    left: roughArrow(54, 14, 6, 22, seed),
    right: roughArrow(6, 14, 54, 22, seed),
    down: roughArrow(20, 4, 26, 52, seed),
    up: roughArrow(26, 52, 20, 4, seed),
  } as const;
  const box = arrow === "down" || arrow === "up" ? "0 0 46 58" : "0 0 60 34";
  return (
    <p className={`hand ${styles.annotation} ${fieldOnly ? "field-only" : ""} ${className}`} data-arrow={arrow}>
      {arrow ? (
        <svg viewBox={box} className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d={paths[arrow]} />
        </svg>
      ) : null}
      <span>{children}</span>
    </p>
  );
}

/** A pencil line that draws itself as it scrolls into view. */
export function HandDrawnLine({
  width = 240,
  kind = "underline",
  seed = 5,
  className = "",
}: {
  width?: number;
  kind?: "underline" | "rule";
  seed?: number;
  className?: string;
}) {
  const d = kind === "underline" ? roughUnderline(2, 8, width - 4, seed) : roughLine(2, 6, width - 2, 6, seed, 1.2);
  return (
    <svg viewBox={`0 0 ${width} 14`} className={`${styles.line} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" preserveAspectRatio="none">
      <path d={d} pathLength={1} className="draw-on-view" style={{ "--len": 1 } as React.CSSProperties} />
    </svg>
  );
}
