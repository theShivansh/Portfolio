"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { track } from "@/lib/analytics";
import { clock, videoFiles, type Flagship } from "@/lib/showcase";
import { worldFor } from "@/lib/worlds";
import { useMotionPreference } from "../motion/MotionSafe";
import { SectionMarker } from "../motion/primitives";
import { ViewTransitionLink } from "../motion/ViewTransitionLink";
import { FlowStrip } from "./FlowStrip";
import { MediaDialog } from "./MediaDialog";
import { ProjectVideo, type ProjectVideoHandle } from "./ProjectVideo";
import { WorldField, type FieldWorld } from "./WorldField";
import styles from "./showcase.module.css";

type Dialog = { kind: "video"; at: number } | { kind: "feature" } | null;

const statusLabel = {
  "test-verified": "test-verified",
  measured: "measured",
  benchmark: "benchmark",
  reported: "reported",
} as const;

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0] ?? s;

/**
 * Three demos as a deck of exhibits.
 *
 * The card in front plays; the two behind it wait as posters and cost
 * nothing. Moving the deck — tab, arrow key, button, drag or swipe — tosses
 * the front card to the back, and the surface underneath turns into the
 * next system's world. The dossier beside the deck is the same story in
 * text: problem, decision, system, evidence, result, and the links.
 *
 * Every dossier is in the server HTML; inactive ones are only hidden, so
 * the page reads complete to crawlers and, through the noscript rule, to a
 * browser without JavaScript.
 */
export function FlagshipDeck({ flagships }: { flagships: Flagship[] }) {
  const n = flagships.length;
  const motion = useMotionPreference();
  const [active, setActive] = useState(0);
  const [move, setMove] = useState<{ card: number; dir: "out" | "in"; key: number } | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const videos = useRef<(ProjectVideoHandle | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const front = useRef<HTMLDivElement>(null);

  const current = flagships[active]!;
  const world = worldFor(current.project.slug);

  const go = useCallback(
    (next: number, focusTab = false) => {
      const i = ((next % n) + n) % n;
      if (i === active) return;
      // Forward: the front card is tossed to the back. Back: the last card is pulled forward.
      const forward = i === (active + 1) % n;
      setMove({ card: forward ? active : i, dir: forward ? "out" : "in", key: Date.now() });
      setActive(i);
      setTime(null);
      if (focusTab) tabs.current[i]?.focus();
    },
    [active, n],
  );

  // The header follows the world under it; tell it the world changed in place.
  useEffect(() => {
    window.dispatchEvent(new Event("fi:world"));
  }, [active]);

  // /#crown-x and friends: bring that card to the front, then land on it.
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      const i = flagships.findIndex((f) => f.project.slug === slug);
      if (i < 0) return;
      setActive(i);
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: "start" }));
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [flagships]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: n - 1 };
    const to = keys[e.key];
    if (to === undefined) return;
    e.preventDefault();
    go(to, true);
  };

  /* ─── Drag, swipe, tilt ─────────────────────────────── */

  const drag = useRef<{ x: number; y: number; lastX: number; t: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const setVar = (k: string, v: string) => front.current?.style.setProperty(k, v);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest("button, a")) return;
    drag.current = { x: e.clientX, y: e.clientY, lastX: e.clientX, t: performance.now(), id: e.pointerId, moved: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d && d.id === e.pointerId) {
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.lastX = e.clientX;
      if (!d.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
        d.moved = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // The pointer is already gone; the gesture still counts.
        }
        front.current?.setAttribute("data-dragging", "");
      }
      if (d.moved) {
        setVar("--drag", `${dx}px`);
        setVar("--drag-r", `${(dx / 26).toFixed(2)}deg`);
      }
      return;
    }
    // Tilt toward a fine pointer, never for touch or reduced motion.
    if (e.pointerType !== "mouse" || motion === "reduced" || !front.current) return;
    const r = front.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setVar("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
    setVar("--tilt-y", `${(px * 9).toFixed(2)}deg`);
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    front.current?.removeAttribute("data-dragging");
    setVar("--drag", "0px");
    setVar("--drag-r", "0deg");
    if (!d || !d.moved) return;
    suppressClick.current = true;
    setTimeout(() => (suppressClick.current = false), 0);
    // pointercancel carries no reliable position, so use the last one seen.
    const dx = (e.type === "pointercancel" ? d.lastX : e.clientX) - d.x;
    const v = dx / Math.max(1, performance.now() - d.t);
    if (dx < -80 || v < -0.55) go(active + 1);
    else if (dx > 80 || v > 0.55) go(active - 1);
  };

  const onPointerLeave = () => {
    setVar("--tilt-x", "0deg");
    setVar("--tilt-y", "0deg");
  };

  const expand = useCallback(() => {
    if (suppressClick.current) return;
    const at = videos.current[active]?.time() ?? 0;
    setDialog({ kind: "video", at });
    track("project_video_open", { project: flagships[active]!.project.slug });
  }, [active, flagships]);

  const closeDialog = useCallback(() => setDialog(null), []);

  const files = videoFiles(current.showcase.video.base);
  const reduced = motion === "reduced";

  return (
    <section
      id="work"
      data-chapter="work"
      data-world={world.id}
      data-world-dark={world.dark ? "" : undefined}
      className={`section ${styles.flagship}`}
      aria-labelledby="work-title"
      style={{ "--n": n } as CSSProperties}
    >
      <div className={styles.fieldHost} aria-hidden="true">
        <WorldField world={world.id as FieldWorld} still={reduced} className={styles.field} />
      </div>
      <noscript>
        <style>{`[data-dossier][hidden]{display:block!important}`}</style>
      </noscript>

      <div className="page sheet">
        <SectionMarker n="01" label="Flagship" note="three demos, recorded on the live apps" />
        <div className="body">
          <h2 id="work-title" className="h-section">
            Flagship systems
          </h2>
          <p className={`lead ${styles.intro}`}>
            Three systems, each with a 25-second demo recorded on the live app. Each answers the same question its own
            way: what should the model not be allowed to decide?
          </p>

      <div className={styles.tabs} role="tablist" aria-label="Flagship systems">
        {flagships.map((f, i) => (
          <button
            key={f.project.slug}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${f.project.slug}`}
            aria-selected={i === active}
            aria-controls={f.project.slug}
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => go(i)}
            onKeyDown={onTabKey}
          >
            <Image src={videoFiles(f.showcase.video.base).thumb} alt="" width={36} height={64} className={styles.tabThumb} />
            <span className={styles.tabN}>{f.project.number}</span>
            <span className={styles.tabTitle}>{f.project.title}</span>
            <span className={styles.tabKind}>{f.showcase.kind}</span>
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <div className={styles.deckCol}>
          <div
            className={styles.deck}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={onPointerLeave}
          >
            {flagships.map((f, i) => {
              const rank = (i - active + n) % n;
              const isFront = rank === 0;
              const vf = videoFiles(f.showcase.video.base);
              return (
                <div
                  key={f.project.slug}
                  ref={isFront ? front : undefined}
                  className={styles.card}
                  data-rank={rank}
                  data-move={move?.card === i ? move.dir : undefined}
                  data-move-key={move?.card === i ? move.key : undefined}
                  aria-hidden={isFront ? undefined : true}
                  onClick={isFront ? undefined : () => go(i)}
                  onAnimationEnd={() => setMove((m) => (m?.card === i ? null : m))}
                >
                  <div className={styles.cardInner}>
                    <p className={styles.exhibit}>
                      <span>Exhibit {f.project.number}</span>
                      <span>{f.project.title}</span>
                    </p>
                    <ProjectVideo
                      ref={(h) => {
                        videos.current[i] = h;
                      }}
                      slug={f.project.slug}
                      title={f.project.title}
                      src={vf.src}
                      poster={vf.poster}
                      active={isFront}
                      suspended={dialog?.kind === "video"}
                      liveDemo={f.project.liveDemo}
                      description={f.showcase.video.description}
                      onTime={isFront ? setTime : undefined}
                      onExpand={expand}
                    />
                    <p className={styles.cardFoot}>
                      <span>{clock(f.showcase.video.duration)}</span>
                      <span>recorded on the live app</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.deckNav}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => go(active - 1)}
              aria-label={`Previous: ${flagships[(active - 1 + n) % n]!.project.title}`}
            >
              <span aria-hidden="true">←</span>
            </button>
            <p className={styles.count} aria-live="polite">
              <span className="visually-hidden">Showing </span>
              {current.project.number} <span aria-hidden="true">/</span>
              <span className="visually-hidden"> of </span> {String(n).padStart(2, "0")}
              <span className="visually-hidden">: {current.project.title}</span>
            </p>
            <button
              type="button"
              className={styles.navBtn}
              onClick={() => go(active + 1)}
              aria-label={`Next: ${flagships[(active + 1) % n]!.project.title}`}
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className={styles.hint} aria-hidden="true">
            Drag the deck, or use ← →
          </p>
        </div>

        <div className={styles.dossiers}>
          {flagships.map((f, i) => {
            const isActive = i === active;
            const p = f.project;
            const s = f.showcase;
            return (
              <article
                key={p.slug}
                id={p.slug}
                role="tabpanel"
                aria-labelledby={`tab-${p.slug}`}
                className={styles.dossier}
                data-dossier=""
                hidden={!isActive}
                tabIndex={-1}
              >
                <p className={styles.dNum}>
                  <span>{p.number}</span> / {s.kind}
                </p>
                <h3 className={styles.dTitle} key={isActive ? `t-${active}` : undefined}>
                  <span>{p.title}</span>
                </h3>
                <p className={styles.dLine}>{s.line}</p>

                <dl className={styles.beats}>
                  <div className={styles.beat}>
                    <dt>Problem</dt>
                    <dd>{p.problem}</dd>
                  </div>
                  <div className={styles.beat}>
                    <dt>Decision</dt>
                    <dd>
                      <strong>{p.decision.title}</strong> {firstSentence(p.decision.body)}
                    </dd>
                  </div>
                  <div className={`${styles.beat} ${styles.beatWide}`}>
                    <dt>System</dt>
                    <dd>
                      <FlowStrip
                        steps={s.flow}
                        time={isActive ? time : null}
                        title={p.title}
                        onSeek={isActive ? (t) => videos.current[i]?.seek(t) : undefined}
                      />
                    </dd>
                  </div>
                  <div className={`${styles.beat} ${styles.beatWide}`}>
                    <dt>Evidence</dt>
                    <dd>
                      <ul className={styles.metrics}>
                        {f.evidence.map((e) => (
                          <li key={e.label} className={styles.metric}>
                            <span className={styles.mValue}>{e.value}</span>
                            <span className={styles.mLabel}>{e.label}</span>
                            <span className={styles.mStatus}>
                              {statusLabel[e.status]} · {e.source}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div className={styles.beat}>
                    <dt>Result</dt>
                    <dd>{s.result}</dd>
                  </div>
                </dl>

                {s.feature ? (
                  <aside className={styles.feature} aria-labelledby={`feature-${p.slug}`}>
                    <div className={styles.featureText}>
                      <p className="meta">Also in {p.title}</p>
                      <h4 id={`feature-${p.slug}`} className={styles.featureTitle}>
                        {s.feature.title}
                      </h4>
                      <p>{s.feature.body}</p>
                      <ol className={styles.routine} aria-label="The routine the miner found">
                        {s.feature.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      <blockquote className={styles.quote}>
                        <p>{s.feature.quote}</p>
                      </blockquote>
                      <p className={styles.featureNote}>{s.feature.note}</p>
                      <button type="button" className="btn" onClick={() => setDialog({ kind: "feature" })}>
                        See the events behind it
                      </button>
                    </div>
                    <Image
                      src={s.feature.card.src}
                      alt={s.feature.card.alt}
                      width={s.feature.card.width}
                      height={s.feature.card.height}
                      className={styles.featureCard}
                    />
                  </aside>
                ) : null}

                <p className={styles.stack} aria-label="Built with">
                  {p.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>

                <div className={styles.links}>
                  {p.liveDemo ? (
                    <a href={p.liveDemo} className="btn btn-solid" target="_blank" rel="noopener" data-track="live_demo_click" data-project={p.slug}>
                      Live demo <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                  <a href={p.repository} className="btn" target="_blank" rel="noopener" data-track="github_click" data-project={p.slug}>
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                  <ViewTransitionLink href={`/work/${p.slug}`} className="btn" data-track="project_open" data-project={p.slug}>
                    Case study <span aria-hidden="true">→</span>
                  </ViewTransitionLink>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <MediaDialog open={dialog !== null} onClose={closeDialog} labelledBy="flagship-dialog-title" wide={dialog?.kind === "feature"}>
        {dialog?.kind === "video" ? (
          <div className={styles.dialogBody}>
            <header className={styles.dialogHead}>
              <h2 id="flagship-dialog-title" className={styles.dialogTitle}>
                <span>{current.project.number}</span> {current.project.title}
              </h2>
              <button type="button" className={styles.close} onClick={closeDialog} aria-label="Close the demo">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <DialogVideo
              src={files.hd}
              poster={files.poster}
              at={dialog.at}
              label={`${current.project.title} demo, with sound. ${current.showcase.video.description}`}
            />
            <p className={styles.dialogNote}>Music only, no narration. Every frame is the live app.</p>
          </div>
        ) : dialog?.kind === "feature" && current.showcase.feature ? (
          <div className={styles.dialogBody}>
            <header className={styles.dialogHead}>
              <h2 id="flagship-dialog-title" className={styles.dialogTitle}>
                {current.project.title} · {current.showcase.feature.title}
              </h2>
              <button type="button" className={styles.close} onClick={closeDialog} aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <Image
              src={current.showcase.feature.detail.src}
              alt={current.showcase.feature.detail.alt}
              width={current.showcase.feature.detail.width}
              height={current.showcase.feature.detail.height}
              sizes="(min-width: 1200px) 1100px, 94vw"
              className={styles.dialogImage}
            />
          </div>
        ) : null}
      </MediaDialog>
        </div>
      </div>
    </section>
  );
}

/** The demo at full resolution, with sound and the browser's own controls. */
function DialogVideo({ src, poster, at, label }: { src: string; poster: string; at: number; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const start = () => {
      if (at > 0.5) v.currentTime = at;
      v.play().catch(() => undefined);
    };
    if (v.readyState >= 1) start();
    else v.addEventListener("loadedmetadata", start, { once: true });
  }, [at]);
  return (
    <video
      ref={ref}
      className={styles.dialogVideo}
      src={src}
      poster={poster}
      controls
      playsInline
      preload="metadata"
      aria-label={label}
    />
  );
}
