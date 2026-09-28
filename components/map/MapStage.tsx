"use client";

import Link from "next/link";
import { useState } from "react";
import { getProject } from "@/lib/projects";
import { mapEdges, mapNodes } from "@/lib/universe";
import { Glyph } from "./Glyph";
import styles from "./map.module.css";

/** Stage units. The container holds this aspect ratio so lines and cards agree. */
const W = 1000;
const H = 780;
/** How far a connector stops short of the card it points at, in stage units. */
const INSET = 78;
/** How far along the line a technique note is written, clear of the card. */
const LABEL_OUT = 150;
/** Rough advance per character of the handwriting, for edge fitting. */
const LABEL_EM = 9.6;

type Point = { x: number; y: number };

const points = new Map<string, Point>(
  mapNodes.map((n) => [n.slug, { x: (n.x / 100) * W, y: (n.y / 100) * H }]),
);

/** Trim both ends of a segment so it meets the card edge, not its middle. */
function segment(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.min(INSET, len * 0.38) / len;
  return {
    x1: a.x + dx * t,
    y1: a.y + dy * t,
    x2: b.x - dx * t,
    y2: b.y - dy * t,
    mx: a.x + dx / 2,
    my: a.y + dy / 2,
  };
}

/**
 * The map: seven systems placed as artifacts, and the lines are the
 * engineering they share. Pointing at a system dims everything it has
 * nothing to do with and writes the shared technique on each line it keeps.
 */
export function MapStage() {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <div className={styles.stage} style={{ "--stage-w": W, "--stage-h": H } as React.CSSProperties}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={styles.wires}
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
      >
        {mapEdges.map((e) => {
          const a = points.get(e.a);
          const b = points.get(e.b);
          if (!a || !b) return null;
          const s = segment(a, b);
          const touched = focus === e.a || focus === e.b;
          return (
            <g
              key={`${e.a}-${e.b}`}
              className={styles.wire}
              data-kind={e.kind}
              data-state={focus ? (touched ? "on" : "off") : "rest"}
            >
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
            </g>
          );
        })}
      </svg>

      <ol className={styles.nodes}>
        {mapNodes.map((n) => {
          const p = getProject(n.slug);
          if (!p) return null;
          const dim = focus !== null && focus !== n.slug;
          return (
            <li
              key={n.slug}
              className={styles.nodeSlot}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              data-dim={dim || undefined}
            >
              <Link
                href={`/work/${n.slug}`}
                className={styles.node}
                data-tier={p.tier}
                onMouseEnter={() => setFocus(n.slug)}
                onFocus={() => setFocus(n.slug)}
                // Only this node may clear itself, so leaving one with the
                // pointer never wipes a selection the keyboard just made.
                onMouseLeave={() => setFocus((f) => (f === n.slug ? null : f))}
                onBlur={() => setFocus((f) => (f === n.slug ? null : f))}
              >
                <span className={styles.nodeN}>{p.number}</span>
                <Glyph kind={n.glyph} />
                <span className={styles.nodeTitle}>{p.title}</span>
                <span className={styles.nodeArtifact}>{n.artifact}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {/*
        Labels sit above the plates and are written outward from whichever
        system is being held, so they land in open paper instead of across
        the card the reader is pointing at.
      */}
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.wireNotes} aria-hidden="true">
        {mapEdges.map((e) => {
          const a = points.get(e.a);
          const b = points.get(e.b);
          if (!a || !b) return null;
          const touched = focus === e.a || focus === e.b;
          const from = focus === e.b ? b : a;
          const to = focus === e.b ? a : b;
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.hypot(dx, dy) || 1;
          const t = LABEL_OUT / len;
          const x = from.x + dx * t;
          // Write in the direction of travel, unless that runs off the sheet.
          const w = e.label.length * LABEL_EM;
          let anchor: "start" | "end" = dx >= 0 ? "start" : "end";
          if (anchor === "start" && x + w > W - 12) anchor = "end";
          else if (anchor === "end" && x - w < 12) anchor = "start";
          return (
            <text
              key={`${e.a}-${e.b}`}
              x={x}
              y={from.y + dy * t - 9}
              textAnchor={anchor}
              className={styles.wireLabel}
              data-state={touched ? "on" : "off"}
            >
              {e.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
