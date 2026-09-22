import { site } from "@/lib/site";
import { Preferences } from "../accessibility/Preferences";
import styles from "./contact.module.css";

export function Footer() {
  const links = [
    { label: "GitHub", href: site.github, track: "github" },
    { label: "Hugging Face", href: site.huggingface },
    site.linkedin ? { label: "LinkedIn", href: site.linkedin } : null,
    { label: "Email", href: `mailto:${site.email}`, track: "contact" },
    site.resume ? { label: "Resume", href: site.resume, track: "resume" } : null,
  ].filter((l): l is { label: string; href: string; track?: string } => l !== null);

  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.fgrid}`}>
        <div>
          <p className={styles.fname}>{site.name}</p>
          <p className={styles.fcode}>
            {site.codename}
            <br />
            2026 → 2027
          </p>
        </div>
        <ul className={styles.flinks} aria-label="Elsewhere">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="link"
                data-track={l.track}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.fnote}>More systems in progress.</p>
      </div>
      <div className={`page ${styles.fbottom}`}>
        <Preferences />
      </div>
    </footer>
  );
}
