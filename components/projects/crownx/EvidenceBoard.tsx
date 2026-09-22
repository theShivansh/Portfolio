"use client";

import { startTransition, useState, ViewTransition } from "react";
import { play } from "@/lib/sound";
import { injection, question, sources, type Source } from "./data";
import styles from "./crownx.module.css";

const checks = [
  "same fact: submission_deadline",
  "same type: date",
  "different documents",
  "both values normalized",
  "different normalized values",
];

/**
 * The evidence table. Elements carry data-at="n" so the surrounding
 * ScrollStory reveals them one step at a time. Citation chips open the
 * cited passage in place with a view transition; nothing else moves.
 */
export function EvidenceBoard() {
  const [open, setOpen] = useState<Source["id"] | null>(null);

  const cite = (id: Source["id"]) => {
    play("tick");
    startTransition(() => setOpen((cur) => (cur === id ? null : id)));
  };

  const opened = sources.find((s) => s.id === open);

  const chip = (id: Source["id"]) => (
    <button
      type="button"
      className={styles.chip}
      aria-expanded={open === id}
      aria-controls="crownx-passage"
      onClick={() => cite(id)}
      data-cursor="inspect"
      aria-label={`Citation ${id}: ${sources[id - 1]?.doc}`}
      key={id}
    >
      {id}
    </button>
  );

  return (
    <div className={styles.board}>
      <div className={styles.question} data-at="1">
        <span className={styles.kbd}>Ctrl K</span>
        <span className={styles.q}>{question}</span>
      </div>

      <ol className={styles.sources}>
        {sources.map((s) => (
          <li key={s.id} className={styles.source} data-at="1" data-cited={open === s.id || undefined} data-id={s.id}>
            <p className={styles.sourceHead}>
              <span className={styles.sourceN}>[{s.id}]</span>
              <span>{s.doc}</span>
            </p>
            <p className={styles.sourceDate}>
              <time dateTime={s.isoDate}>{s.date}</time> · {s.file}
            </p>
            <blockquote className={styles.passage}>
              {s.passage.split(s.value).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 ? <mark className={styles.value}>{s.value}</mark> : null}
                </span>
              ))}
            </blockquote>
            <p className={styles.claim} data-at="2">
              <span>value</span> <code>{s.normalized}</code>
            </p>
            <p className={styles.recency} data-at="4" data-current={s.id !== 1 || undefined}>
              {s.id === 1 ? "older source" : s.id === 3 ? "newest source date" : "newer source"}
            </p>
          </li>
        ))}
      </ol>

      <p className={styles.flag} data-at="2">
        <span className={styles.flagDot} aria-hidden="true" />
        Sources disagree <span className={styles.flagBy}>flagged by code, not the model</span>
      </p>

      <div className={styles.row}>
        <div className={styles.panel} data-at="3">
          <p className="meta">Conflict predicate · code</p>
          <ul className={styles.checks}>
            {checks.map((c) => (
              <li key={c}>
                <span aria-hidden="true">✓</span> {c}
              </li>
            ))}
          </ul>
          <p className={styles.small}>
            [2] “22 Sept” and [3] “2026-09-22” normalize to the same date. That pair is never a conflict.
          </p>
        </div>

        <div className={styles.panel} data-at="4">
          <p className="meta">Selection rule · first that applies</p>
          <ol className={styles.rules}>
            <li data-applied>Newest source date</li>
            <li>Version order</li>
            <li>Latest upload (weakest)</li>
          </ol>
          <div className={styles.timeline} aria-label="Value timeline: 20 September in the brief of 31 August, 22 September from 10 September onward">
            <span className={styles.tOld}>20 Sep</span>
            <span className={styles.tDash} aria-hidden="true" />
            <span className={styles.tNew}>22 Sep</span>
            <span className={styles.tLine} aria-hidden="true" />
            <span className={styles.tNew}>22 Sep</span>
          </div>
          <p className={styles.current}>
            Current value <strong>22 Sep 2026</strong>
          </p>
        </div>
      </div>

      <div className={styles.answer} data-at="5">
        <p className="meta">Answer · gpt-oss-120b over exactly these passages</p>
        <p className={styles.answerText}>
          The current submission deadline is 22 September 2026 {chip(2)}
          {chip(3)}. The original brief gave 20 September {chip(1)}.
        </p>

        <ViewTransition enter="swap" exit="swap" default="none">
          {opened ? (
            <div id="crownx-passage" key={opened.id} className={styles.expanded} role="region" aria-label={`Passage from ${opened.doc}`}>
              <p className={styles.expandedHead}>
                [{opened.id}] {opened.doc} · <time dateTime={opened.isoDate}>{opened.date}</time>
              </p>
              {opened.context.map((line) => (
                <p key={line} className={line.includes(opened.value) ? styles.hit : styles.ctx}>
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <p id="crownx-passage" className={styles.hint}>
              Open a citation to read its passage in place.
            </p>
          )}
        </ViewTransition>

        <dl className={styles.audit}>
          <div>
            <dt>evidence</dt>
            <dd>3 passages cited, 0 dropped</dd>
          </div>
          <div>
            <dt>status</dt>
            <dd>conflict</dd>
          </div>
          <div>
            <dt>treated as data</dt>
            <dd>“{injection}”</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
