import Link from "next/link";
import { Annotation } from "@/components/motion/primitives";
import styles from "./subpage.module.css";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <div className="page sheet">
        <div className="margin">
          <p className="meta">404</p>
        </div>
        <div className="body">
          <h1 className={styles.title}>This page isn&apos;t in the notebook.</h1>
          <p className={styles.lead}>The link may be old, or the page was never written. The work is all on the first page.</p>
          <Annotation arrow="down" seed={21}>
            start here
          </Annotation>
          <div className={styles.actions}>
            <Link href="/" className="btn btn-solid">
              Go to the first page
            </Link>
            <Link href="/#work" className="btn">
              Selected work
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
