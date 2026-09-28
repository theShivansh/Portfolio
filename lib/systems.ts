/**
 * The three kinds of system, each as the pipeline it actually is.
 *
 * The point of putting them side by side is that the shapes differ: in
 * perception the checks come after the model, in reasoning they come both
 * before and after, and in simulation the model is last and only narrates.
 * Every station is taken from a project in lib/projects.ts.
 */

export type StationRole = "io" | "model" | "code" | "gate" | "human";

export type Station = {
  role: StationRole;
  name: string;
  detail: string;
};

export type SystemKind = {
  id: string;
  n: string;
  title: string;
  /** One line: what this kind of system is for. */
  line: string;
  /** The engineering decision the pipeline exists to enforce. */
  decision: string;
  /** Why that decision, in the reading column. */
  body: string;
  stations: Station[];
  projects: { label: string; slug: string }[];
};

export const roleLabel: Record<StationRole, string> = {
  io: "In / out",
  model: "Model",
  code: "Code",
  gate: "Gate",
  human: "Human",
};

export const systemKinds: SystemKind[] = [
  {
    id: "perception",
    n: "01",
    title: "Perception",
    line: "Turn a photograph into data a system can check, and show where the model is unsure.",
    decision: "AI ranks. Software owns truth.",
    body: "A vision model is good at reading a garment and bad at knowing whose garment it is. So its output is a proposal carrying a confidence per field, your correction overwrites it, and the wardrobe itself — user-scoped SQL — decides what may appear in an outfit. The checks sit after the model, because the model is the first step, not the last one.",
    stations: [
      { role: "io", name: "Photo", detail: "one independent job per garment" },
      { role: "model", name: "Vision model", detail: "a proposal, with a confidence per field" },
      { role: "human", name: "Your correction", detail: "source = user_corrected, and it wins" },
      { role: "code", name: "Owned candidates", detail: "user_id-scoped SQL, before the crew runs" },
      { role: "gate", name: "Validation", detail: "schema, then business rules, then ownership" },
      { role: "io", name: "Outfit", detail: "nothing in it that you do not own" },
    ],
    projects: [
      { label: "StyleLab", slug: "stylelab" },
      { label: "ZenStep", slug: "zenstep" },
    ],
  },
  {
    id: "reasoning",
    n: "02",
    title: "Reasoning",
    line: "Retrieve, argue, cite. Nothing reaches the reader without a source.",
    decision: "The model writes last, and only what code can cite.",
    body: "Here the shape changes. Retrieval and conflict detection are deterministic and happen before any model call, so whether two documents disagree is never a matter of opinion. The model drafts over exactly the retrieved passages, and finalize() deletes any sentence pointing at a passage nobody retrieved. A fluent answer can still lose half of itself.",
    stations: [
      { role: "io", name: "Question", detail: "asked against one workspace of documents" },
      { role: "code", name: "Hybrid retrieval", detail: "BM25 + k-NN, fused with RRF at k = 60" },
      { role: "gate", name: "Conflict check", detail: "a predicate, before any model call" },
      { role: "model", name: "Draft", detail: "gpt-oss-120b, into a structured answer" },
      { role: "gate", name: "finalize()", detail: "drops every claim it cannot match to a passage" },
      { role: "io", name: "Answer", detail: "each sentence carries the passage it came from" },
    ],
    projects: [
      { label: "CROWN-X", slug: "crown-x" },
      { label: "ACHP", slug: "achp" },
    ],
  },
  {
    id: "simulation",
    n: "03",
    title: "Simulation + action",
    line: "Let code compute the numbers, then turn them into a next step.",
    decision: "Numbers are computed. The model only narrates them.",
    body: "A language model should never be asked to do arithmetic that has to be right. The distribution comes from 1,200 log-normal paths and the liability from a two-regime tax engine, both in code. Only then do the specialists run, and what they produce is a typed protocol the interface can render — not prose that has to be parsed back.",
    stations: [
      { role: "io", name: "Your situation", detail: "income, expenses, goal, horizon" },
      { role: "code", name: "Monte Carlo", detail: "1,200 log-normal paths → P10 / P50 / P90" },
      { role: "code", name: "Tax engine", detail: "FY 2026-27, both regimes, deterministic" },
      { role: "model", name: "Specialists", detail: "four in parallel, then one supervisor" },
      { role: "gate", name: "Typed protocol", detail: "strict JSON the interface can render" },
      { role: "io", name: "A next step", detail: "30 / 60 / 90 days, or the next two minutes" },
    ],
    projects: [
      { label: "MoneyMentor AI", slug: "moneymentor-ai" },
      { label: "VitoSynth", slug: "vitosynth" },
      { label: "ZenStep", slug: "zenstep" },
    ],
  },
];
