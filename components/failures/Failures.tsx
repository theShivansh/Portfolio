import Link from "next/link";
import { flightRecords } from "@/lib/universe";
import { SectionMarker } from "../motion/primitives";
import styles from "./failures.module.css";

const rows = [
  { key: "expected", label: "Expected" },
  { key: "observed", label: "Observed" },
  { key: "response", label: "Response" },
  { key: "result", label: "Result" },
] as const;

/**
 * The recorder. Seven things that broke, in the format a post-incident note
 * takes: what was expected, what actually happened, what was changed, and
 * what it is now. This is the only dark surface on the site, because it is
 * the only part of it that is an instrument rather than a page.
 */
export function Failures({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="failures" data-chapter="failures" data-world="recorder"
      data-world-dark=""
      className={`section ${styles.section}`} aria-labelledby="failures-title">
      <div className="page sheet">
        <SectionMarker n="07" label="Broke" note="nothing here was quietly deleted" />
        <div className="body">
          <H id="failures-title" className="h-section">
            What broke
          </H>
          <p className={`lead ${styles.intro}`}>
            Every system on this page has a version that did not work. These are the ones that changed an architecture
            rather than a line of code. They are kept because the fix is the interesting part.
          </p>

          <p className={styles.strip}>
            <span>Flight recorder</span>
            <span aria-hidden="true">/</span>
            <span>{flightRecords.length} records</span>
            <span aria-hidden="true">/</span>
            <span>none removed</span>
          </p>

          <ol className={styles.records}>
            {flightRecords.map((f) => (
              <li key={f.id} id={f.id.toLowerCase()} className={`reveal ${styles.record}`}>
                <div className={styles.recHead}>
                  <p className={styles.recId}>{f.id}</p>
                  <p className={styles.recWhere}>
                    <Link href={`/work/${f.slug}`} className={styles.recLink}>
                      {f.system}
                    </Link>
                    <span aria-hidden="true"> · </span>
                    <span>{f.date}</span>
                  </p>
                </div>

                <h3 className={styles.recTitle}>{f.failure}</h3>

                <dl className={styles.trace}>
                  {rows.map((r) => (
                    <div key={r.key} className={styles.traceRow} data-row={r.key}>
                      <dt className={styles.traceKey}>{r.label}</dt>
                      <dd className={styles.traceVal}>{f[r.key]}</dd>
                    </div>
                  ))}
                </dl>

                <p className={styles.recSource}>{f.source}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
