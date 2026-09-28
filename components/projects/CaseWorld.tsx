import type { Project } from "@/lib/types";
import { worldFor } from "@/lib/worlds";
import { CaseFile } from "./CaseFile";
import styles from "./world.module.css";

/**
 * A case file, set in its own world.
 *
 * The section paints the world edge to edge; everything inside is built
 * from the same tokens as the rest of the site, so it moves into the world
 * without any component knowing it has. The case's anchor stays on the
 * <article> inside, so /#crown-x still lands where it always did.
 */
export function CaseWorld({ project }: { project: Project }) {
  const world = worldFor(project.slug);
  return (
    <section
      data-chapter="work"
      data-world={world.id}
      data-world-dark={world.dark ? "" : undefined}
      className={`section ${styles.world}`}
      aria-label={`${project.title}: case file`}
    >
      <div className="page sheet">
        <div className={`margin ${styles.marker}`}>
          <p className={styles.n} aria-hidden="true">
            {project.number}
          </p>
          <p className="meta">{world.name}</p>
          <p className={`hand field-only ${styles.note}`}>{world.line}</p>
        </div>
        <div className="body">
          <CaseFile project={project} />
        </div>
      </div>
    </section>
  );
}
