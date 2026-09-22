"use client";

import { startTransition, useState, ViewTransition } from "react";
import { play } from "@/lib/sound";
import styles from "./achp.module.css";

/**
 * Case 2 from the ACHP README ("Exercise & cardiovascular disease"),
 * produced by run_pipeline_tests.py in offline mode with mock LLM agents.
 * Shown as an example of the report's shape, not a live verdict.
 */
const claim = "Regular exercise reduces the risk of cardiovascular disease by approximately 30 to 40 percent.";

type BranchId = "a" | "b" | "nil";

const branches: { id: BranchId; name: string; role: string; summary: string; detail: string[]; model: string }[] = [
  {
    id: "a",
    name: "Adversary A",
    role: "Factual attacker",
    summary: "factual_score 0.88 · contested",
    detail: ["Some meta-analyses suggest benefits near 35%, not exactly 30–40%.", "Benefits vary by exercise type, intensity and individual risk profile."],
    model: "gpt-oss-120b, fallback llama-3.3-70b",
  },
  {
    id: "b",
    name: "Adversary B",
    role: "Narrative auditor",
    summary: "stance: partial",
    detail: ["Missing: cardiologists. Benefits depend heavily on exercise type.", "Missing: sedentary control groups. Baseline methodology varies."],
    model: "gpt-oss-120b, fallback llama-3.3-70b",
  },
  {
    id: "nil",
    name: "NIL",
    role: "Narrative integrity, 5 sub-agents",
    summary: "mildly_biased · BIS 0.119",
    detail: ["Sentiment (VADER + LLM) · Bias (10 axes) · Perspective · Framing (cosine) · Confidence synthesis", "Runs its five sub-agents concurrently; wall time is the slowest one."],
    model: "several, with heuristic fallbacks",
  },
];

const metrics = [
  { k: "CTS", name: "Consensus truth", v: 0.853 },
  { k: "PCS", name: "Perspective completeness", v: 0.757 },
  { k: "BIS", name: "Bias impact (lower is better)", v: 0.119 },
  { k: "NSS", name: "Narrative stance", v: 0.955 },
  { k: "EPS", name: "Epistemic position", v: 0.709 },
];

export function AchpPipeline() {
  const [open, setOpen] = useState<BranchId | null>(null);

  const toggle = (id: BranchId) => {
    play("tick");
    startTransition(() => setOpen((cur) => (cur === id ? null : id)));
  };

  return (
    <div className={styles.dag} data-open={open ?? undefined}>
      <div className={styles.claim} data-at="1">
        <p className="meta">Claim</p>
        <p className={styles.claimText}>“{claim}”</p>
        <p className={styles.gate}>
          <span aria-hidden="true">■</span> Security pre-filter · rule-based · pass
        </p>
      </div>

      <div className={styles.pair}>
        <div className={styles.card} data-at="2">
          <p className={styles.cardName}>Retriever</p>
          <p className={styles.cardRole}>BM25 + FAISS, web fallback, 3-tier semantic cache</p>
        </div>
        <span className={styles.hArrow} aria-hidden="true" data-at="3" />
        <div className={styles.card} data-at="3">
          <p className={styles.cardName}>Proposer</p>
          <p className={styles.cardRole}>
            Atomic claim: <em>“Exercise reduces CVD risk”</em> · verifiable
          </p>
        </div>
      </div>

      <div className={styles.fork} data-at="4" aria-hidden="true">
        <span>asyncio.gather()</span>
      </div>

      <ul className={styles.branches} data-at="4" aria-label="Parallel branches">
        {branches.map((b) => {
          const isOpen = open === b.id;
          return (
            <li key={b.id} className={styles.branch} data-open={isOpen || undefined} data-dim={(open && !isOpen) || undefined}>
              <button
                type="button"
                className={styles.branchButton}
                aria-expanded={isOpen}
                aria-controls={`achp-branch-${b.id}`}
                onClick={() => toggle(b.id)}
                data-cursor="inspect"
              >
                <span className={styles.cardName}>{b.name}</span>
                <span className={styles.cardRole}>{b.role}</span>
                <span className={styles.summary}>{b.summary}</span>
              </button>
              <ViewTransition enter="swap" exit="swap" default="none">
                {isOpen ? (
                  <div id={`achp-branch-${b.id}`} className={styles.branchDetail}>
                    <ul>
                      {b.detail.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    <p className="mono">{b.model}</p>
                  </div>
                ) : null}
              </ViewTransition>
            </li>
          );
        })}
      </ul>

      <div className={styles.judge} data-at="5">
        <div className={styles.verdict}>
          <p className="meta">Judge</p>
          <p className={styles.verdictText}>MOSTLY_TRUE</p>
          <p className="mono">confidence 0.91 · composite 0.831</p>
        </div>
        <dl className={styles.metrics}>
          {metrics.map((m) => (
            <div key={m.k} className={styles.metric}>
              <dt title={m.name}>
                {m.k}
                <span className="visually-hidden"> ({m.name})</span>
              </dt>
              <dd>
                <span className={styles.bar} aria-hidden="true">
                  <span style={{ width: `${m.v * 100}%` }} />
                </span>
                <span className="mono">{m.v.toFixed(3)}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className={styles.report} data-at="6">
        <span aria-hidden="true">■</span> Security post-filter: PII redaction · report streamed over SSE · export JSON / PDF
      </p>
    </div>
  );
}
