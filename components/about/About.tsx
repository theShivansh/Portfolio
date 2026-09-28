import { drawFrames, roughUnderline } from "@/lib/sketch";
import { site } from "@/lib/site";
import { SectionMarker } from "../motion/primitives";
import { StopMotion } from "../motion/StopMotion";
import { Timeline } from "./Timeline";
import styles from "./about.module.css";

const columns = [
  { head: "Build", items: ["AI systems", "Agent orchestration", "Reasoning pipelines", "Full-stack products"] },
  { head: "Care about", items: ["Evidence", "Reliability", "Human control", "Useful automation"] },
];

/** Three beats, each one arriving only after the one before it. */
const creed = [
  ["I like AI.", "I am suspicious of AI.", "So I build systems around it."],
  ["Models are probabilistic.", "Databases are not. Rules are not. Tests are not.", "A good system knows the difference."],
  ["I do not want to build another chatbot.", "I want to build machines that are still useful", "after the demo ends."],
];

export function About({ as: H = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <section id="about" data-chapter="about" className="section" aria-labelledby="about-title">
      <div className="page sheet">
        <SectionMarker n="10" label="Why" note="the part that is not a spec" />
        <div className="body">
          <H id="about-title" className="h-section">
            Why I build this way
          </H>

          <div className={styles.creed}>
            {creed.map((block, bi) => (
              <div key={block[0]} className={`reveal ${styles.beat}`}>
                {block.map((line, li) => (
                  <p key={line} className={styles.beatLine} data-last={bi === creed.length - 1 && li === block.length - 1 || undefined}>
                    {line}
                    {bi === creed.length - 1 && li === block.length - 1 ? (
                      <StopMotion
                        frames={drawFrames((p) => roughUnderline(4, 10, 300, 9, p), 7)}
                        viewBox="0 0 308 18"
                        trigger="view"
                        className={styles.underline}
                      />
                    ) : null}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            <div className={styles.who}>
              <p className={styles.name}>Shivansh Shukla</p>
              <ul className={styles.roles}>
                <li>AI Engineer</li>
                <li>Full-Stack Builder</li>
                <li>Systems Thinker</li>
              </ul>
            </div>
            {columns.map((c) => (
              <div key={c.head} className={styles.col}>
                <p className="meta">{c.head}</p>
                <ul>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className={styles.bio}>
            I work end to end: Python services and evaluation harnesses, TypeScript interfaces, and the cloud
            underneath. That range comes from two roles, agent and retrieval work at Technology Mindz and AWS
            infrastructure at GRRAS Solutions, and from the systems on this page. Most of what I build is about the
            space around a model: what it can see, what it is allowed to decide, how its output is checked, and how a
            person corrects it.
          </p>

          <aside className={styles.channel} aria-labelledby="channel-title">
            <p className="meta">The other half</p>
            <p id="channel-title" className={styles.channelTitle}>
              Engineer by day. Explaining it out loud by curiosity.
            </p>
            <p className={styles.channelBody}>
              I make AI videos as <span className={styles.channelHandle}>{site.youtubeHandle}</span>. It is the same
              instinct as the lab notes: if I cannot explain why a system is built this way, I probably do not
              understand it yet.
            </p>
            <p>
              <a href={site.youtube} className="btn" target="_blank" rel="noopener" data-track="youtube">
                Watch on YouTube ↗
              </a>
            </p>
          </aside>

          <Timeline />
        </div>
      </div>
    </section>
  );
}
