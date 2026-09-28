import Link from "next/link";
import { systemKinds } from "@/lib/systems";
import { ScrollStory } from "../motion/ScrollStory";
import { SectionMarker } from "../motion/primitives";
import { Bench } from "./Bench";
import styles from "./systems.module.css";

/**
 * Three kinds of system, one pinned bench at a time.
 *
 * The friction is deliberate and bounded: three steps, a skip link, step
 * buttons, and nothing pinned below 768px or without JS, where all three
 * benches simply stack in their final state.
 */
export function SystemsStory({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="systems" data-chapter="systems" className="section" aria-labelledby="systems-title">
      <div className="page sheet">
        <SectionMarker n="02" label="Systems" note="watch where the checks sit" />
        <div className="body">
          <H id="systems-title" className="h-section">
            What I actually build
          </H>
          <p className={`lead ${styles.intro}`}>
            Three kinds of system. Each one has a model inside it; none of them is just a model. The interesting
            difference is not the model — it is where the deterministic parts sit relative to it.
          </p>

          <ScrollStory
            id="systems-story"
            label="Zone 01 · Three pipelines"
            pace="slow"
            className={styles.story}
            skipLabel="Skip to work"
            skipTo="#work"
            visual={
              <div className={styles.benches}>
                {systemKinds.map((kind, i) => (
                  <Bench key={kind.id} kind={kind} k={i + 1} />
                ))}
              </div>
            }
            steps={systemKinds.map((kind) => ({
              title: kind.title,
              body: (
                <>
                  <p className={styles.stepLine}>{kind.line}</p>
                  <p>{kind.body}</p>
                  {/* The decision itself lands on the bench, once the
                      pipeline has finished running. It is not repeated here. */}
                  <p className={styles.stepWhere}>
                    <span className="meta">Seen in</span>{" "}
                    {kind.projects.map((p, pi) => (
                      <span key={p.slug}>
                        {pi > 0 ? ", " : ""}
                        <Link href={`/work/${p.slug}`} className="link">
                          {p.label}
                        </Link>
                      </span>
                    ))}
                  </p>
                </>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
