import { proofRows } from "@/lib/content";
import { SectionMarker } from "../motion/primitives";
import { ProofTable } from "./ProofTable";
import styles from "./evidence.module.css";

export function EvidenceSection({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="evidence" data-chapter="evidence" className="section" aria-labelledby="evidence-title">
      <div className="page sheet">
        <SectionMarker n="06" label="Proof" note="open a row, it argues with itself" />
        <div className="body">
          <H id="evidence-title" className="h-section">
            How I test it
          </H>
          <p className={`lead ${styles.sectionLead}`}>
            {proofRows.length} practices, why each one exists, and where to check it. None of them is a claim about a
            model: they are all claims about the code around it.
          </p>
          <ProofTable />
        </div>
      </div>
    </section>
  );
}
