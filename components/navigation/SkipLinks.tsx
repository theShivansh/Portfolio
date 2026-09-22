import Link from "next/link";
import { site } from "@/lib/site";
import styles from "./nav.module.css";

export function SkipLinks() {
  return (
    <nav aria-label="Skip links" className={styles.skip}>
      <a href="#main">Skip to content</a>
      <Link href="/#after-work">Skip case studies</Link>
      {site.resume ? (
        <a href={site.resume} download data-track="resume">
          Download resume
        </a>
      ) : null}
    </nav>
  );
}
