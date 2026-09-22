import { timeline } from "@/lib/content";
import styles from "./about.module.css";

/** Only verifiable entries: roles, and account and repository dates from GitHub. */
export function Timeline() {
  return (
    <section className={styles.timeline} aria-labelledby="timeline-title">
      <h3 id="timeline-title" className={styles.timelineTitle}>
        Timeline
      </h3>
      <ol className={styles.years}>
        {timeline.map((t) => (
          <li key={t.year} className={styles.year} data-future={t.year === "2027" || undefined}>
            <p className={styles.yearN}>{t.year}</p>
            <p className={styles.phase}>{t.phase}</p>
            <ul className={styles.entries}>
              {t.entries.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
