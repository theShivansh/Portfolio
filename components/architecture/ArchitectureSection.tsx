import { Annotation, SectionMarker } from "../motion/primitives";
import { NoteToSystem } from "./NoteToSystem";
import { Principles } from "./Principles";
import styles from "./architecture.module.css";

export function ArchitectureSection() {
  return (
    <section id="architecture" data-chapter="architecture" className="section" aria-labelledby="architecture-title">
      <div className="page sheet">
        <SectionMarker n="03" label="Architecture" note="how a box becomes a system" />
        <div className="body">
          <h2 id="architecture-title" className="h-section">
            How I build AI
          </h2>
          <p className={`lead ${styles.intro}`}>
            I start with a sketch and keep asking what the model should not decide. The answers become the architecture.
          </p>

          <div className={styles.story}>
            <NoteToSystem />
          </div>

          <div className={styles.thinkHead}>
            <h3 className={styles.thinkTitle}>How I think</h3>
            <Annotation arrow="down" className={styles.thinkNote} seed={12}>
              five rules, each learned the hard way
            </Annotation>
          </div>
          <Principles />
        </div>
      </div>
    </section>
  );
}
