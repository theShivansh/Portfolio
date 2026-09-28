import Link from "next/link";
import { roughArrow } from "@/lib/sketch";
import { Glyph } from "../map/Glyph";
import type { Glyph as GlyphKind } from "@/lib/universe";
import styles from "./pipeline.module.css";

type Station = {
  n: string;
  verb: string;
  /** The micro-label: what this stage actually produces. */
  detail: string;
  glyph: GlyphKind;
  slug: string;
  /** Names the system the stage is taken from. */
  where: string;
};

/**
 * Four stages, each taken from a system that exists. The glyph is the same
 * drawing that system carries on the map, so the hero and the map are the
 * same objects seen twice.
 */
const stations: Station[] = [
  { n: "01", verb: "Perceive", detail: "photo → fields + confidence", glyph: "garment", slug: "stylelab", where: "StyleLab" },
  { n: "02", verb: "Reason", detail: "retrieve, cite, drop the rest", glyph: "document", slug: "crown-x", where: "CROWN-X" },
  { n: "03", verb: "Simulate", detail: "1,200 paths, then a number", glyph: "fan", slug: "moneymentor-ai", where: "MoneyMentor AI" },
  { n: "04", verb: "Act", detail: "one small step, typed JSON", glyph: "stack", slug: "zenstep", where: "ZenStep" },
];

/**
 * The pipeline reads correctly standing still: every stage is present, in
 * order, fully legible. Scrolling the first quarter of a screen lights each
 * stage in turn and settles it, so the sequence is felt rather than stated.
 * Nothing here takes the wheel; the motion is bound to the scroll position.
 */
export function Pipeline() {
  return (
    <div className={styles.wrap}>
      <p className={styles.caption} id="pipeline-caption">
        What the systems do, end to end
      </p>
      <ol className={styles.pipeline} aria-labelledby="pipeline-caption">
        {stations.map((s, i) => (
          <li key={s.verb} className={styles.station}>
            <Link href={`/work/${s.slug}`} className={styles.box}>
              <span className={styles.n}>{s.n}</span>
              <span className={styles.glyphSlot} aria-hidden="true">
                <Glyph kind={s.glyph} />
              </span>
              <span className={styles.verb}>{s.verb}</span>
              <span className={styles.detail}>{s.detail}</span>
              <span className={styles.where}>{s.where}</span>
              <span className={styles.bar} aria-hidden="true" />
            </Link>
            {i < stations.length - 1 ? (
              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 40 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d={roughArrow(3, 8, 36, 8, 70 + i, 6)} pathLength={1} className={styles.arrowPath} />
                </svg>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <span className={styles.rail} aria-hidden="true" />
    </div>
  );
}
