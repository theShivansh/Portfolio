"use client";

import type { CSSProperties } from "react";
import { clock, type FlowStep } from "@/lib/showcase";
import styles from "./showcase.module.css";

const kindLabel: Record<FlowStep["kind"], string> = {
  io: "in / out",
  model: "model",
  code: "code",
  human: "person",
  store: "store",
  gate: "gate",
};

/**
 * The system, as the demo shows it.
 *
 * While the demo plays, each step lights at the second it is on screen, so
 * the diagram and the footage explain each other. Each step is also a
 * chapter: pressing it moves the video there. With no time to follow
 * (paused before it starts, reduced motion, no video) every step is shown
 * lit, which is the readable resting state.
 */
export function FlowStrip({
  steps,
  time,
  title,
  onSeek,
}: {
  steps: FlowStep[];
  time: number | null;
  title: string;
  onSeek?: (t: number) => void;
}) {
  let current = -1;
  if (time !== null) steps.forEach((s, i) => (time >= s.at - 0.05 ? (current = i) : null));

  return (
    <ol className={styles.flow} aria-label={`${title} pipeline, as shown in the demo`} data-following={time !== null ? "" : undefined}>
      {steps.map((s, i) => {
        const lit = time === null || i <= current;
        return (
          <li
            key={s.label}
            className={styles.step}
            data-kind={s.kind}
            data-lit={lit ? "" : undefined}
            data-current={i === current ? "" : undefined}
            style={{ "--i": i } as CSSProperties}
          >
            <button
              type="button"
              className={styles.stepBtn}
              onClick={onSeek ? () => onSeek(s.at) : undefined}
              disabled={!onSeek}
              aria-current={i === current ? "step" : undefined}
              aria-label={`${s.label}: ${s.detail}. ${kindLabel[s.kind]}. Jump the demo to ${clock(s.at)}.`}
            >
              <span className={styles.stepKind} aria-hidden="true">
                {kindLabel[s.kind]}
              </span>
              <span className={styles.stepLabel} aria-hidden="true">
                {s.label}
              </span>
              <span className={styles.stepDetail} aria-hidden="true">
                {s.detail}
              </span>
              <span className={styles.stepAt} aria-hidden="true">
                {clock(s.at)}
              </span>
            </button>
            {s.lanes ? (
              <ul className={styles.lanes} aria-label="Running in parallel">
                {s.lanes.map((l, j) => (
                  <li key={l} style={{ "--j": j } as CSSProperties}>
                    {l}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
