import { roughLine } from "@/lib/sketch";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { SectionMarker } from "../motion/primitives";
import styles from "./contact.module.css";

/**
 * Every system on the map, drawn as one line, arriving at the same point.
 * One line per project, so the figure changes if the work does.
 */
function Converge() {
  const W = 640;
  const H = 150;
  const end = { x: W / 2, y: H - 6 };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.converge} aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      {projects.map((p, i) => {
        const t = projects.length === 1 ? 0.5 : i / (projects.length - 1);
        const x = 18 + t * (W - 36);
        const y = 10 + Math.abs(t - 0.5) * 34;
        return (
          <path
            key={p.slug}
            d={roughLine(x, y, end.x, end.y, i * 9 + 5, 2.2)}
            pathLength={1}
            strokeWidth="1"
            className="draw-on-view"
            style={{ "--len": 1 } as React.CSSProperties}
          />
        );
      })}
      <circle cx={end.x} cy={end.y} r="3.5" className={styles.convergePoint} />
    </svg>
  );
}

export function Contact() {
  return (
    <section id="contact" data-chapter="contact" className="section" aria-labelledby="contact-title">
      <div className="page sheet">
        <SectionMarker n="11" label="Next" />
        <div className="body">
          <div className={styles.close}>
            <p className={styles.closeName}>{site.name}</p>
            <p className={styles.closeRoles}>
              <span>AI engineer</span>
              <span>System builder</span>
              <span>Learning in public</span>
            </p>
          </div>

          <Converge />

          <h2 id="contact-title" className={styles.title}>
            The next system
            <br />
            isn&apos;t built yet.
          </h2>
          <p className={styles.sub}>
            Open to AI engineering, software engineering, research and product-building work. If you have a problem
            where the model is the easy part, that is the one I want.
          </p>

          <div className={styles.actions}>
            <a href={`mailto:${site.email}?subject=Let%27s%20build%20something`} className="btn btn-solid" data-track="contact_click">
              Build something
            </a>
            <a href={site.github} className="btn" target="_blank" rel="noopener" data-track="github_click">
              GitHub ↗
            </a>
            <a href={site.youtube} className="btn" target="_blank" rel="noopener" data-track="youtube">
              TECHOLaugh ↗
            </a>
            {site.resume ? (
              <a href={site.resume} className="btn" download data-track="resume_click">
                Resume
              </a>
            ) : null}
          </div>

          <p className={styles.email}>
            Or write directly:{" "}
            <a href={`mailto:${site.email}`} className="link" data-track="contact_click">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
