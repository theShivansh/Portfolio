"use client";

import { useEffect } from "react";
import { storageKeys, type MotionPreference, type SoundPreference } from "@/lib/motion";
import { play } from "@/lib/sound";
import { useHtmlData } from "@/lib/use-html-data";
import styles from "../navigation/nav.module.css";

function save(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice lasts for this page view */
  }
}

/** Motion FULL / REDUCED and Sound OFF / ON. OS preference is the default. */
export function Preferences() {
  const motion = useHtmlData("motion", "full") as MotionPreference;
  const sound = useHtmlData("sound", "off") as SoundPreference;

  // Follow OS changes until the visitor makes an explicit choice.
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      const d = document.documentElement.dataset;
      if (d.motionChoice === "system") d.motion = mq.matches ? "reduced" : "full";
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleMotion = () => {
    const next: MotionPreference = motion === "full" ? "reduced" : "full";
    const d = document.documentElement.dataset;
    d.motion = next;
    d.motionChoice = next;
    save(storageKeys.motion, next);
    play("toggle");
  };

  const toggleSound = () => {
    const next: SoundPreference = sound === "on" ? "off" : "on";
    document.documentElement.dataset.sound = next;
    save(storageKeys.sound, next);
    if (next === "on") play("toggle");
  };

  return (
    <div className={styles.prefs} role="group" aria-label="Preferences">
      <button type="button" className={styles.pref} onClick={toggleMotion} aria-pressed={motion === "reduced"}>
        <span className={styles.prefKey}>Motion</span>
        <span className={styles.prefVal}>{motion === "full" ? "Full" : "Reduced"}</span>
      </button>
      <button type="button" className={styles.pref} onClick={toggleSound} aria-pressed={sound === "on"}>
        <span className={styles.prefKey}>Sound</span>
        <span className={styles.prefVal}>{sound === "on" ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
