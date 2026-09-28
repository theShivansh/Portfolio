import Image from "next/image";
import { Fragment } from "react";
import { archiveProjects, primaryProjects, secondaryProjects } from "@/lib/projects";
import { projectWorld } from "@/lib/worlds";
import { SectionMarker } from "../motion/primitives";
import { ViewTransitionLink } from "../motion/ViewTransitionLink";
import { WorldGate } from "../motion/WorldGate";
import { CaseWorld } from "./CaseWorld";
import styles from "./work.module.css";

/**
 * The work chapter is not one section any more: it is an index, then one
 * world per case file.
 *
 * The three primary cases each get a threshold before them, because each
 * one is a different kind of place. The three secondary cases change
 * surface on a hard cut instead — they are shorter, and a threshold for
 * every one of them would be six thresholds in a row.
 */
export function WorkSection() {
  const archive = archiveProjects[0];

  return (
    <>
      <section id="work" data-chapter="work" data-world="paper" className="section" aria-labelledby="work-title">
        <div className="page sheet">
          <SectionMarker n="03" label="Work" note="three primary, three secondary, one archive" />
          <div className="body">
            <h2 id="work-title" className="h-section">
              Selected work
            </h2>
            <p className={`lead ${styles.intro}`}>
              Three case files, three answers to one question: what should the model not be allowed to decide? Each one
              is set somewhere different, because each one is a different kind of problem.
            </p>

            <ol className={styles.index} aria-label="Primary case files">
              {primaryProjects.map((p) => (
                <li key={p.slug}>
                  <a href={`#${p.slug}`} className={styles.indexLink}>
                    <span className={styles.indexN}>{p.number}</span>
                    <span className={styles.indexTitle}>{p.title}</span>
                    <span className={styles.indexCat}>{p.category}</span>
                    <span className={styles.indexThesis}>{p.thesis}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {primaryProjects.map((p, i) => {
        const before = primaryProjects[i - 1];
        return (
          <Fragment key={p.slug}>
            <WorldGate
              from={before ? (projectWorld[before.slug] ?? "paper") : "paper"}
              to={projectWorld[p.slug] ?? "paper"}
              eyebrow={`Case file ${p.number}`}
              chapter="work"
            />
            <CaseWorld project={p} />
          </Fragment>
        );
      })}

      <section data-chapter="work" data-world="paper" className={`section ${styles.band}`} aria-labelledby="secondary-title">
        <div className="page sheet">
          <div className="margin" />
          <div className="body">
            <h3 id="secondary-title" className={styles.groupTitle}>
              Secondary systems
            </h3>
            <p className={styles.groupNote}>Simulation and intervention: smaller systems, same habits.</p>
          </div>
        </div>
      </section>

      {secondaryProjects.map((p) => (
        <CaseWorld key={p.slug} project={p} />
      ))}

      {archive ? (
        <section
          data-chapter="work"
          data-world="archive"
          className={`section ${styles.archiveWorld}`}
          aria-labelledby="case-aixplorer"
        >
          <div className="page sheet">
            <div className="margin" />
            <div className="body">
              <div className={styles.archive} id="archive">
                <p className="meta">Archive / earlier systems</p>
                <article className={styles.card}>
                  <div className={styles.cardText}>
                    <p className={styles.cardN}>
                      {archive.number} / {archive.started}
                    </p>
                    <h3 id="case-aixplorer" className={styles.cardTitle}>
                      {archive.title}
                    </h3>
                    <ul className={styles.cardIndex}>
                      <li>AI tools</li>
                      <li>Glossary</li>
                      <li>Prompt lab</li>
                    </ul>
                    <p className={styles.cardArc}>
                      From curating AI <span aria-hidden="true">→</span>
                      <span className="visually-hidden">to</span> building AI systems.
                    </p>
                    <p className={styles.cardLinks}>
                      <ViewTransitionLink href={`/work/${archive.slug}`} className="link" data-track="project_open" data-project={archive.slug}>
                        Open case
                      </ViewTransitionLink>
                      <a href={archive.liveDemo} className="link" target="_blank" rel="noopener" data-track="live_demo" data-project={archive.slug}>
                        Live site ↗
                      </a>
                      <a href={archive.repository} className="link" target="_blank" rel="noopener" data-track="github" data-project={archive.slug}>
                        Repository ↗
                      </a>
                    </p>
                  </div>
                  <div className={styles.cardShot}>
                    <Image
                      src={archive.images[0]!.src}
                      alt={archive.images[0]!.alt}
                      width={archive.images[0]!.width}
                      height={archive.images[0]!.height}
                      sizes="(min-width: 1024px) 420px, 90vw"
                    />
                  </div>
                </article>
              </div>
              <div id="after-work" tabIndex={-1} />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
