import { achievements } from "@/lib/universe";
import styles from "./experience.module.css";

/**
 * Three results scored by someone other than me. They sit inside the
 * experience chapter because that is what they are: outside checks on the
 * same work, on someone else's clock and someone else's rubric.
 */
export function Results() {
  return (
    <div id="results" className={styles.results}>
      <div className={styles.resultsHead}>
        <h3 className={styles.resultsTitle}>Marked by other people</h3>
        <p className={styles.resultsLead}>
          Everything else on this site is my own account of my own work. These three were judged by someone else.
        </p>
      </div>

      <ol className={styles.resultList}>
        {achievements.map((a, i) => (
          <li key={a.id} className={`reveal ${styles.result}`}>
            <p className={styles.resultN}>R.{String(i + 1).padStart(2, "0")}</p>
            <p className={styles.resultAward}>{a.award}</p>
            <p className={styles.resultEvent}>
              {a.event} <span aria-hidden="true">·</span> {a.year}
            </p>
            {a.field ? <p className={styles.resultField}>{a.field}</p> : null}
            <p className={styles.resultLine}>{a.line}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
