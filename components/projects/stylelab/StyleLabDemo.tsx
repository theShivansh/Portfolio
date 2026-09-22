"use client";

import Image from "next/image";
import { startTransition, useState, ViewTransition } from "react";
import { play } from "@/lib/sound";
import styles from "./stylelab.module.css";

type Mode = "inference" | "confirmed";

/**
 * The README's own example: the vision model reads a shirt as black with
 * confidence 0.31; the owner says "actually navy"; that correction becomes
 * canonical wardrobe state. The model never changes. The data does.
 */
export function StyleLabDemo() {
  const [mode, setMode] = useState<Mode>("inference");
  const confirmed = mode === "confirmed";

  const choose = (next: Mode) => {
    if (next === mode) return;
    play("toggle");
    startTransition(() => setMode(next));
  };

  return (
    <div className={styles.demo} data-mode={mode}>
      <div className={styles.toolbar}>
        <p className="meta" id="stylelab-state-label">
          State of truth
        </p>
        <div className={styles.segmented} role="radiogroup" aria-labelledby="stylelab-state-label">
          <button type="button" role="radio" aria-checked={!confirmed} onClick={() => choose("inference")}>
            Model inference
          </button>
          <button type="button" role="radio" aria-checked={confirmed} onClick={() => choose("confirmed")}>
            User confirmed
          </button>
        </div>
      </div>

      <div className={styles.sheet}>
        <figure className={styles.photo}>
          <Image
            src="/images/projects/stylelab-oxford-shirt.webp"
            alt="Product-style photo of a dark oxford shirt on a light background"
            width={960}
            height={1152}
            sizes="(min-width: 1024px) 240px, 40vw"
          />
          <figcaption className="meta">Photo · garment 05</figcaption>
        </figure>

        <dl className={styles.fields}>
          <div className={styles.field}>
            <dt>Garment</dt>
            <dd>
              Oxford shirt <span className={styles.tag}>observed</span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Category</dt>
            <dd>
              top <span className={styles.tag}>likely</span>
            </dd>
          </div>
          <div className={`${styles.field} ${styles.colour}`} data-cursor="inspect">
            <dt>Colour</dt>
            <dd>
              <ViewTransition name="stylelab-colour" share="swap" default="none">
                <span className={styles.value} key={mode}>
                  <span className={styles.swatch} data-colour={confirmed ? "navy" : "black"} aria-hidden="true" />
                  {confirmed ? "navy" : "black"}
                  <span className={styles.tag} data-strong={confirmed || undefined}>
                    {confirmed ? "user_corrected" : "inferred"}
                  </span>
                </span>
              </ViewTransition>
              <span className={styles.confidence} aria-label={confirmed ? "Confidence: confirmed by owner" : "Confidence 0.31"}>
                <span className={styles.meter} aria-hidden="true">
                  <span style={{ width: confirmed ? "100%" : "31%" }} />
                </span>
                <span className="mono">{confirmed ? "owner" : "0.31"}</span>
              </span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Material</dt>
            <dd>
              cotton <span className={styles.tag}>best guess</span>
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Fit</dt>
            <dd>
              regular <span className={styles.tag}>best guess</span>
            </dd>
          </div>
        </dl>

        <div className={styles.note} aria-hidden={!confirmed}>
          <p className="hand">“actually navy.”</p>
        </div>
      </div>

      <p className={styles.canonical} aria-live="polite">
        {confirmed ? (
          <>
            <span className="live-dot" aria-hidden="true" /> Canonical state: <code>colour = navy</code> ·{" "}
            <code>source = user_corrected</code>. Every future outfit is grounded in this value.
          </>
        ) : (
          <>Low confidence is shown, not hidden. The owner can correct it before anything is recommended.</>
        )}
      </p>
    </div>
  );
}
