import Link from "next/link";
import { labNotes } from "@/lib/content";
import { experiments } from "@/lib/universe";
import { Annotation, SectionMarker } from "../motion/primitives";
import { Experiments } from "./Experiments";
import { LabNotes } from "./LabNotes";
import styles from "./notes.module.css";

export function NotesSection() {
  const shipped = experiments.filter((e) => e.shipped).length;
  return (
    <section id="notes" data-chapter="notes" className="section" aria-labelledby="notes-title">
      <div className="page sheet">
        <SectionMarker n="08" label="Lab" note="the gate is written down before the run" />
        <div className="body">
          <h2 id="notes-title" className="h-section">
            What I learned
          </h2>
          <p className={`lead ${styles.lead}`}>
            Things I measured, and what I did about the measurement. An experiment that improves a metric and an
            experiment worth shipping are two different results, so the card records both.
          </p>

          <p className={styles.tally}>
            <span>{experiments.length} experiments</span>
            <span aria-hidden="true">/</span>
            <span>{shipped} shipped</span>
            <span aria-hidden="true">/</span>
            <span>{experiments.length - shipped} kept off in production</span>
          </p>

          <Experiments />

          <div className={styles.notesHead}>
            <h3 className={styles.notesTitle}>Shorter notes</h3>
            <Annotation arrow="down" className={styles.notesNote} seed={44}>
              written after the fact, from decision records and benchmark logs
            </Annotation>
          </div>
          <LabNotes limit={4} />
          <p className={styles.more}>
            <Link href="/notes" className="btn">
              All {labNotes.length} notes
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
