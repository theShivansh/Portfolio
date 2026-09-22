import { roughArrow, roughRect, roughEllipse } from "@/lib/sketch";
import styles from "./hero.module.css";

/**
 * The signature motif. At rest in the page's first moment it reads as a
 * pencil sketch, INPUT → MODEL → OUTPUT. As the hero scrolls away, MODEL
 * opens into the system around it. The sketch stays underneath.
 *
 * Resting CSS is the final (system) state; animations only supply the
 * sketch-state "from" values. See hero.module.css.
 */

type Box = { x: number; y: number; w: number; h: number };

const input: Box = { x: 150, y: 24, w: 140, h: 50 };
const model: Box = { x: 125, y: 208, w: 190, h: 72 };
const output: Box = { x: 150, y: 486, w: 140, h: 50 };

const nodes = [
  { id: "retrieval", label: "RETRIEVAL", x: 58, y: 142, w: 150, h: 40, group: 1 },
  { id: "memory", label: "MEMORY", x: 232, y: 142, w: 150, h: 40, group: 1 },
  { id: "agents", label: "AGENTS", x: 145, y: 232, w: 150, h: 44, group: 2 },
  { id: "tools", label: "TOOLS", x: 58, y: 326, w: 150, h: 40, group: 3 },
  { id: "validation", label: "VALIDATION", x: 232, y: 326, w: 150, h: 40, group: 3, gate: true },
] as const;

const cx = (b: { x: number; w: number }) => b.x + b.w / 2;

export function HeroSketch() {
  return (
    <svg
      viewBox="0 0 440 560"
      className={styles.sketch}
      role="img"
      aria-labelledby="hero-sketch-title hero-sketch-desc"
    >
      <title id="hero-sketch-title">From sketch to system</title>
      <desc id="hero-sketch-desc">
        A pencil sketch of input, model and output. The model box opens into a system: retrieval and memory feed
        agents, agents use tools, and validation gates what reaches the output.
      </desc>

      {/* Sketch layer: graphite, imperfect, always present. */}
      <g className={styles.sketchLayer} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d={roughRect(input.x, input.y, input.w, input.h, 3)} />
        <path d={roughRect(output.x, output.y, output.w, output.h, 9)} />
        <path className={styles.sketchModel} d={roughRect(model.x, model.y, model.w, model.h, 17)} />
        <path className={styles.sketchArrow} d={roughArrow(220, 82, 221, 198, 21)} />
        <path className={styles.sketchArrow} d={roughArrow(221, 290, 220, 476, 29)} />
      </g>
      <g className={styles.sketchLabels}>
        <text x={cx(input)} y={input.y + 33} textAnchor="middle">input</text>
        <text x={cx(output)} y={output.y + 33} textAnchor="middle">output</text>
        <text className={styles.sketchModel} x={cx(model)} y={model.y + 45} textAnchor="middle">
          model
        </text>
      </g>

      {/* System layer: precise geometry. */}
      <g className={styles.system}>
        <rect className={styles.frame} x="36" y="118" width="368" height="272" rx="2" />
        <text className={styles.frameLabel} x="44" y="112">
          SYSTEM AROUND THE MODEL
        </text>

        <g className={styles.edges} fill="none" stroke="currentColor" strokeWidth="1">
          <path pathLength={1} d="M220 74 V100 H133 V142" />
          <path pathLength={1} d="M220 100 H307 V142" />
          <path pathLength={1} d="M133 182 V206 H200 V232" />
          <path pathLength={1} d="M307 182 V206 H240 V232" />
          <path pathLength={1} d="M200 276 V300 H133 V326" />
          <path pathLength={1} d="M240 276 V300 H307 V326" />
          <path pathLength={1} d="M208 346 H232" />
          <path pathLength={1} d="M307 366 V440 H220 V486" />
        </g>

        {nodes.map((n) => (
          <g key={n.id} className={styles.node} data-group={n.group}>
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              rx="2"
              className={"gate" in n ? styles.gate : styles.nodeBox}
            />
            <text x={n.x + 12} y={n.y + n.h / 2 + 4}>
              {n.label}
            </text>
          </g>
        ))}
        <rect className={styles.ioBox} x={input.x + 2} y={input.y + 2} width={input.w - 4} height={input.h - 4} rx="2" />
        <rect className={styles.ioBox} x={output.x + 2} y={output.y + 2} width={output.w - 4} height={output.h - 4} rx="2" />
      </g>

      {/* Field-mode annotations. */}
      <g className={`field-only ${styles.notes}`}>
        <path d={roughEllipse(307, 346, 92, 30, 41)} fill="none" stroke="currentColor" strokeWidth="1.4" />
        <text x="40" y="420" className={styles.note}>
          what is the model
        </text>
        <text x="40" y="442" className={styles.note}>
          allowed to decide?
        </text>
      </g>
    </svg>
  );
}
