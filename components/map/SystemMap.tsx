import Link from "next/link";
import { builtWith, labNotes, principles, proofRows } from "@/lib/content";
import { roles } from "@/lib/experience";
import { systemKinds } from "@/lib/systems";
import { getProject, projects } from "@/lib/projects";
import { achievements, boundaries, experiments, flightRecords, mapEdges } from "@/lib/universe";
import { SectionMarker } from "../motion/primitives";
import { MapStage } from "./MapStage";
import styles from "./map.module.css";

/** The index of depth. Each row is a real count of records on this site. */
const ledger = [
  { n: systemKinds.length, label: "kinds of system", href: "/#systems" },
  { n: projects.length, label: "systems", href: "/#work" },
  { n: boundaries.length, label: "boundaries", href: "/#boundaries" },
  { n: principles.length, label: "principles", href: "/#architecture" },
  { n: proofRows.length, label: "practices", href: "/#evidence" },
  { n: flightRecords.length, label: "failures", href: "/#failures" },
  { n: experiments.length, label: "experiments", href: "/#notes" },
  { n: labNotes.length, label: "lab notes", href: "/notes" },
  { n: roles.length, label: "roles", href: "/#experience" },
  { n: achievements.length, label: "results", href: "/#results" },
];

export function SystemMap() {
  return (
    <section id="map" data-chapter="map" className="section" aria-labelledby="map-title">
      <div className="page sheet">
        <SectionMarker n="02" label="The map" note="the lines are the shared engineering" />
        <div className="body">
          <h2 id="map-title" className="h-section">
            Seven systems, and what runs between them
          </h2>
          <p className={`lead ${styles.intro}`}>
            Each one is placed by the artifact it handles, not by how impressive it looks. The lines are not decoration:
            they mark where the same engineering shows up twice. Point at a system to keep only its connections.
          </p>

          <MapStage />

          <div className={styles.wiresKey}>
            <h3 className="meta">What the lines say</h3>
            <ul className={styles.keyList}>
              {mapEdges.map((e) => {
                const a = getProject(e.a);
                const b = getProject(e.b);
                if (!a || !b) return null;
                return (
                  <li key={`${e.a}-${e.b}`} data-kind={e.kind}>
                    <span className={styles.keyPair}>
                      <Link href={`/work/${e.a}`} className="link">
                        {a.title}
                      </Link>
                      <span className={styles.keyJoin} aria-hidden="true">
                        {e.kind === "lineage" ? "⤳" : "—"}
                      </span>
                      <Link href={`/work/${e.b}`} className="link">
                        {b.title}
                      </Link>
                    </span>
                    <span className={styles.keyLabel}>{e.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.ledger}>
            <h3 className="meta">What is in here</h3>
            <dl className={styles.ledgerList}>
              {ledger.map((l) => (
                <div key={l.label} className={styles.ledgerItem}>
                  <dt className={styles.ledgerN}>{l.n}</dt>
                  <dd>
                    <Link href={l.href} className="link">
                      {l.label}
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
            <p className={styles.built}>
              <span className="meta">Built with</span> {builtWith.join("  /  ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
