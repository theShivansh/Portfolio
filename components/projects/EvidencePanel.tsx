import type { EvidenceItem, EvidenceStatus } from "@/lib/types";
import styles from "./case.module.css";

const statusText: Record<EvidenceStatus, string> = {
  "test-verified": "Test-verified",
  measured: "Measured",
  benchmark: "Own benchmark",
  reported: "Reported in README",
};

/** Numbers with their provenance. Every value says how it is known. */
export function EvidencePanel({ items, title = "Evidence", repo }: { items: EvidenceItem[]; title?: string; repo?: string }) {
  if (!items.length) return null;
  return (
    <section className={styles.evidence} aria-label={title}>
      <p className="meta">{title}</p>
      <dl className={styles.evidenceList}>
        {items.map((e) => (
          <div key={e.label} className={styles.evidenceItem}>
            <dt className={styles.evidenceLabel}>{e.label}</dt>
            <dd className={styles.evidenceValue}>{e.value}</dd>
            <dd className={styles.evidenceMeta}>
              <span className={styles.status} data-status={e.status}>
                {statusText[e.status]}
              </span>
              {repo ? (
                <a href={`${repo}#readme`} className={styles.source} target="_blank" rel="noopener">
                  {e.source}
                </a>
              ) : (
                <span className={styles.source}>{e.source}</span>
              )}
            </dd>
            {e.note ? <dd className={styles.evidenceNote}>{e.note}</dd> : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
