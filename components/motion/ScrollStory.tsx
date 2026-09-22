"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./story.module.css";

export type StoryStep = { title: string; body: ReactNode };

type Props = {
  id: string;
  /** Chapter label shown with the progress, e.g. "Zone 02 · Evidence timeline". */
  label: string;
  steps: StoryStep[];
  /** Server-rendered visual. Elements opt in to steps with data-at="n". */
  visual: ReactNode;
  /** Where "Skip" lands. Defaults to the end of this story. */
  skipTo?: string;
  skipLabel?: string;
  className?: string;
};

/**
 * Soft friction: a pinned visual that advances one step per reading block.
 *
 * - Native scrolling only. Nothing listens to wheel or scroll events.
 * - Progress, chapter label, step buttons and a skip link are always visible.
 * - Below 768px (and without JS) nothing pins: the visual shows its final
 *   state and the steps read as short sections.
 * - The visual reacts through CSS: [data-reached~="n"] [data-at="n"].
 */
export function ScrollStory({ id, label, steps, visual, skipTo, skipLabel = "Skip", className }: Props) {
  const [active, setActive] = useState(1);
  const [armed, setArmed] = useState(false);
  const [stickyTop, setStickyTop] = useState<number | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const count = steps.length;

  // Pin only where there is room: tablet and up, and not on very short screens.
  useEffect(() => {
    const mq = matchMedia("(min-width: 768px) and (min-height: 600px)");
    const sync = () => setArmed(mq.matches);
    mq.addEventListener("change", sync);
    // First sync runs as a callback, not synchronously in the effect body.
    const raf = requestAnimationFrame(sync);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", sync);
    };
  }, []);

  // The active step is the last one whose top has passed the viewport's middle.
  // Two observers trigger the recompute: a centre line for normal scrolling,
  // and the full viewport so jumps (anchors, End key) land on the right step.
  useEffect(() => {
    if (!armed) return;
    const recompute = () => {
      const mid = window.innerHeight / 2;
      let n = 1;
      stepRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < mid) n = i + 1;
      });
      setActive(n);
    };
    const band = new IntersectionObserver(recompute, { rootMargin: "-50% 0px -50% 0px" });
    const view = new IntersectionObserver(recompute, { threshold: [0, 0.5, 1] });
    stepRefs.current.forEach((el) => {
      if (!el) return;
      band.observe(el);
      view.observe(el);
    });
    return () => {
      band.disconnect();
      view.disconnect();
    };
  }, [armed, count]);

  // A stage taller than the viewport pins by its bottom edge instead of
  // hiding it: the sticky offset shrinks (or goes negative) to fit.
  useEffect(() => {
    const stage = stageRef.current;
    if (!armed || !stage) return;
    const fit = () => {
      const preferred = 76;
      const room = window.innerHeight - stage.offsetHeight - 16;
      setStickyTop(Math.min(preferred, room));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [armed]);

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.min(count, Math.max(1, n));
      const el = stepRefs.current[clamped - 1];
      if (!el) return;
      el.scrollIntoView({ block: "center" });
      el.focus({ preventScroll: true });
      setActive(clamped);
    },
    [count],
  );

  const reached = armed
    ? Array.from({ length: active }, (_, i) => i + 1).join(" ")
    : Array.from({ length: count }, (_, i) => i + 1).join(" ");
  const endId = `${id}-end`;

  return (
    <div
      id={id}
      className={`${styles.story} ${className ?? ""}`}
      data-armed={armed || undefined}
      data-reached={reached}
      data-step={armed ? active : count}
      style={{ "--count": count } as React.CSSProperties}
    >
      <div
        ref={stageRef}
        className={styles.stage}
        style={armed && stickyTop !== null ? ({ "--sticky-top": `${stickyTop}px` } as React.CSSProperties) : undefined}
      >
        <div className={styles.head}>
          <p className={styles.label}>{label}</p>
          <div className={styles.progressRow}>
            {armed ? (
              <>
                <p className={styles.count} aria-live="polite">
                  Step {String(active).padStart(2, "0")} / {String(count).padStart(2, "0")}
                </p>
                <div className={styles.ticks} aria-hidden="true">
                  {steps.map((s, i) => (
                    <span key={s.title} data-on={i < active || undefined} />
                  ))}
                </div>
              </>
            ) : (
              <p className={styles.count}>{count} steps</p>
            )}
            <div className={styles.controls}>
              {armed ? (
                <>
                  <button type="button" onClick={() => goTo(active - 1)} disabled={active <= 1} aria-label="Previous step">
                    ↑
                  </button>
                  <button type="button" onClick={() => goTo(active + 1)} disabled={active >= count} aria-label="Next step">
                    ↓
                  </button>
                </>
              ) : null}
              <a href={skipTo ?? `#${endId}`} className={styles.skip}>
                {skipLabel}
              </a>
            </div>
          </div>
        </div>
        <div className={styles.visual}>{visual}</div>
      </div>

      <ol className={styles.steps}>
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-step={i + 1}
            data-current={armed && active === i + 1 ? true : undefined}
            tabIndex={-1}
            className={styles.step}
          >
            <p className={styles.stepN}>Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <div className={styles.stepBody}>{s.body}</div>
          </li>
        ))}
      </ol>
      <div id={endId} tabIndex={-1} className={styles.end} />
    </div>
  );
}
