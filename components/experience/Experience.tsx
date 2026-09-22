import Link from "next/link";
import { roles } from "@/lib/experience";
import { ArchitectureDiagram } from "../diagrams/ArchitectureDiagram";
import { SectionMarker } from "../motion/primitives";
import { Gauge } from "./Gauge";
import styles from "./experience.module.css";

/**
 * Experience as a field log: each role is a dated posting with its
 * measured outcomes, what was done, the shape of the system, and where
 * the same techniques show up again in the projects.
 */
export function Experience({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="experience" data-chapter="experience" className="section" aria-labelledby="experience-title">
      <div className="page sheet">
        <SectionMarker n="03" label="Experience" note="two postings, both sides of the stack" />
        <div className="body">
          <H id="experience-title" className="h-section">
            Experience
          </H>
          <p className={`lead ${styles.intro}`}>
            Two roles, one on each side of an AI system: the retrieval and agents that answer, then the cloud and Linux
            infrastructure they run on.
          </p>

          <ol className={styles.roles}>
            {roles.map((r, i) => (
              <li key={r.id} className={styles.role}>
                <article aria-labelledby={`role-${r.id}`} className={styles.entry}>
                  <div className={styles.rail}>
                    <p className={styles.entryN}>E.{String(i + 1).padStart(2, "0")}</p>
                    <time dateTime={r.isoStart} className={styles.date}>
                      {r.start}
                    </time>
                    <svg viewBox="0 0 10 100" preserveAspectRatio="none" className={styles.railLine} aria-hidden="true">
                      <path d="M5 0 V100" pathLength={1} className="draw-on-view" style={{ "--len": 1 } as React.CSSProperties} />
                    </svg>
                    <time dateTime={r.isoEnd} className={styles.date}>
                      {r.end}
                    </time>
                    <p className={styles.duration}>{r.duration}</p>
                  </div>

                  <div className={styles.main}>
                    <p className={styles.org}>
                      {r.org} <span aria-hidden="true">·</span> {r.location}
                    </p>
                    <h3 id={`role-${r.id}`} className={styles.title}>
                      {r.title}
                    </h3>
                    <p className={styles.summary}>{r.summary}</p>
                    <p className={`hand ${styles.note}`} aria-hidden="true">
                      {r.note}
                    </p>

                    <dl className={styles.metrics} aria-label="Outcomes">
                      {r.metrics.map((m, mi) => (
                        <div key={m.label} className={`reveal ${styles.metric}`} data-lead={mi === 0 || undefined}>
                          <dt className={styles.metricLabel}>{m.label}</dt>
                          <dd className={styles.metricValue}>{m.value}</dd>
                          <dd className={styles.metricGauge}>
                            <Gauge gauge={m.gauge} label={m.label} />
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <ol className={styles.log}>
                      {r.highlights.map((h) => (
                        <li key={h.verb}>
                          <span className={styles.verb}>{h.verb}</span>
                          <span className={styles.logText}>{h.text}</span>
                        </li>
                      ))}
                    </ol>

                    <div className={styles.lower}>
                      <div>
                        <p className="meta">Shape of the system</p>
                        <ArchitectureDiagram nodes={r.system} label={`${r.org}: system shape`} legend={false} className={styles.diagram} />
                      </div>
                      <div className={styles.side}>
                        <p className="meta">Stack</p>
                        <p className={styles.stack}>{r.stack.join(" / ")}</p>
                        <p className="meta">Same techniques, later</p>
                        <ul className={styles.carried}>
                          {r.carriedInto.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/work/${c.slug}`} className="link">
                                {c.label}
                              </Link>{" "}
                              <span>{c.why}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
