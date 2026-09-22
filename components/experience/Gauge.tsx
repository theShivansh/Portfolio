import type { Gauge as GaugeSpec } from "@/lib/experience";
import styles from "./experience.module.css";

/**
 * A small comparative gauge. Dashed = before, solid = after, hatched =
 * a stated range. It only redraws the number next to it; no new data.
 */
export function Gauge({ gauge, label }: { gauge: GaugeSpec; label: string }) {
  if (gauge.kind === "none") return null;
  const W = 120;

  if (gauge.kind === "share") {
    const x = (gauge.value / 100) * W;
    return (
      <svg viewBox={`0 0 ${W} 14`} className={styles.gauge} aria-hidden="true" data-label={label}>
        <line x1="0" x2={W} y1="7" y2="7" className={styles.track} />
        <path d={`M0 7 H${x}`} pathLength={1} className={`draw-on-view ${styles.after}`} style={{ "--len": 1 } as React.CSSProperties} />
        <line x1={x} x2={x} y1="2" y2="12" className={styles.tick} />
      </svg>
    );
  }

  if (gauge.kind === "reduce") {
    const lo = W * (1 - (gauge.to ?? gauge.from) / 100);
    const hi = W * (1 - gauge.from / 100);
    return (
      <svg viewBox={`0 0 ${W} 18`} className={styles.gauge} aria-hidden="true">
        <line x1="0" x2={W} y1="4" y2="4" className={styles.before} />
        {gauge.to ? <rect x={lo} y="10" width={hi - lo} height="6" className={styles.band} /> : null}
        <path d={`M0 13 H${lo}`} pathLength={1} className={`draw-on-view ${styles.afterThick}`} style={{ "--len": 1 } as React.CSSProperties} />
      </svg>
    );
  }

  // increase: the baseline is 80% of the width; growth extends past it.
  const base = W * 0.8;
  const lo = base * (1 + gauge.from / 100);
  const hi = base * (1 + (gauge.to ?? gauge.from) / 100);
  const vbW = Math.ceil(hi + 2);
  return (
    <svg viewBox={`0 0 ${vbW} 18`} className={styles.gauge} aria-hidden="true">
      <line x1="0" x2={base} y1="4" y2="4" className={styles.before} />
      {gauge.to ? <rect x={lo} y="10" width={hi - lo} height="6" className={styles.band} /> : null}
      <path d={`M0 13 H${lo}`} pathLength={1} className={`draw-on-view ${styles.afterThick}`} style={{ "--len": 1 } as React.CSSProperties} />
    </svg>
  );
}
