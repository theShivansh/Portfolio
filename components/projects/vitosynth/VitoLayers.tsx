import styles from "./vitosynth.module.css";

/**
 * The six dimensions VitoSynth returns, drawn as abstract response shapes.
 * No axes, no units, no values: the prototype's outputs are model-generated
 * simulations, so the portfolio shows what is modelled, not what it "predicts".
 */
const layers = [
  { name: "Glucose", note: "curve over 3 hours", d: "M0 30 C 30 30, 45 4, 70 6 S 120 34, 160 26 S 220 28, 240 28" },
  { name: "Insulin", note: "post-meal response", d: "M0 32 C 40 32, 55 10, 85 8 S 140 30, 180 30 S 230 31, 240 31" },
  { name: "Energy", note: "trajectory", d: "M0 18 C 40 10, 70 10, 100 18 S 150 34, 180 26 S 230 16, 240 16" },
  { name: "Organ model", note: "relative load", d: "M0 26 L40 26 L40 14 L80 14 L80 22 L130 22 L130 10 L170 10 L170 24 L240 24" },
  { name: "Cognition", note: "hours after the meal", d: "M0 12 C 40 12, 60 30, 100 32 S 170 16, 240 12" },
  { name: "Circadian", note: "timing vs chronotype", d: "M0 20 C 30 6, 90 6, 120 20 S 210 34, 240 20" },
];

export function VitoLayers() {
  return (
    <div className={styles.wrap}>
      <ol className={styles.pipeline} aria-label="Pipeline">
        <li>Meal image</li>
        <li>Structured input</li>
        <li>Simulation</li>
        <li>Six dimensions</li>
      </ol>
      <ul className={styles.layers} aria-label="Simulated dimensions">
        {layers.map((l) => (
          <li key={l.name} className={styles.layer}>
            <span className={styles.name}>{l.name}</span>
            <svg viewBox="0 0 240 40" preserveAspectRatio="xMinYMid meet" aria-hidden="true" className={styles.shape}>
              <path d={l.d} pathLength={1} className="draw-on-view" style={{ "--len": 1 } as React.CSSProperties} />
            </svg>
            <span className={styles.note}>{l.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
