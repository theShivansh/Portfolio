import { roughArrow, roughRect } from "@/lib/sketch";
import styles from "./intro.module.css";

/*
 * The first frame of a visit: a print proof coming into register.
 *
 * Three plates of the hero's own sketch (ink, pencil, signal) start a few
 * pixels apart, slide into register, the crop marks flash lime on contact,
 * and the sheet is pulled away up the page's columns. The hero is already
 * rendered underneath the whole time.
 *
 * Pure CSS, so it starts on the first paint rather than after hydration.
 * The boot script decides whether it plays (once per session, never under
 * reduced motion or on a deep link) and lifts it on any input. Without JS
 * it never shows. Decorative only: aria-hidden, no text, no pointer events.
 */

const STRIPS = 6;

function Sketch() {
  return (
    <>
      <path d={roughRect(30, 8, 100, 36, 3)} />
      <path d={roughRect(12, 100, 136, 52, 17)} />
      <path d={roughRect(30, 210, 100, 36, 9)} />
      <path d={roughArrow(80, 50, 81, 94, 21)} />
      <path d={roughArrow(81, 158, 80, 204, 29)} />
    </>
  );
}

function Mark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="7" />
      <path d="M-12 0H12M0-12V12" />
    </g>
  );
}

export function IntroPlate() {
  return (
    <div className={styles.plate} aria-hidden="true">
      {Array.from({ length: STRIPS }, (_, i) => (
        <span key={i} className={styles.strip} style={{ "--i": i } as React.CSSProperties} />
      ))}
      <svg className={styles.proof} viewBox="-40 -40 240 334" fill="none" strokeLinecap="round">
        <g className={styles.marks} strokeWidth="1.1">
          <Mark x={-22} y={-22} />
          <Mark x={182} y={-22} />
          <Mark x={-22} y={276} />
          <Mark x={182} y={276} />
        </g>
        <g className={styles.layerSignal} strokeWidth="2.4">
          <Sketch />
        </g>
        <g className={styles.layerPencil} strokeWidth="1.7">
          <Sketch />
        </g>
        <g className={styles.layerInk} strokeWidth="1.5">
          <Sketch />
        </g>
      </svg>
    </div>
  );
}
