import { principles } from "@/lib/content";
import { frames, roughArrow, roughLine } from "@/lib/sketch";
import { StopMotion } from "../motion/StopMotion";
import styles from "./architecture.module.css";

/**
 * Five working principles. Each tiny diagram shows the right arrow and
 * crosses out the tempting one: MODEL → PROPOSAL, not MODEL → TRUTH.
 */
export function Principles({ level: H = "h4" }: { level?: "h3" | "h4" }) {
  return (
    <ol className={styles.principles}>
      {principles.map((p, i) => (
        <li key={p.n} className={`reveal ${styles.principle}`} aria-labelledby={`principle-${p.n}`}>
          <p className={styles.pn}>{p.n}</p>
          <H id={`principle-${p.n}`} className={styles.ptitle}>
            {p.title}
          </H>
          <div className={styles.mini} aria-label={`${p.diagram.from} leads to ${p.diagram.to}, not ${p.diagram.not}`} role="img">
            <span className={styles.miniBox}>{p.diagram.from}</span>
            <StopMotion
              frames={frames((s) => roughArrow(4, 10, 44, 10, s, 6), 4, 60 + i * 9)}
              viewBox="0 0 48 20"
              trigger="hover"
              cycles={2}
              className={styles.miniArrow}
            />
            <span className={`${styles.miniBox} ${styles.miniTo}`}>{p.diagram.to}</span>
            <span className={styles.miniNot}>
              <span>{p.diagram.not}</span>
              <svg viewBox="0 0 80 20" preserveAspectRatio="none" aria-hidden="true">
                <path d={roughLine(2, 14, 78, 6, 80 + i)} />
              </svg>
            </span>
          </div>
          <p className={styles.pbody}>{p.body}</p>
          <p className={styles.pwhere}>{p.where}</p>
        </li>
      ))}
    </ol>
  );
}
