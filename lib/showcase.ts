import { primaryProjects } from "./projects";
import type { EvidenceItem, NodeKind, Project } from "./types";

/**
 * The three flagship demos, and what the page says around them.
 *
 * The videos are the projects' own 25-second demos, recorded on the live
 * apps. Times below are read off the videos themselves, so a step lights,
 * and a chapter seeks, at the moment that step is actually on screen.
 *
 * Every number shown next to a video is looked up from the project's own
 * evidence list by label, never retyped here, so the showcase cannot drift
 * from the case file.
 */

export type FlowStep = {
  label: string;
  detail: string;
  /** Seconds into the demo where this step is on screen. */
  at: number;
  kind: NodeKind;
  /** Branches that run in parallel inside this one step. */
  lanes?: string[];
};

export type ShowcaseFeature = {
  title: string;
  body: string;
  /** The routine the miner found, step by step. */
  steps: string[];
  /** The card's own wording, quoted exactly. */
  quote: string;
  note: string;
  card: { src: string; alt: string; width: number; height: number };
  detail: { src: string; alt: string; width: number; height: number };
};

export type ShowcaseVideo = {
  /** /videos/<slug>-v<n>; files are <base>.mp4, <base>-hd.mp4, <base>.webp, <base>-thumb.webp */
  base: string;
  duration: number;
  /** Published date of this cut, for structured data. */
  uploaded: string;
  /** What the demo shows, for screen readers and search. */
  description: string;
};

export type Showcase = {
  slug: string;
  /** The one line a visitor should leave with. */
  line: string;
  /** Short label for the card and the deck tab. */
  kind: string;
  video: ShowcaseVideo;
  flow: FlowStep[];
  /** Labels from the project's evidence list. */
  evidence: string[];
  result: string;
  feature?: ShowcaseFeature;
};

const showcases: Showcase[] = [
  {
    slug: "achp",
    line: "Seven agents challenge a claim before the system writes a verdict.",
    kind: "Adversarial verification",
    video: {
      base: "/videos/achp-v1",
      duration: 25,
      uploaded: "2026-10-08",
      description:
        "A forwarded health claim is checked on the live ACHP app: the security gatekeeper clears it, retrieval pins five sources, a fact challenger, a narrative auditor and a framing lens run in parallel, and the judge marks the claim contradicted with five formula scores and its sources.",
    },
    flow: [
      { label: "Claim", detail: "the message you were forwarded", at: 3.5, kind: "io" },
      { label: "Security prefilter", detail: "rule-based, before any model", at: 6, kind: "gate" },
      {
        label: "Parallel adversaries",
        detail: "run under asyncio.gather",
        at: 7.5,
        kind: "model",
        lanes: ["Adversary A", "Adversary B", "NIL"],
      },
      { label: "Judge", detail: "verdict + five formula scores", at: 9.5, kind: "model" },
      { label: "Verdict", detail: "contradicted, with its sources", at: 17, kind: "io" },
    ],
    evidence: ["Parallel stage {A ‖ B ‖ NIL}, mean", "Formula-defined metrics", "NIL test suite"],
    result:
      "Live. A verdict arrives with the five scores and the sources behind it. The two NIL cases that still miss stay in the suite.",
  },
  {
    slug: "crown-x",
    line: "Every sentence cites its passage.",
    kind: "Evidence-first retrieval",
    video: {
      base: "/videos/crown-x-v1",
      duration: 24.6,
      uploaded: "2026-10-08",
      description:
        "On the deployed CROWN-X stack, a question about a submission deadline finds two documents that disagree. The answer cites every sentence, code flags the conflict before the model runs, and the timeline shows which source is current and why.",
    },
    flow: [
      { label: "Documents", detail: "each with its own date", at: 3.5, kind: "store" },
      { label: "Retrieval", detail: "BM25 + k-NN, RRF, top 8", at: 5, kind: "code" },
      { label: "Conflict detection", detail: "code, before any model call", at: 6, kind: "gate" },
      { label: "Answer", detail: "drafted by the model", at: 9.5, kind: "model" },
      { label: "Citation validation", detail: "uncited claims dropped", at: 10.5, kind: "gate" },
      { label: "Verified result", detail: "current value + the rule that chose it", at: 15.5, kind: "io" },
    ],
    evidence: [
      "Contradiction precision / recall",
      "Retrieval recall@8, deployed",
      "Golden set: pass rate / value match",
    ],
    result:
      "Deployed on AWS, built solo in four days for AWS First Commit 2026. Three days of traffic cost $1.86 before credits.",
    feature: {
      title: "Workflow Learning",
      body: "Detects repeated step sequences in the workspace and shows the exact events behind each one. You can save or dismiss it, and nothing ever runs automatically.",
      steps: ["Ask", "Read", "Inspect conflict", "Open timeline", "Open passage", "Copy answer"],
      quote: "Finished 3 of the 12 times it started with “ask a question”",
      note: "After the team ran this routine three times, the miner suggested it as a workflow. The card shows a count, never a bare percentage, and the detail view lists the exact events that matched. Code counts; the model only suggests a name.",
      card: {
        src: "/images/projects/crownx-workflow-learning-card.webp",
        alt: "Workflow card: Answer Review Workflow, six steps from ask a question to copy the answer, seen 3 times, with Save workflow and Dismiss buttons",
        width: 231,
        height: 435,
      },
      detail: {
        src: "/images/projects/crownx-workflow-detail-dialog.webp",
        alt: "Workflow detail: seen 3 times in one session, finished 3 of the 12 times it started with ask a question, nothing runs automatically, and the three matched occurrences listed event by event with timestamps",
        width: 1440,
        height: 900,
      },
    },
  },
  {
    slug: "stylelab",
    line: "The model proposes. The database decides. The user corrects.",
    kind: "Wardrobe intelligence",
    video: {
      base: "/videos/stylelab-v1",
      duration: 25,
      uploaded: "2026-10-08",
      description:
        "Three real garment photos are uploaded to the live StyleLab app. Every extracted field is marked as a guess, a wrong one is corrected by the user, an outfit is composed only from owned garments, and a swap is refused because there is nothing in the wardrobe to swap to.",
    },
    flow: [
      { label: "Upload", detail: "one job per garment", at: 4.5, kind: "io" },
      { label: "Vision", detail: "fields read from the photo", at: 6.5, kind: "model" },
      { label: "Confidence", detail: "every guess marked as a guess", at: 7.5, kind: "code" },
      { label: "User correction", detail: "your answer sticks", at: 9, kind: "human" },
      { label: "Validated wardrobe", detail: "user-scoped SQL", at: 11, kind: "store" },
      { label: "Outfit", detail: "only from garments you own", at: 12, kind: "gate" },
    ],
    evidence: ["Backend tests (pytest)", "Refusal-harness scenarios", "Adversarial AI evaluation cases"],
    result:
      "Live. When the wardrobe can't support a swap it says so instead of inventing a garment, and 19 of 19 refusal checks hold.",
  },
];

export type Flagship = {
  project: Project;
  showcase: Showcase;
  evidence: EvidenceItem[];
};

/** Flagships in showcase order, joined to their project records. */
export const flagships: Flagship[] = showcases.map((s) => {
  const project = primaryProjects.find((p) => p.slug === s.slug);
  if (!project) throw new Error(`showcase: no primary project "${s.slug}"`);
  const evidence = s.evidence.map((label) => {
    const item = project.evidence.find((e) => e.label === label);
    if (!item) throw new Error(`showcase: "${s.slug}" has no evidence labelled "${label}"`);
    return item;
  });
  return { project, showcase: s, evidence };
});

export const videoFiles = (base: string) => ({
  src: `${base}.mp4`,
  hd: `${base}-hd.mp4`,
  poster: `${base}.webp`,
  thumb: `${base}-thumb.webp`,
});

/** "0:07" from 7.5 */
export const clock = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;
