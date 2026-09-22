"use client";

import { useMemo, useState } from "react";
import { drawFrames, roughLine, roughRect, seeded } from "@/lib/sketch";
import { play } from "@/lib/sound";
import { StopMotion } from "../../motion/StopMotion";
import styles from "./zenstep.module.css";

type Budget = 2 | 10 | 30;

/**
 * Sample protocols in the shape ZenStep's model returns. The first two
 * tasks are the README's own examples; less time means smaller steps.
 */
const protocols: Record<Budget, string[]> = {
  2: ["Rescue 1 coffee mug", "Neutralize 3 pieces of trash", "Stack loose papers into one pile", "Put 1 thing back where it lives"],
  10: ["Clear every cup and plate from the desk", "Bin all visible trash", "Sort papers: keep, file, recycle", "Wipe the desk surface", "Return 5 items to their places"],
  30: ["Clear the desk completely", "Sort and file every paper", "Empty the bin", "Tidy the floor around the desk", "Wipe down surfaces", "Set up tomorrow's first task"],
};

const ITEMS = 18;

/** Deterministic clutter: each mark has a messy pose and a tidy pose. */
function useClutter() {
  return useMemo(() => {
    const rnd = seeded(77);
    return Array.from({ length: ITEMS }, (_, i) => {
      const w = 18 + rnd() * 26;
      const h = 8 + rnd() * 14;
      return {
        i,
        w,
        h,
        mx: 14 + rnd() * 250,
        my: 14 + rnd() * 120,
        rot: (rnd() - 0.5) * 70,
        tx: 22 + (i % 6) * 44,
        ty: 26 + Math.floor(i / 6) * 42,
        d: i % 4 === 0 ? roughLine(0, h / 2, w, h / 2, i + 3, 1.2) : roughRect(0, 0, w, h, i + 5, 1.1),
      };
    });
  }, []);
}

const checkFrames = drawFrames((p) => {
  // Two strokes of a tick, drawn in order.
  const a = Math.min(1, p * 2);
  const b = Math.max(0, p * 2 - 1);
  const x1 = 3 + 5 * a;
  const y1 = 10 + 5 * a;
  const x2 = 8 + 11 * b;
  const y2 = 15 - 12 * b;
  return `M3 10 L${x1.toFixed(1)} ${y1.toFixed(1)}${b > 0 ? ` L${x2.toFixed(1)} ${y2.toFixed(1)}` : ""}`;
}, 6);

export function ZenStepCalm() {
  const clutter = useClutter();
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [budget, setBudget] = useState<Budget>(2);
  const [done, setDone] = useState<Set<number>>(new Set());

  const tasks = protocols[budget];
  const progress = stage < 2 ? 0 : done.size / tasks.length;
  const tidyCount = Math.round(progress * ITEMS);
  const entropy = Math.round((1 - progress) * 100);

  const toggleTask = (i: number) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      if (next.size === tasks.length) play("success");
      else play("tick");
      return next;
    });
  };

  const chooseBudget = (b: Budget) => {
    play("toggle");
    setBudget(b);
    setDone(new Set());
    setStage(2);
  };

  const states = ["Messy state", "Analyzed", `${budget} minutes`, "Tasks"];
  const reached = stage === 0 ? 1 : stage === 1 ? 2 : 4;

  return (
    <div className={styles.calm} data-stage={stage}>
      <ol className={styles.states} aria-label="Protocol stages">
        {states.map((s, i) => (
          <li key={s} data-on={i < reached || undefined} aria-current={i === reached - 1 ? "step" : undefined}>
            {s}
          </li>
        ))}
      </ol>

      <div className={styles.grid}>
        <figure className={styles.room}>
          <svg viewBox="0 0 300 160" role="img" aria-label={`Visual entropy ${entropy}%. ${tidyCount} of ${ITEMS} items put away.`}>
            <rect x="1" y="1" width="298" height="158" className={styles.roomFrame} />
            {clutter.map((c) => {
              const tidy = c.i < tidyCount;
              const x = tidy ? c.tx : c.mx;
              const y = tidy ? c.ty : c.my;
              const r = tidy ? 0 : c.rot;
              return (
                <g key={c.i} className={styles.item} style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg)` }}>
                  <path d={c.d} />
                </g>
              );
            })}
            {stage >= 1 ? (
              <g className={styles.zones}>
                <rect x="10" y="10" width="140" height="70" />
                <rect x="160" y="60" width="128" height="88" />
              </g>
            ) : null}
          </svg>
          <figcaption className={styles.entropy}>
            <span className="meta">Visual entropy</span>
            <span className={styles.entropyValue}>{entropy}%</span>
          </figcaption>
        </figure>

        <div className={styles.panel}>
          {stage === 0 ? (
            <div className={styles.start}>
              <p>A photo of a cluttered desk. The model reads the mess before it plans anything.</p>
              <button
                type="button"
                className="btn btn-solid"
                onClick={() => {
                  play("toggle");
                  setStage(1);
                }}
              >
                Analyze photo
              </button>
            </div>
          ) : null}

          {stage >= 1 ? (
            <div className={styles.budget}>
              <p className="meta" id="zen-budget">
                Time you have
              </p>
              <div className={styles.segmented} role="radiogroup" aria-labelledby="zen-budget">
                {([2, 10, 30] as Budget[]).map((b) => (
                  <button key={b} type="button" role="radio" aria-checked={stage === 2 && budget === b} onClick={() => chooseBudget(b)}>
                    {b} min
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {stage === 2 ? (
            <ul className={styles.tasks}>
              {tasks.map((t, i) => {
                const checked = done.has(i);
                return (
                  <li key={`${budget}-${t}`}>
                    <button type="button" role="checkbox" aria-checked={checked} onClick={() => toggleTask(i)} className={styles.task}>
                      <span className={styles.box} aria-hidden="true">
                        {checked ? <StopMotion frames={checkFrames} viewBox="0 0 22 20" trigger="once" strokeWidth={2.2} className={styles.check} /> : null}
                      </span>
                      <span className={styles.taskN}>Task {String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.taskText}>{t}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          {stage === 2 && done.size === tasks.length ? (
            <p className={styles.doneNote} role="status">
              Done. That is the whole protocol.
            </p>
          ) : null}
        </div>
      </div>
      <p className={styles.caption}>Sample protocol in the shape the model returns: tasks, order and pacing as JSON.</p>
    </div>
  );
}
