import Image from "next/image";
import type { Project } from "@/lib/types";
import { ArchitectureDiagram } from "../diagrams/ArchitectureDiagram";
import { CaseHeader } from "./CaseHeader";
import { EvidencePanel } from "./EvidencePanel";
import { interactions } from "./interactions";
import styles from "./case.module.css";

type Props = {
  project: Project;
  /** "home": compact case in the Work chapter. "page": the full case study. */
  variant?: "home" | "page";
};

/**
 * The case-file structure every project follows:
 * number → problem → system → key decision → interaction → evidence → links.
 */
export function CaseFile({ project: p, variant = "home" }: Props) {
  const page = variant === "page";
  const interaction = interactions[p.slug];
  const evidence = page ? p.evidence : p.evidence.slice(0, 4);
  const Sub = page ? "h2" : "h4";

  return (
    <article className={page ? undefined : styles.caseFile} aria-labelledby={`case-${p.slug}`} id={page ? undefined : p.slug}>
      {page ? null : <CaseHeader project={p} as="h3" size={p.tier === "primary" ? "large" : "medium"} />}

      <div className={styles.twoCol}>
        <section className={styles.block}>
          <p className="meta">Problem</p>
          <p className={styles.blockBody}>{p.problem}</p>
        </section>
        <section className={styles.block}>
          <p className="meta">Key engineering decision</p>
          <Sub className={styles.blockTitle}>{p.decision.title}</Sub>
          <p className={styles.blockBody}>{p.decision.body}</p>
        </section>
      </div>

      {page || p.tier === "primary" ? (
        <section aria-label={`${p.title} system`}>
          <p className={`meta ${styles.subhead}`}>System</p>
          <ArchitectureDiagram nodes={p.architecture} label={`${p.title} pipeline`} />
        </section>
      ) : null}

      {interaction ? (
        <section aria-label={interaction.title}>
          <div className={styles.subhead}>
            <p className="meta">Interaction</p>
            <Sub className={styles.blockTitle}>{interaction.title}</Sub>
            <p className={styles.blockBody}>{interaction.intro}</p>
          </div>
          {interaction.node(page ? "page" : "home")}
        </section>
      ) : null}

      {page && p.failure.length ? (
        <section aria-label="Failure handling">
          <p className={`meta ${styles.subhead}`}>Failure handling</p>
          <ol className={styles.failure}>
            {p.failure.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </section>
      ) : null}

      <EvidencePanel items={evidence} title={page ? "Result / evidence" : "Evidence"} repo={p.repository} />

      {page
        ? p.images.map((img) => (
            <figure key={img.src} className={styles.shot}>
              <div className={styles.shotFrame}>
                <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 1320px) 1100px, 92vw" />
              </div>
              <figcaption className={styles.shotCaption}>
                <span>{img.caption}</span>
                <span>{img.origin}</span>
              </figcaption>
            </figure>
          ))
        : null}

      {p.caveat ? (
        <p className={styles.caveat}>
          <strong>Scope</strong>
          <span>{p.caveat}</span>
        </p>
      ) : null}

      {page ? (
        <section aria-label="Stack">
          <p className={`meta ${styles.subhead}`}>Stack</p>
          <ul className={styles.stack}>
            {p.stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
