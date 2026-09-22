import Link from "next/link";
import { labNotes } from "@/lib/content";
import { SectionMarker } from "../motion/primitives";
import { ProofTable } from "../evidence/ProofTable";
import { LabNotes } from "./LabNotes";
import styles from "./notes.module.css";

export function NotesSection() {
  return (
    <>
      <section id="notes" data-chapter="notes" className="section" aria-labelledby="notes-title">
        <div className="page sheet">
          <SectionMarker n="05" label="Notes" note="written after the fact" />
          <div className="body">
            <h2 id="notes-title" className="h-section">
              Lab notes
            </h2>
            <p className={`lead ${styles.lead}`}>What broke, what was measured, and the rule it turned into.</p>
            <LabNotes limit={4} />
            <p className={styles.more}>
              <Link href="/notes" className="btn">
                All {labNotes.length} notes
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section id="evidence" data-chapter="notes" className="section" aria-labelledby="evidence-title">
        <div className="page sheet">
          <SectionMarker n="05b" label="Evidence" />
          <div className="body">
            <h2 id="evidence-title" className="h-section">
              Show me the engineering
            </h2>
            <p className={`lead ${styles.lead}`}>Seven practices, why each exists, and where to check it. Open a row.</p>
            <ProofTable />
          </div>
        </div>
      </section>
    </>
  );
}
