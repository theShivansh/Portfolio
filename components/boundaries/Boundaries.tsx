import Link from "next/link";
import { roughArrow, roughLine } from "@/lib/sketch";
import { boundaries } from "@/lib/universe";
import { Annotation, SectionMarker } from "../motion/primitives";
import styles from "./boundaries.module.css";

/**
 * One drawing, repeated six times: the model's path into a decision is cut,
 * and something deterministic reaches it instead. The cross is drawn by
 * hand because it is a decision I made, not a property of the model.
 */
function Cut({ seed }: { seed: number }) {
  return (
    <svg viewBox="0 0 86 34" className={styles.cut} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      {/* No arrowhead: this path does not arrive. */}
      <path d={roughLine(2, 17, 82, 17, seed, 1.2)} strokeWidth="1.3" strokeDasharray="4 4" className={styles.cutLine} />
      <path d={roughLine(34, 6, 52, 28, seed + 1, 1.4)} strokeWidth="2.2" className={styles.cross} />
      <path d={roughLine(52, 6, 34, 28, seed + 2, 1.4)} strokeWidth="2.2" className={styles.cross} />
    </svg>
  );
}

function Into({ seed }: { seed: number }) {
  return (
    <svg viewBox="0 0 74 34" className={styles.into} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d={roughArrow(72, 17, 3, 17, seed, 6)} strokeWidth="1.8" />
    </svg>
  );
}

export function Boundaries({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="boundaries" data-chapter="boundaries" className="section" aria-labelledby="boundaries-title">
      <div className="page sheet">
        <SectionMarker n="04" label="Trust" note="the shortest list on the site, and the one I'd defend hardest" />
        <div className="body">
          <H id="boundaries-title" className="h-section">
            What the model is not allowed to decide
          </H>
          <p className={`lead ${styles.intro}`}>
            Every system here has a model inside it. None of them lets the model decide these six things. This is the
            list I actually work from, and each line names the code that enforces it.
          </p>

          <Annotation className={styles.note} seed={31}>
            a model that can be wrong is fine. a model that can be wrong about the wrong thing is not.
          </Annotation>

          <ol className={styles.list}>
            {boundaries.map((b, i) => (
              <li key={b.id} id={`bnd-${b.id}`} className={`reveal ${styles.item}`}>
                <div className={styles.head}>
                  <p className={styles.n}>B.{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={styles.subject}>{b.subject}</h3>
                </div>

                <div className={styles.flow} role="img" aria-label={`The model cannot decide ${b.subject}. ${b.owner} decides it.`}>
                  <span className={styles.actorModel}>Model</span>
                  <Cut seed={i * 3 + 7} />
                  <span className={styles.slot}>{b.subject}</span>
                  <Into seed={i * 3 + 9} />
                  <span className={styles.actorOwner}>{b.owner}</span>
                </div>

                <p className={styles.rule}>{b.rule}</p>
                <p className={styles.mechanism}>{b.mechanism}</p>
                <p className={styles.where}>
                  <Link href={`/work/${b.where.slug}`} className="link">
                    {b.where.label}
                  </Link>
                  <span className={styles.source}>{b.source}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
