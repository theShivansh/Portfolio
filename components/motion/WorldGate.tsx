import { roughEllipse, roughLine, roughRect } from "@/lib/sketch";
import { worldSignature, worlds, type Signature, type WorldId } from "@/lib/worlds";
import styles from "./worldgate.module.css";

/**
 * A threshold between two worlds.
 *
 * The panel pins for about half a screen while the outgoing surface
 * dissolves, the incoming one assembles, a light crosses it, and the name
 * of the place you are walking into settles. It is a sticky element on a
 * taller container, so the wheel is never taken away: stop scrolling and
 * it stops.
 *
 * Without scroll timelines, without JS, or under reduced motion it
 * collapses to a short titled divider showing the world you are entering.
 */

function Figure({ kind }: { kind: Signature }) {
  const common = {
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeLinecap: "round" as const,
  };
  if (kind === "sweep") {
    // A studio sweep: the curve where the backdrop leaves the floor.
    return (
      <svg viewBox="0 0 240 120" className={styles.figure} aria-hidden="true" {...common} strokeWidth="1.2">
        <path d="M8 12 C8 76 60 104 232 104" />
        <path d="M8 30 C8 84 70 110 232 110" opacity="0.5" />
        <path d={roughLine(150, 6, 96, 96, 21, 1.1)} opacity="0.45" />
        <path d={roughLine(186, 6, 132, 96, 33, 1.1)} opacity="0.45" />
      </svg>
    );
  }
  if (kind === "slots") {
    // Filing slots, one pulled.
    return (
      <svg viewBox="0 0 240 120" className={styles.figure} aria-hidden="true" {...common} strokeWidth="1.2">
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <path key={`${r}-${c}`} d={roughRect(10 + c * 46, 8 + r * 28, 38, 20, r * 7 + c * 3 + 5, 0.7)} opacity={r === 1 && c === 2 ? 0 : 0.42} />
          )),
        )}
        <path d={roughRect(102, 30, 38, 20, 91, 1.4)} strokeWidth="2" transform="translate(26 -7)" />
      </svg>
    );
  }
  if (kind === "spotlight") {
    // One light, one claim under it.
    return (
      <svg viewBox="0 0 240 120" className={styles.figure} aria-hidden="true" {...common} strokeWidth="1.2">
        <path d="M112 4 h16 v10 h-16 Z" />
        <path d="M120 14 L78 96" opacity="0.45" />
        <path d="M120 14 L162 96" opacity="0.45" />
        <path d={roughEllipse(120, 98, 44, 9, 17)} opacity="0.6" />
        <path d={roughRect(104, 84, 32, 16, 41, 1.2)} strokeWidth="2" />
      </svg>
    );
  }
  // A recorded trace, flat until it is not.
  return (
    <svg viewBox="0 0 240 120" className={styles.figure} aria-hidden="true" {...common} strokeWidth="1.4">
      <path d="M6 60 H70 l8 -34 l10 68 l9 -52 l8 38 l7 -22 l10 12 H234" />
      <path d={roughLine(6, 92, 234, 92, 63, 0.8)} opacity="0.35" />
    </svg>
  );
}

type Props = {
  from: WorldId;
  to: WorldId;
  /** Small line above the name, e.g. "Case file 02". */
  eyebrow?: string;
  /**
   * The chapter this threshold leads into, so the header's readout moves
   * with the reader rather than lagging on the chapter being left.
   */
  chapter?: string;
};

export function WorldGate({ from, to, eyebrow, chapter }: Props) {
  const going = worlds[to];
  const leaving = worlds[from];
  const sig = worldSignature[to] ?? "trace";

  return (
    <div
      className={styles.gate}
      aria-hidden="true"
      data-chapter={chapter}
      data-world={to}
      data-world-dark={going.dark ? "" : undefined}
    >
      <div className={styles.pin}>
        <div className={styles.from} data-world={from} data-world-ignore="" />
        <div className={styles.to} data-world={to} data-world-ignore="" />
        <div className={styles.sweep} />

        <div className={styles.copy} data-world={to} data-world-ignore="">
          <p className={styles.leaving}>Leaving {leaving.name.toLowerCase()}</p>
          <Figure kind={sig} />
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <p className={styles.name}>{going.name}</p>
          <p className={styles.line}>{going.line}</p>
        </div>
      </div>
    </div>
  );
}
