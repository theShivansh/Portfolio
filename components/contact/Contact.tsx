import { site } from "@/lib/site";
import { SectionMarker } from "../motion/primitives";
import styles from "./contact.module.css";

export function Contact() {
  return (
    <section id="contact" data-chapter="contact" className="section" aria-labelledby="contact-title">
      <div className="page sheet">
        <SectionMarker n="06" label="Contact" />
        <div className="body">
          <h2 id="contact-title" className={styles.title}>
            Let&apos;s build something useful.
          </h2>
          <p className={styles.sub}>Open to AI engineering, software engineering, research, and product-building opportunities.</p>
          <div className={styles.actions}>
            <a href={`mailto:${site.email}?subject=Hello%20Shivansh`} className="btn btn-solid" data-track="contact">
              Start a conversation
            </a>
            <a href={site.github} className="btn" target="_blank" rel="noopener" data-track="github">
              View GitHub ↗
            </a>
            {site.resume ? (
              <a href={site.resume} className="btn" download data-track="resume">
                Download resume
              </a>
            ) : null}
          </div>
          <p className={styles.email}>
            Or write directly:{" "}
            <a href={`mailto:${site.email}`} className="link" data-track="contact">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
