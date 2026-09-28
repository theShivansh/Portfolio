import Link from "next/link";
import { site } from "@/lib/site";
import { FieldModeSwitch } from "./FieldModeSwitch";
import { HeroSketch } from "./HeroSketch";
import { Pipeline } from "./Pipeline";
import styles from "./hero.module.css";

/**
 * Every number here is copied from a record elsewhere on the site, so the
 * opening line can be checked before the reader has scrolled anywhere.
 */
const stats = [
  { value: "7", label: "systems, all deployed" },
  { value: "709", label: "backend tests, StyleLab" },
  { value: "0.95", label: "retrieval recall, deployed" },
  { value: "10K+", label: "queries a day, in production" },
  { value: "Top 1%", label: "Amazon ML Challenge 2026" },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title" data-chapter="intro">
      <div className={`page ${styles.grid}`}>
        <div className={styles.metaBlock}>
          <p className="meta">Field note / 01</p>
          <p className="meta">AI systems</p>
          <p className="meta">{site.name}</p>
          <p className={`meta ${styles.status}`}>
            <span className="live-dot" aria-hidden="true" /> Available / building
          </p>
          <p className={`meta field-only ${styles.extraMeta}`}>2 roles · 7 systems · 7 deployed · 2025 → 2026</p>
        </div>

        <div className={styles.switchSlot}>
          <FieldModeSwitch />
        </div>

        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.eyebrow}>
              {site.name} <span aria-hidden="true">/</span> 2026
            </span>
            <span className={styles.claim}>
              <span>I build systems</span>
              <span>that don&apos;t trust</span>
              <span>the model.</span>
            </span>
          </h1>

          <p className={styles.role}>AI engineering · System design · Evaluation</p>

          <p className={styles.why}>
            A model is one component. The retrieval, the validation, the simulation and the interface decide whether its
            output is worth anything — and I ship all of it.
          </p>

          <Pipeline />

          <div className={styles.actions}>
            <Link href="/#map" className="btn btn-solid">
              Enter the system
            </Link>
            <a href={site.github} className="btn" data-track="github" rel="noopener" target="_blank">
              GitHub
            </a>
          </div>

          <dl className={styles.stats} aria-label="The short version">
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statValue}>{s.value}</dt>
                <dd className={styles.statLabel}>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.figure}>
          <HeroSketch />
        </div>

        <a href="#map" className={styles.scrollCue}>
          Scroll to inspect <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
