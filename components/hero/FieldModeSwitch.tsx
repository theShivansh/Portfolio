"use client";

import { storageKeys } from "@/lib/motion";
import { play } from "@/lib/sound";
import { useHtmlData } from "@/lib/use-html-data";
import styles from "./hero.module.css";

/**
 * Note mode ↔ system mode. Optional: turns on handwritten annotations,
 * extra technical metadata and the graph-paper grid. Scrolling stays the
 * main path; nothing is hidden behind this switch that the page needs.
 */
export function FieldModeSwitch() {
  const on = useHtmlData("field", "off") === "on";

  const toggle = () => {
    const next = on ? "off" : "on";
    document.documentElement.dataset.field = next;
    try {
      localStorage.setItem(storageKeys.field, next);
    } catch {
      /* ignore */
    }
    play("toggle");
  };

  return (
    <button type="button" role="switch" aria-checked={on} onClick={toggle} className={styles.switch}>
      <span className={styles.switchLabel}>Field mode</span>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.switchState} aria-hidden="true">
        {on ? "On" : "Off"}
      </span>
    </button>
  );
}
