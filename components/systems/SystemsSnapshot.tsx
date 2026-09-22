import Link from "next/link";
import { builtWith, capabilities } from "@/lib/content";
import { getProject } from "@/lib/projects";
import { SectionMarker } from "../motion/primitives";
import styles from "./systems.module.css";

export function SystemsSnapshot() {
  return (
    <section id="systems" data-chapter="systems" className="section" aria-labelledby="systems-title">
      <div className="page sheet">
        <SectionMarker n="01" label="Systems" note="the short version" />
        <div className="body">
          <h2 id="systems-title" className="h-section">
            What I actually build
          </h2>
          <p className={`lead ${styles.intro}`}>
            Three kinds of systems. Each one has a model inside it; none of them is just a model.
          </p>

          <ol className={styles.blocks}>
            {capabilities.map((c) => (
              <li key={c.n} className={`reveal ${styles.block}`}>
                <p className={styles.n}>{c.n}</p>
                <h3 className={styles.title}>{c.title}</h3>
                <p className={styles.line}>{c.line}</p>
                <ul className={styles.items}>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                <p className={styles.seen}>
                  <span className="meta">Seen in</span>{" "}
                  {c.projects.map((slug, i) => {
                    const p = getProject(slug);
                    if (!p) return null;
                    return (
                      <span key={slug}>
                        {i > 0 ? ", " : ""}
                        <Link href={`/work/${slug}`} className="link">
                          {p.title}
                        </Link>
                      </span>
                    );
                  })}
                </p>
              </li>
            ))}
          </ol>

          <div className={styles.built}>
            <p className="meta">Built with</p>
            <p className={styles.stack}>{builtWith.join("  /  ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
