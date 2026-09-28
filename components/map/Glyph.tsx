import type { Glyph as GlyphKind } from "@/lib/universe";
import styles from "./map.module.css";

/**
 * One drawing per system, of the thing that system actually handles: a
 * garment, two dates that disagree, a claim under attack. Not icons for
 * "AI" — the artifact itself, drawn at the size of a specimen label.
 *
 * Dashed strokes mean "the machine's guess"; solid means settled.
 */
const paths: Record<GlyphKind, React.ReactNode> = {
  // A garment read down the middle: left half measured, right half guessed.
  garment: (
    <>
      <path d="M22 6 L14 11 L10 21 L17 23 L17 42 L47 42 L47 23 L54 21 L50 11 L42 6" />
      <path d="M22 6 L32 13 L42 6" />
      <path d="M32 13 V42" strokeDasharray="3 3" className={styles.guess} />
      <path d="M38 20 h9 M38 26 h6" strokeDasharray="2 3" className={styles.guess} />
    </>
  ),
  // Two sheets with the same field and different values; the older struck out.
  document: (
    <>
      <path d="M8 8 h28 v32 H8 Z" />
      <path d="M14 16 h16 M14 22 h16" />
      <path d="M14 30 h13" className={styles.struck} />
      <path d="M12 30 h17" />
      <path d="M32 14 h24 v32 H32" />
      <path d="M38 24 h13 M38 32 h11" />
      <path d="M38 38 h9" className={styles.settled} />
    </>
  ),
  // A claim box with three independent attacks converging on it.
  claim: (
    <>
      <path d="M20 4 h24 v11 H20 Z" />
      <path d="M32 15 V22" />
      <path d="M32 22 H10 v8 M32 22 h22 v8 M32 22 v8" />
      <path d="M4 30 h12 v8 H4 Z M26 30 h12 v8 H26 Z M48 30 h12 v8 H48 Z" />
      <path d="M10 38 v4 h44 v-4" />
      <path d="M32 42 v4" />
      <path d="M29 43 l3 3 l3 -3" />
    </>
  ),
  // One point opening into a band: P10, P50, P90.
  fan: (
    <>
      <path d="M6 24 H14" />
      <path d="M14 24 C28 24 38 14 58 8" strokeDasharray="3 3" className={styles.guess} />
      <path d="M14 24 C28 24 40 38 58 40" strokeDasharray="3 3" className={styles.guess} />
      <path d="M14 24 C30 24 42 26 58 24" className={styles.settled} />
      <path d="M58 8 V40" strokeDasharray="2 3" />
      <path d="M6 44 h52" />
    </>
  ),
  // A response over time: baseline, rise, return.
  curve: (
    <>
      <path d="M6 40 h52" />
      <path d="M6 8 V40" />
      <path d="M8 34 C18 34 20 12 30 12 C40 12 42 30 56 31" className={styles.settled} />
      <path d="M8 34 h48" strokeDasharray="3 3" />
      <path d="M30 12 v22" strokeDasharray="2 3" className={styles.guess} />
    </>
  ),
  // Scatter on the left, an ordered stack on the right.
  stack: (
    <>
      <path d="M6 10 h11 v7 H6 Z" />
      <path d="M18 24 h9 v6 h-9 Z" />
      <path d="M5 33 h13 v6 H5 Z" />
      <path d="M22 12 h7 v6 h-7 Z" />
      <path d="M33 24 h6" />
      <path d="M36 21 l3 3 l-3 3" />
      <path d="M44 10 h16 v7 H44 Z M44 21 h16 v7 H44 Z M44 32 h16 v7 H44 Z" />
      <path d="M47 13.5 h4" className={styles.settled} />
    </>
  ),
  // An index: other people's tools, in a grid.
  index: (
    <>
      <path d="M6 8 h52 v34 H6 Z" />
      <path d="M6 16 h52" />
      <path d="M14 22 h10 v6 H14 Z M27 22 h10 v6 H27 Z M40 22 h10 v6 H40 Z" />
      <path d="M14 32 h10 v6 H14 Z M27 32 h10 v6 H27 Z M40 32 h10 v6 H40 Z" />
      <path d="M10 11 h6" />
    </>
  ),
};

export function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={styles.glyph}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[kind]}
    </svg>
  );
}
