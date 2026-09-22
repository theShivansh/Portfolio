import type { ArchNode, NodeKind } from "@/lib/types";
import { roughEllipse } from "@/lib/sketch";
import styles from "./diagram.module.css";

const kindLabel: Record<NodeKind, string> = {
  io: "input / output",
  model: "model: proposes",
  code: "code: deterministic",
  human: "human",
  store: "data",
  gate: "validation gate",
};

type Props = {
  nodes: ArchNode[];
  /** Accessible name for the whole diagram. */
  label: string;
  /** "flow" wraps left-to-right; "stack" is a vertical pipeline. */
  layout?: "flow" | "stack";
  /** Show the legend of node kinds used. */
  legend?: boolean;
  /** Draw on as it scrolls into view (CSS view timeline). */
  reveal?: boolean;
  className?: string;
};

/**
 * A pipeline as an ordered list: screen readers get the sequence, sighted
 * readers get the diagram. Node kinds are encoded in the border language:
 * dashed = model (proposes), solid = code (decides), lime = gate, pencil
 * circle = human.
 */
export function ArchitectureDiagram({ nodes, label, layout = "flow", legend = true, reveal = true, className = "" }: Props) {
  const kinds = Array.from(new Set(nodes.map((n) => n.kind)));
  return (
    <figure className={`${styles.figure} ${className}`} data-layout={layout}>
      <ol className={styles.list} aria-label={label}>
        {nodes.map((n, i) => (
          <li key={n.id} className={`${styles.item} ${reveal ? "reveal" : ""}`}>
            <div className={styles.node} data-kind={n.kind}>
              {n.kind === "human" ? (
                <svg className={styles.circle} viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true">
                  <path d={roughEllipse(100, 40, 94, 34, 7 + i)} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              ) : null}
              <span className={styles.nodeLabel}>{n.label}</span>
              {n.detail ? <span className={styles.nodeDetail}>{n.detail}</span> : null}
              <span className="visually-hidden">({kindLabel[n.kind]})</span>
            </div>
            {i < nodes.length - 1 ? <span className={styles.arrow} aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
      {legend ? (
        <figcaption className={styles.legend}>
          {kinds.map((k) => (
            <span key={k} className={styles.legendItem}>
              <span className={styles.swatch} data-kind={k} aria-hidden="true" />
              {kindLabel[k]}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
