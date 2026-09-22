import Link from "next/link";
import { chapters, site } from "@/lib/site";
import { ChapterNav } from "./ChapterNav";
import { Preferences } from "../accessibility/Preferences";
import styles from "./nav.module.css";

export function SiteNav() {
  return (
    <header className={styles.header}>
      <div className={`page ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          {site.name}
        </Link>
        <ChapterNav chapters={chapters} />
        <div className={styles.right}>
          <p className={styles.status}>
            <span className="live-dot" aria-hidden="true" />
            <span>Available / Building</span>
          </p>
          <Preferences />
        </div>
      </div>
      <div className={styles.progress} aria-hidden="true" />
    </header>
  );
}
