import { drawFrames, roughUnderline } from "@/lib/sketch";
import { SectionMarker } from "../motion/primitives";
import { StopMotion } from "../motion/StopMotion";
import { Timeline } from "./Timeline";
import styles from "./about.module.css";

const columns = [
  { head: "Build", items: ["AI systems", "Agent orchestration", "Reasoning pipelines", "Full-stack products"] },
  { head: "Care about", items: ["Evidence", "Reliability", "Human control", "Useful automation"] },
];

export function About({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="about" data-chapter="about" className="section" aria-labelledby="about-title">
      <div className="page sheet">
        <SectionMarker n="06" label="About" />
        <div className="body">
          <H id="about-title" className="h-section">
            Who is behind the systems?
          </H>

          <div className={styles.grid}>
            <div className={styles.who}>
              <p className={styles.name}>Shivansh Shukla</p>
              <ul className={styles.roles}>
                <li>AI Engineer</li>
                <li>Full-Stack Builder</li>
                <li>Systems Thinker</li>
              </ul>
            </div>
            {columns.map((c) => (
              <div key={c.head} className={styles.col}>
                <p className="meta">{c.head}</p>
                <ul>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className={styles.bio}>
            I work end to end: Python services and evaluation harnesses, TypeScript interfaces, and the cloud underneath.
            That range comes from two roles, agent and retrieval work at Technology Mindz and AWS infrastructure at GRRAS
            Solutions, and from the systems on this page. Most of what I build is about the space around a model: what it can see, what it is allowed to
            decide, how its output is checked, and how a person corrects it.
          </p>

          <blockquote className={styles.quote}>
            <p>
              Models can be impressive.
              <br />
              Systems have to be dependable.
            </p>
            <StopMotion
              frames={drawFrames((p) => roughUnderline(4, 10, 300, 9, p), 7)}
              viewBox="0 0 308 18"
              trigger="view"
              className={styles.underline}
            />
          </blockquote>

          <Timeline />
        </div>
      </div>
    </section>
  );
}
