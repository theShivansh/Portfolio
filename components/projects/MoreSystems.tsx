import Image from "next/image";
import { archiveProjects, secondaryProjects } from "@/lib/projects";
import { ViewTransitionLink } from "../motion/ViewTransitionLink";
import { CaseWorld } from "./CaseWorld";
import styles from "./work.module.css";

/**
 * The rest of the universe: the three secondary systems, each in its own
 * world, and the archive where the work started.
 *
 * The flagships live in the deck at the top of the page. These change
 * surface on a hard cut instead of a threshold: they are shorter, and a
 * threshold for every one of them would be thresholds in a row.
 */
export function MoreSystems() {
  const archive = archiveProjects[0];

  return (
    <>
      <section id="more" data-chapter="map" data-world="paper" className={`section ${styles.band}`} aria-labelledby="more-title">
        <div className="page sheet">
          <div className="margin" />
          <div className="body">
            <h2 id="more-title" className={styles.groupTitle}>
              More systems
            </h2>
            <p className={styles.groupNote}>Simulation and intervention: smaller systems, same habits.</p>
          </div>
        </div>
      </section>

      {secondaryProjects.map((p) => (
        <CaseWorld key={p.slug} project={p} chapter="map" />
      ))}

      {archive ? (
        <section
          data-chapter="map"
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
                      <a href={archive.liveDemo} className="link" target="_blank" rel="noopener" data-track="live_demo_click" data-project={archive.slug}>
                        Live site ↗
                      </a>
                      <a href={archive.repository} className="link" target="_blank" rel="noopener" data-track="github_click" data-project={archive.slug}>
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
