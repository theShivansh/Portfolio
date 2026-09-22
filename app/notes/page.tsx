import type { Metadata } from "next";
import { SectionMarker } from "@/components/motion/primitives";
import { LabNotes } from "@/components/notes/LabNotes";
import { ProofTable } from "@/components/evidence/ProofTable";
import styles from "../subpage.module.css";

export const metadata: Metadata = {
  title: "Lab notes",
  description: "What broke, what was measured, and the rule it turned into: lessons from building AI systems.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <div className="page sheet">
        <SectionMarker n="05" label="Notes" />
        <div className="body">
          <h1 className={styles.title}>Lab notes</h1>
          <p className={styles.lead}>
            Written after the fact, from each project&apos;s decision records, benchmark logs and README. Every note ends in
            the rule it produced.
          </p>
          <LabNotes />
          <h2 className={styles.h2}>Show me the engineering</h2>
          <ProofTable />
        </div>
      </div>
    </main>
  );
}
