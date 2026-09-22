import Link from "next/link";
import { labNotes } from "@/lib/content";
import styles from "./notes.module.css";

/** Lab notes: what went wrong, what was measured, what the rule became. */
export function LabNotes({ limit }: { limit?: number }) {
  const notes = limit ? labNotes.slice(0, limit) : labNotes;
  return (
    <ol className={styles.notes}>
      {notes.map((n, i) => (
        <li key={n.id} id={`note-${n.id}`} className={`reveal ${styles.note}`}>
          <p className={styles.meta}>
            <span>N.{String(i + 1).padStart(2, "0")}</span>
            <span>{n.date}</span>
            <Link href={`/work/${n.projectSlug}`} className="link">
              {n.project}
            </Link>
          </p>
          <h3 className={styles.title}>{n.title}</h3>
          <p className={styles.body}>{n.body}</p>
          <p className={styles.outcome}>
            <span className="visually-hidden">Outcome: </span>
            {n.outcome}
          </p>
        </li>
      ))}
    </ol>
  );
}
