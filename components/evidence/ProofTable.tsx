import Link from "next/link";
import { proofRows } from "@/lib/content";
import styles from "./evidence.module.css";

/**
 * "Show me the engineering." Native <details>: keyboard and screen-reader
 * support for free, works without JavaScript.
 */
export function ProofTable() {
  return (
    <div className={styles.table}>
      <div className={styles.headRow} aria-hidden="true">
        <span>Area</span>
        <span>What it is</span>
        <span>Where I used it</span>
      </div>
      {proofRows.map((r) => (
        <details key={r.id} className={styles.row} data-cursor="inspect">
          <summary className={styles.summary}>
            <span className={styles.area}>{r.area}</span>
            <span className={styles.what}>{r.summary}</span>
            <span className={styles.whereInline}>{r.where.map((w) => w.label).join(", ")}</span>
            <span className={styles.toggle} aria-hidden="true" />
          </summary>
          <div className={styles.detail}>
            <div>
              <p className="meta">Why it exists</p>
              <p>{r.why}</p>
            </div>
            <div>
              <p className="meta">How it works</p>
              <p>{r.how}</p>
            </div>
            <div>
              <p className="meta">Where I used it</p>
              <ul className={styles.where}>
                {r.where.map((w) => (
                  <li key={w.slug}>
                    <Link href={`/work/${w.slug}`} className="link">
                      {w.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
