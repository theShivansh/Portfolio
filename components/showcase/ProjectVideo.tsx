"use client";

import { useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore, type Ref } from "react";
import { track } from "@/lib/analytics";
import { useMotionPreference } from "../motion/MotionSafe";
import styles from "./showcase.module.css";

export type ProjectVideoHandle = {
  seek: (t: number) => void;
  time: () => number;
};

type Props = {
  ref?: Ref<ProjectVideoHandle>;
  slug: string;
  title: string;
  src: string;
  poster: string;
  /** Only the video in front may load or play. */
  active: boolean;
  /** Something else (the full-screen view) is showing this video. */
  suspended?: boolean;
  /** Fallback when the file does not load. */
  liveDemo?: string;
  description: string;
  onTime?: (t: number | null) => void;
  onExpand: () => void;
};

/** Which demos have already played on this page, so a replay isn't a new event. */
const played = new Set<string>();

const noSubscribe = () => () => undefined;

function saveData(): boolean {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || c.effectiveType === "slow-2g" || c.effectiveType === "2g");
}

/**
 * A muted, looping demo that behaves like a good citizen:
 *
 * - nothing downloads until it is in front and near the viewport (poster first);
 * - it plays only while at least half of it is visible, and pauses below 25%;
 * - it never autoplays under reduced motion or Save-Data, it waits for a tap;
 * - a pause the visitor chose is respected until they press play again;
 * - if the file fails, the poster stays and the live demo is offered instead.
 */
export function ProjectVideo({
  ref,
  slug,
  title,
  src,
  poster,
  active,
  suspended = false,
  liveDemo,
  description,
  onTime,
  onExpand,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const motion = useMotionPreference();
  const [near, setNear] = useState(false);
  const [ratio, setRatio] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [userPlayed, setUserPlayed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  // Read once on the client; the server assumes a normal connection.
  const lowData = useSyncExternalStore(noSubscribe, saveData, () => false);

  useImperativeHandle(ref, () => ({
    seek: (t) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = t;
      onTime?.(t);
    },
    time: () => videoRef.current?.currentTime ?? 0,
  }));

  // Loading is gated on distance; playing is gated on how much is visible.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const nearIo = new IntersectionObserver(([e]) => setNear(!!e?.isIntersecting), { rootMargin: "300px 0px" });
    const seenIo = new IntersectionObserver(([e]) => setRatio(e?.intersectionRatio ?? 0), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    nearIo.observe(v);
    seenIo.observe(v);
    return () => {
      nearIo.disconnect();
      seenIo.disconnect();
    };
  }, []);

  // A card going to the back of the deck starts from the top next time.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || active) return;
    v.pause();
    if (v.readyState > 0) v.currentTime = 0;
    setUserPaused(false);
    setUserPlayed(false);
    setProgress(0);
  }, [active]);

  const autoplay = motion === "full" && !lowData;
  const loaded = active && (near || userPlayed);
  const shouldPlay = loaded && !suspended && !failed && !userPaused && ratio >= 0.5 && (autoplay || userPlayed);
  const shouldPause = !active || suspended || ratio < 0.25 || userPaused;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (shouldPlay && v.paused) v.play().catch(() => setPlaying(false));
    else if (shouldPause && !v.paused) v.pause();
  }, [shouldPlay, shouldPause, loaded]);

  // When this card leaves the front, the diagram stops following it.
  useEffect(() => {
    if (!active) return;
    return () => onTime?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      setUserPlayed(true);
      v.play().catch(() => setPlaying(false));
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <div className={styles.player} data-playing={playing ? "" : undefined} data-failed={failed ? "" : undefined}>
      <video
        ref={videoRef}
        className={styles.video}
        src={loaded ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-label={`${title} demo, muted. ${description}`}
        tabIndex={-1}
        onClick={active ? onExpand : undefined}
        onPlaying={() => {
          setPlaying(true);
          if (!played.has(slug)) {
            played.add(slug);
            track("project_video_play", { project: slug });
          }
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress(v.currentTime / v.duration);
          if (active) onTime?.(v.currentTime);
        }}
        onError={() => setFailed(true)}
      />

      {active ? (
        <div className={styles.controls}>
          <button type="button" className={styles.ctrl} onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} the ${title} demo`}>
            <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
          </button>
          <span className={styles.bar} aria-hidden="true">
            <span style={{ transform: `scaleX(${progress})` }} />
          </span>
          <button type="button" className={`${styles.ctrl} ${styles.expand}`} onClick={onExpand}>
            <span aria-hidden="true">⤢</span>
            <span className={styles.ctrlLabel}>Watch with sound</span>
          </button>
        </div>
      ) : null}

      {active && !playing && !failed && !autoplay && !userPlayed ? (
        <button type="button" className={styles.bigPlay} onClick={toggle} aria-label={`Play the ${title} demo`}>
          <span aria-hidden="true">▶</span>
        </button>
      ) : null}

      {failed ? (
        <p className={styles.failed}>
          The demo didn&apos;t load.{" "}
          {liveDemo ? (
            <a href={liveDemo} target="_blank" rel="noopener" data-track="live_demo_click" data-project={slug}>
              Open the live app ↗
            </a>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
