/**
 * Deterministic hand-drawn geometry.
 *
 * Every shape is derived from a seed, so the "imperfection" is designed and
 * identical on server and client. No Math.random() anywhere in the visuals.
 */

/** mulberry32: small, fast, seedable PRNG. Returns values in [0, 1). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A slightly bowed line with a small overshoot, like a pencil stroke. */
export function roughLine(x1: number, y1: number, x2: number, y2: number, seed = 1, wobble = 1.6): string {
  const rnd = seeded(seed);
  const j = () => (rnd() - 0.5) * 2 * wobble;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Normal vector for the bow.
  const nx = -dy / len;
  const ny = dx / len;
  const bow = (rnd() - 0.5) * Math.min(6, len * 0.04);
  const mx = x1 + dx * 0.5 + nx * bow;
  const my = y1 + dy * 0.5 + ny * bow;
  const over = 1.5 + rnd() * 2;
  const sx = x1 - (dx / len) * over * rnd();
  const sy = y1 - (dy / len) * over * rnd();
  const ex = x2 + (dx / len) * over * rnd();
  const ey = y2 + (dy / len) * over * rnd();
  return `M${r1(sx + j() * 0.3)} ${r1(sy + j() * 0.3)} Q${r1(mx + j())} ${r1(my + j())} ${r1(ex)} ${r1(ey)}`;
}

/** Four rough sides with corners that don't quite meet. */
export function roughRect(x: number, y: number, w: number, h: number, seed = 1, wobble = 1.4): string {
  return [
    roughLine(x, y, x + w, y, seed, wobble),
    roughLine(x + w, y, x + w, y + h, seed + 11, wobble),
    roughLine(x + w, y + h, x, y + h, seed + 23, wobble),
    roughLine(x, y + h, x, y, seed + 37, wobble),
  ].join(" ");
}

/** A line with a hand-drawn arrowhead at (x2, y2). */
export function roughArrow(x1: number, y1: number, x2: number, y2: number, seed = 1, head = 7): string {
  const rnd = seeded(seed + 101);
  const a = Math.atan2(y2 - y1, x2 - x1);
  const spread = 0.45 + rnd() * 0.12;
  const h1x = x2 - head * Math.cos(a - spread);
  const h1y = y2 - head * Math.sin(a - spread);
  const h2x = x2 - head * Math.cos(a + spread) * (0.9 + rnd() * 0.2);
  const h2y = y2 - head * Math.sin(a + spread) * (0.9 + rnd() * 0.2);
  return `${roughLine(x1, y1, x2, y2, seed)} M${r1(h1x)} ${r1(h1y)} L${r1(x2)} ${r1(y2)} L${r1(h2x)} ${r1(h2y)}`;
}

/**
 * An annotation loop: an ellipse drawn in one stroke that overshoots its
 * start, the way people circle a word.
 */
export function roughEllipse(cx: number, cy: number, rx: number, ry: number, seed = 1, portion = 1): string {
  const rnd = seeded(seed);
  const start = -Math.PI * (0.6 + rnd() * 0.2);
  const sweep = Math.PI * 2 * (1.08 + rnd() * 0.06);
  const steps = 28;
  const pts: string[] = [];
  const upto = Math.max(1, Math.round(steps * portion));
  for (let i = 0; i <= steps; i++) {
    if (i > upto) {
      rnd();
      continue;
    }
    const t = start + (sweep * i) / steps;
    const drift = 1 + (i / steps) * 0.07; // spiral out slightly
    const nr = 1 + (rnd() - 0.5) * 0.035;
    const x = cx + Math.cos(t) * rx * drift * nr;
    const y = cy + Math.sin(t) * ry * drift * nr;
    pts.push(`${r1(x)} ${r1(y)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")}`;
}

/** An underline that tapers off and rises slightly at the end. */
export function roughUnderline(x: number, y: number, w: number, seed = 1, portion = 1): string {
  const rnd = seeded(seed);
  const mid = y + (rnd() - 0.5) * 2;
  const p0 = [x, y + 1];
  const p1 = [x + w * 0.3, mid - 1.5];
  const p2 = [x + w * 0.7, mid + 2];
  const p3 = [x + w, y - 2 - rnd() * 2];
  const steps = 18;
  const upto = Math.max(1, Math.round(steps * portion));
  const pts: string[] = [];
  for (let i = 0; i <= upto; i++) {
    const t = i / steps;
    const u = 1 - t;
    const bx = u * u * u * p0[0]! + 3 * u * u * t * p1[0]! + 3 * u * t * t * p2[0]! + t * t * t * p3[0]!;
    const by = u * u * u * p0[1]! + 3 * u * u * t * p1[1]! + 3 * u * t * t * p2[1]! + t * t * t * p3[1]!;
    pts.push(`${r1(bx)} ${r1(by)}`);
  }
  return `M${pts[0]} L${pts.slice(1).join(" L")}`;
}

/**
 * Draw-on frames: the same seeded shape at increasing completeness, the way
 * a hand draws it. `make(portion)` must be deterministic for a given portion.
 */
export function drawFrames(make: (portion: number) => string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => make((i + 1) / count));
}

/** Cumulative frames from a list of strokes: stroke 1, then 1+2, then 1+2+3… */
export function strokeFrames(strokes: string[]): string[] {
  return strokes.map((_, i) => strokes.slice(0, i + 1).join(" "));
}

/** Several seeds of the same shape: frames for stop-motion "boiling" lines. */
export function frames(make: (seed: number) => string, count: number, seed = 1): string[] {
  return Array.from({ length: count }, (_, i) => make(seed + i * 7));
}
