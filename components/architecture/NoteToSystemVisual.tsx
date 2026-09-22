import { roughArrow, roughEllipse, roughRect } from "@/lib/sketch";
import styles from "./architecture.module.css";

/**
 * SKETCH → ANNOTATION → STRUCTURE → SYSTEM → LIVE INTERFACE.
 * Each layer opts into a step with data-at; the sketch recedes (but stays)
 * once the system is drawn over it: human reasoning under engineering.
 */
const nodes = [
  { id: "input", label: "INPUT" },
  { id: "retrieval", label: "RETRIEVAL" },
  { id: "agents", label: "MULTI-AGENT" },
  { id: "validation", label: "VALIDATION" },
  { id: "human", label: "HUMAN LOOP" },
  { id: "output", label: "OUTPUT" },
] as const;

const NX = (i: number) => 16 + i * 104;
const NY = 176;
const NW = 88;
const NH = 44;

const live: Record<string, string> = {
  retrieval: "8 passages",
  agents: "4 hops",
  validation: "pass",
  human: "corrected",
};

export function NoteToSystemVisual() {
  return (
    <svg viewBox="0 0 640 420" className={styles.stage} role="img" aria-labelledby="nts-title nts-desc">
      <title id="nts-title">From note to system</title>
      <desc id="nts-desc">
        A hand sketch of input, model and output becomes a system: input, retrieval, multi-agent orchestration,
        validation, a human correction loop and output, with stores for the index and canonical state, a retry path
        from validation, and live status on each stage.
      </desc>

      {/* 1 · Sketch */}
      <g className={styles.sketch} data-at="1" data-recede-at="4">
        <path d={roughRect(16, 170, 88, 56, 3)} />
        <path d={roughRect(150, 150, 330, 96, 11)} />
        <path d={roughRect(536, 170, 88, 56, 19)} />
        <path d={roughArrow(108, 198, 146, 198, 23)} />
        <path d={roughArrow(484, 198, 532, 198, 29)} />
        <text x="60" y="204" textAnchor="middle">input</text>
        <text x="315" y="240" textAnchor="middle">model</text>
        <text x="580" y="204" textAnchor="middle">output</text>
      </g>

      {/* 2 · Annotation */}
      <g className={styles.annot} data-at="2" data-recede-at="4">
        <path d={roughEllipse(315, 198, 190, 70, 31)} />
        <text x="190" y="96">one box, five decisions</text>
        <path d={roughArrow(300, 102, 312, 128, 37)} />
        <text x="500" y="266">who checks this?</text>
        <path d={roughArrow(566, 250, 576, 228, 41)} />
        <text x="16" y="262">where does the</text>
        <text x="16" y="282">truth live?</text>
      </g>

      {/* 3 · Structure */}
      <g className={styles.structure} data-at="3">
        {nodes.map((n, i) => (
          <g key={n.id}>
            <rect x={NX(i)} y={NY} width={NW} height={NH} rx="2" className={n.id === "validation" ? styles.gate : styles.box} />
            <text x={NX(i) + NW / 2} y={NY + NH / 2 + 3.5} textAnchor="middle">
              {n.label}
            </text>
          </g>
        ))}
      </g>

      {/* 4 · System: flow, stores, loops */}
      <g className={styles.system}>
        {nodes.slice(0, -1).map((n, i) => (
          <path key={n.id} data-at="4" data-draw="" pathLength={100} d={`M${NX(i) + NW} ${NY + NH / 2} H${NX(i + 1) - 2}`} className={styles.edge} />
        ))}
        {/* stores */}
        <path data-at="4" data-draw="" pathLength={100} d={`M${NX(1) + NW / 2} ${NY + NH} V300`} className={styles.edge} />
        <path data-at="4" data-draw="" pathLength={100} d={`M${NX(4) + NW / 2} ${NY + NH} V300`} className={styles.edge} />
        <g data-at="4">
          <rect x={NX(1) - 6} y="300" width={NW + 12} height="34" className={styles.store} />
          <text x={NX(1) + NW / 2} y="321" textAnchor="middle">index</text>
          <rect x={NX(4) - 6} y="300" width={NW + 12} height="34" className={styles.store} />
          <text x={NX(4) + NW / 2} y="321" textAnchor="middle">canonical state</text>
        </g>
        {/* retry: validation → agents */}
        <path
          data-at="4"
          d={`M${NX(3) + NW / 2} ${NY} V140 H${NX(2) + NW / 2} V${NY - 4}`}
          className={styles.loop}
        />
        <text data-at="4" x={(NX(2) + NX(3) + NW) / 2} y="132" textAnchor="middle" className={styles.edgeLabel}>
          reject → retry once
        </text>
        {/* correction feeds the next run */}
        <path data-at="4" d={`M${NX(4) + NW + 6} 317 H630 V360 H${NX(1) - 12} V317`} className={styles.loop} />
        <text data-at="4" x="330" y="376" textAnchor="middle" className={styles.edgeLabel}>
          corrections become grounding
        </text>
      </g>

      {/* 5 · Live interface */}
      <g data-at="5" className={styles.live}>
        {nodes.map((n, i) =>
          live[n.id] ? (
            <g key={n.id}>
              <rect x={NX(i) + 6} y={NY - 26} width={NW - 12} height="18" rx="9" className={n.id === "validation" ? styles.pillOn : styles.pill} />
              <text x={NX(i) + NW / 2} y={NY - 13.5} textAnchor="middle">
                {live[n.id]}
              </text>
            </g>
          ) : null,
        )}
        <rect x="16" y="392" width="608" height="26" rx="2" className={styles.console} />
        <text x="28" y="409" className={styles.consoleText}>
          schema ✓ · business ✓ · ownership ✓ · citations 3/3 · source = user_corrected
        </text>
      </g>
    </svg>
  );
}
