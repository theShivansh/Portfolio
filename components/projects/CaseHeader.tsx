import { ViewTransition } from "react";
import type { Project } from "@/lib/types";
import { ViewTransitionLink } from "../motion/ViewTransitionLink";
import styles from "./case.module.css";

type Props = {
  project: Project;
  /** Heading level: h3 inside the home page's Work chapter, h1 on a case page. */
  as?: "h1" | "h2" | "h3";
  /** Show the [Open case] link (home page) or not (case page). */
  openLink?: boolean;
  size?: "large" | "medium";
};

/**
 * Case-file header. The title and number carry view-transition names, so
 * opening a case morphs this header into the case page's header.
 */
export function CaseHeader({ project: p, as: H = "h3", openLink = true, size = "large" }: Props) {
  return (
    <header className={styles.header} data-size={size}>
      <ViewTransition name={`case-label-${p.slug}`} share="morph" default="none">
        <p className={styles.label}>
          <span>{p.number}</span> / {p.category}
        </p>
      </ViewTransition>
      <ViewTransition name={`case-title-${p.slug}`} share="morph" default="none">
        <H className={styles.title} id={`case-${p.slug}`}>
          {p.title}
        </H>
      </ViewTransition>
      <p className={styles.subtitle}>{p.subtitle}</p>
      <p className={styles.thesis}>{p.thesis}</p>
      <CaseLinks project={p} openLink={openLink} />
    </header>
  );
}

export function CaseLinks({ project: p, openLink = true }: { project: Project; openLink?: boolean }) {
  return (
    <ul className={styles.links} aria-label={`${p.title} links`}>
      {openLink ? (
        <li>
          <ViewTransitionLink
            href={`/work/${p.slug}`}
            className="btn btn-solid"
            data-track="project_open"
            data-project={p.slug}
            aria-label={`Open case: ${p.title}`}
          >
            [ Open case ]
          </ViewTransitionLink>
        </li>
      ) : null}
      {p.liveDemo ? (
        <li>
          <a href={p.liveDemo} className="btn" target="_blank" rel="noopener" data-track="live_demo" data-project={p.slug}>
            Live demo <span aria-hidden="true">↗</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      ) : null}
      <li>
        <a href={p.repository} className="btn" target="_blank" rel="noopener" data-track="github" data-project={p.slug}>
          Repository <span aria-hidden="true">↗</span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}
