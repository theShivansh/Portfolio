"use client";

import { useId, useMemo, useState } from "react";
import { seeded } from "@/lib/sketch";
import styles from "./moneymentor.module.css";

/**
 * Illustrative only. Mirrors the update rule in MoneyMentor's README:
 *   r ~ N(annual/12, vol/√12);  corpus = (corpus + sip) × (1 + r)
 * with fixed sample inputs and a fixed seed, so the chart is identical on
 * every visit. It is a picture of the method, not a prediction.
 */
const SIP = 12_000; // ₹ per month, from a ₹50,000 sample cashflow
const ANNUAL = 0.12;
const VOL = 0.18;
const PATHS = 400;
const MAX_MONTHS = 120;

type Band = { p10: number; p25: number; p50: number; p75: number; p90: number };

function gaussian(rnd: () => number): number {
  // Box–Muller on a seeded source.
  const u = Math.max(rnd(), 1e-12);
  const v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function simulate(): Band[] {
  const rnd = seeded(2027);
  const mu = ANNUAL / 12;
  const sig = VOL / Math.sqrt(12);
  const corpus = new Float64Array(PATHS);
  const bands: Band[] = [{ p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 }];
  const scratch = new Float64Array(PATHS);
  const q = (sorted: Float64Array, p: number) => sorted[Math.floor(p * (sorted.length - 1))] ?? 0;
  for (let m = 1; m <= MAX_MONTHS; m++) {
    for (let i = 0; i < PATHS; i++) {
      const r = mu + sig * gaussian(rnd);
      corpus[i] = ((corpus[i] ?? 0) + SIP) * (1 + r);
    }
    scratch.set(corpus);
    scratch.sort();
    bands.push({ p10: q(scratch, 0.1), p25: q(scratch, 0.25), p50: q(scratch, 0.5), p75: q(scratch, 0.75), p90: q(scratch, 0.9) });
  }
  return bands;
}

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const lakh = (v: number) => `₹${inr.format(v / 100_000)} L`;

const W = 640;
const H = 280;
const PAD = { l: 8, r: 8, t: 12, b: 26 };

export function FanChart() {
  const bands = useMemo(() => simulate(), []);
  const [months, setMonths] = useState(36);
  const sliderId = useId();

  const view = bands.slice(0, months + 1);
  const yMax = (view[view.length - 1]?.p90 ?? 1) * 1.08;
  const x = (m: number) => PAD.l + (m / months) * (W - PAD.l - PAD.r);
  const y = (v: number) => H - PAD.b - (v / yMax) * (H - PAD.t - PAD.b);

  const area = (lo: keyof Band, hi: keyof Band) =>
    `M${view.map((b, m) => `${x(m).toFixed(1)} ${y(b[hi]).toFixed(1)}`).join(" L")} L${view
      .map((b, m) => `${x(m).toFixed(1)} ${y(b[lo]).toFixed(1)}`)
      .reverse()
      .join(" L")} Z`;
  const line = (k: keyof Band) => `M${view.map((b, m) => `${x(m).toFixed(1)} ${y(b[k]).toFixed(1)}`).join(" L")}`;
  const contributed = `M${x(0)} ${y(0)} L${x(months)} ${y(SIP * months)}`;

  const end = view[view.length - 1] ?? bands[0]!;
  const years = months / 12;

  return (
    <div className={styles.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} role="img" aria-labelledby={`${sliderId}-desc`}>
        <desc id={`${sliderId}-desc`}>
          Illustrative fan chart over {months} months. Median outcome {lakh(end.p50)}, 10th percentile {lakh(end.p10)}, 90th
          percentile {lakh(end.p90)}, against {lakh(SIP * months)} contributed.
        </desc>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={PAD.l} x2={W - PAD.r} y1={y(yMax * f)} y2={y(yMax * f)} className={styles.grid} />
        ))}
        <path d={area("p10", "p90")} className={styles.outer} />
        <path d={area("p25", "p75")} className={styles.inner} />
        <path d={contributed} className={styles.contrib} />
        <path d={line("p50")} className={styles.median} />
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className={styles.axis} />
        <text x={PAD.l} y={H - 8} className={styles.tick}>
          now
        </text>
        <text x={W - PAD.r} y={H - 8} className={styles.tick} textAnchor="end">
          {months} months
        </text>
      </svg>

      <div className={styles.controls}>
        <label htmlFor={sliderId} className="meta">
          Horizon
        </label>
        <input
          id={sliderId}
          type="range"
          min={6}
          max={MAX_MONTHS}
          step={6}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          aria-valuetext={`${months} months`}
          className={styles.range}
          data-cursor="grab"
        />
        <output htmlFor={sliderId} className={styles.output}>
          {years >= 1 ? `${inr.format(years)} yr` : `${months} mo`}
        </output>
      </div>

      <dl className={styles.readout}>
        <div>
          <dt>P10</dt>
          <dd>{lakh(end.p10)}</dd>
        </div>
        <div data-median>
          <dt>P50</dt>
          <dd>{lakh(end.p50)}</dd>
        </div>
        <div>
          <dt>P90</dt>
          <dd>{lakh(end.p90)}</dd>
        </div>
        <div>
          <dt>Contributed</dt>
          <dd>{lakh(SIP * months)}</dd>
        </div>
      </dl>
      <p className={styles.caption}>
        Illustrative: ₹12,000 monthly SIP, 12% expected return, 18% volatility, 400 seeded paths. The app runs 1,200 paths on
        your own numbers.
      </p>
    </div>
  );
}
