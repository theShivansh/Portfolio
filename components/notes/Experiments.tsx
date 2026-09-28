import Link from "next/link";
import { roughRect } from "@/lib/sketch";
import { experiments } from "@/lib/universe";
import styles from "./notes.module.css";

/** A rubber stamp, drawn rather than imaged. */
function Stamp({ shipped, seed }: { shipped: boolean; seed: number }) {
  return (
    <p className={styles.stamp} data-shipped={shipped || undefined}>
      <svg viewBox="0 0 160 52" className={styles.stampBox} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d={roughRect(4, 4, 152, 44, seed, 1.8)} />
      </svg>
      <span>{shipped ? "Shipped" : "Not shipped"}</span>
    </p>
  );
}

const fields = [
  { key: "hypothesis", label: "Hypothesis" },
  { key: "result", label: "Result" },
  { key: "cost", label: "Cost" },
] as const;

/**
 * The experiment archive. Each card carries the gate that was written down
 * before the run, so "it improved the metric" and "it shipped" stay separate
 * questions.
 */
export function Experiments() {
  return (
    <ol className={styles.experiments}>
      {experiments.map((e, i) => (
        <li key={e.id} id={`exp-${e.id.toLowerCase()}`} className={`reveal ${styles.experiment}`}>
          <div className={styles.expHead}>
            <p className={styles.expId}>{e.id}</p>
            <p className={styles.expWhere}>
              {e.slug ? (
                <Link href={`/work/${e.slug}`} className="link">
                  {e.system}
                </Link>
              ) : (
                e.system
              )}
            </p>
          </div>

          <h3 className={styles.expTitle}>{e.title}</h3>

          <dl className={styles.expFields}>
            {fields.map((f) => (
              <div key={f.key} className={styles.expRow}>
                <dt className={styles.expKey}>{f.label}</dt>
                <dd className={styles.expVal}>{e[f.key]}</dd>
              </div>
            ))}
            <div className={styles.expRow} data-gate={e.gate}>
              <dt className={styles.expKey}>Gate</dt>
              <dd className={styles.expVal}>
                <span className={styles.gateFlag}>{e.gate}</span> {e.gateNote}
              </dd>
            </div>
            <div className={styles.expRow}>
              <dt className={styles.expKey}>Decision</dt>
              <dd className={styles.expVal}>{e.decision}</dd>
            </div>
          </dl>

          <div className={styles.expFoot}>
            <Stamp shipped={e.shipped} seed={i * 7 + 3} />
            <p className={styles.expSource}>{e.source}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
