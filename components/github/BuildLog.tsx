import { getBuildLog } from "@/lib/github";
import { site } from "@/lib/site";
import { SectionMarker } from "../motion/primitives";
import styles from "./github.module.css";

const date = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export async function BuildLog() {
  const rows = await getBuildLog();
  return (
    <section id="build-log" data-chapter="about" className="section" aria-labelledby="build-log-title">
      <div className="page sheet">
        <SectionMarker n="05b" label="Archive" />
        <div className="body">
          <div className={styles.head}>
            <h2 id="build-log-title" className="h-section">
              Open source / build log
            </h2>
            <a href={site.github} className="btn" target="_blank" rel="noopener" data-track="github">
              github.com/theShivansh ↗
            </a>
          </div>

          <div className={styles.scroller}>
            <table className={styles.table}>
              <caption className="visually-hidden">Repositories, with description, stack, status and last push</caption>
              <thead>
                <tr>
                  <th scope="col">Repository</th>
                  <th scope="col">Description</th>
                  <th scope="col">Stack</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="visually-hidden">Link</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug}>
                    <th scope="row" className={styles.repo}>
                      {r.name}
                      {r.pushedAt ? (
                        <span className={styles.pushed}>
                          pushed <time dateTime={r.pushedAt}>{date.format(new Date(r.pushedAt))}</time>
                        </span>
                      ) : null}
                    </th>
                    <td className={styles.desc}>{r.description}</td>
                    <td className={styles.stack}>{r.stack.join(" · ")}</td>
                    <td>
                      <span className={styles.status} data-status={r.status}>
                        {r.status}
                      </span>
                    </td>
                    <td className={styles.link}>
                      <a href={r.url} target="_blank" rel="noopener" data-track="github" data-project={r.slug} aria-label={`${r.name} on GitHub (opens in a new tab)`}>
                        GitHub ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
