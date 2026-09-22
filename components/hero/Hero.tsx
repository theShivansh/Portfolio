import Link from "next/link";
import { roughArrow } from "@/lib/sketch";
import { site } from "@/lib/site";
import { FieldModeSwitch } from "./FieldModeSwitch";
import { HeroSketch } from "./HeroSketch";
import styles from "./hero.module.css";

const strip = ["Perceive", "Reason", "Simulate", "Act"] as const;

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
          <p className={`meta field-only ${styles.extraMeta}`}>7 systems · 7 deployed · 2025 → 2026</p>
        </div>

        <div className={styles.switchSlot}>
          <FieldModeSwitch />
        </div>

        <div className={styles.copy}>
          <h1 id="hero-title" className={styles.name}>
            <span>Shivansh</span>
            <span>Shukla</span>
          </h1>
          <p className={styles.role}>AI engineer, full-stack systems builder</p>
          <p className={styles.statement}>
            I build AI systems that perceive, reason, simulate, and intervene.
          </p>
          <p className={styles.why}>
            Models are one component. I build the retrieval, validation, evaluation and interfaces that make them
            dependable, and ship them.
          </p>

          <ol className={styles.strip} aria-label="What the systems do">
            {strip.map((s, i) => (
              <li key={s}>
                <span>{s}</span>
                {i < strip.length - 1 ? (
                  <svg viewBox="0 0 34 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                    <path d={roughArrow(3, 7, 30, 7, 50 + i, 5)} />
                  </svg>
                ) : null}
              </li>
            ))}
          </ol>

          <div className={styles.actions}>
            <Link href="/#work" className="btn btn-solid">
              Read the case files
            </Link>
            <a href={site.github} className="btn" data-track="github" rel="noopener" target="_blank">
              GitHub
            </a>
          </div>
        </div>

        <div className={styles.figure}>
          <HeroSketch />
        </div>

        <a href="#systems" className={styles.scrollCue}>
          Scroll to inspect <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
