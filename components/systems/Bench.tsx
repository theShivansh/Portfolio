import { roughArrow, roughRect } from "@/lib/sketch";
import { roleLabel, type SystemKind } from "@/lib/systems";
import styles from "./systems.module.css";

/**
 * A station's outline, drawn twice from two seeds. Swapping between them
 * when the station activates reads as the box being re-drawn by hand
 * rather than as a state class being toggled.
 */
function Frame({ seed, dashed }: { seed: number; dashed?: boolean }) {
  return (
    <svg
      className={styles.frame}
      viewBox="0 0 600 56"
      preserveAspectRatio="none"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      <path d={roughRect(3, 3, 594, 50, seed, 1.5)} data-f="rest" strokeDasharray={dashed ? "7 6" : undefined} />
      <path d={roughRect(3, 3, 594, 50, seed + 977, 2.6)} data-f="live" strokeDasharray={dashed ? "7 6" : undefined} />
    </svg>
  );
}

function Down({ seed }: { seed: number }) {
  return (
    <span className={styles.link} aria-hidden="true">
      <svg viewBox="0 0 16 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d={roughArrow(8, 2, 8, 27, seed, 6)} pathLength={1} className={styles.linkPath} />
      </svg>
    </span>
  );
}

/**
 * One kind of system, as the pipeline it is. Stations light in order, so
 * where the checks sit relative to the model is something you watch rather
 * than something you are told.
 */
export function Bench({ kind, k }: { kind: SystemKind; k: number }) {
  return (
    <div className={styles.bench} data-k={k}>
      <p className={styles.benchHead}>
        <span className={styles.benchN}>{kind.n}</span> {kind.title}
      </p>

      <ol className={styles.stations}>
        {kind.stations.map((s, i) => (
          <li
            key={s.name}
            className={styles.station}
            data-role={s.role}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className={styles.box}>
              <Frame seed={k * 137 + i * 29 + 11} dashed={s.role === "model"} />
              <span className={styles.role}>{roleLabel[s.role]}</span>
              <span className={styles.stationText}>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.detail}>{s.detail}</span>
              </span>
            </span>
            {i < kind.stations.length - 1 ? <Down seed={k * 53 + i * 17 + 5} /> : null}
          </li>
        ))}
      </ol>

      <p className={styles.decision} style={{ "--n": kind.stations.length } as React.CSSProperties}>
        {kind.decision}
      </p>
    </div>
  );
}
