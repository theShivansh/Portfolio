/**
 * The universe layer: the material that turns seven repositories into one
 * connected body of work. Boundaries, failures, experiments, external
 * results, and the map that links them.
 *
 * Same source-of-truth rule as lib/projects.ts: every line here is copied
 * from a repository README, an ADR, a benchmark log, or a role in
 * lib/experience.ts. Nothing is rounded up and nothing is invented.
 */

/* ─────────────────────────────────────────────────────────
   01 — What the model is not allowed to decide
   ───────────────────────────────────────────────────────── */

export type Boundary = {
  id: string;
  /** The thing being decided, in one word. */
  subject: string;
  /** Who decides it instead of the model. */
  owner: string;
  /** The rule, stated plainly. */
  rule: string;
  /** The actual mechanism in the codebase. */
  mechanism: string;
  where: { label: string; slug: string };
  source: string;
};

export const boundaries: Boundary[] = [
  {
    id: "truth",
    subject: "Truth",
    owner: "the database",
    rule: "A model reading a photo produces a proposal, never a fact.",
    mechanism:
      "Vision output is written with a per-field confidence and a source. When you say the shirt is navy, the row is rewritten with source = user_corrected, and that is what every later query reads.",
    where: { label: "StyleLab", slug: "stylelab" },
    source: "wardrobe schema · vision extraction",
  },
  {
    id: "ownership",
    subject: "Ownership",
    owner: "user-scoped SQL",
    rule: "The model may only choose between clothes you actually own.",
    mechanism:
      "Candidates are retrieved by user_id-scoped SQL before the crew runs, and the result is re-validated against the same scope afterwards. An item id that is not yours is a hard failure, not a warning.",
    where: { label: "StyleLab", slug: "stylelab" },
    source: "ownership validation",
  },
  {
    id: "arithmetic",
    subject: "Arithmetic",
    owner: "deterministic engines",
    rule: "Numbers are computed, not generated.",
    mechanism:
      "A 1,200-path log-normal Monte Carlo engine produces the P10 / P50 / P90 bands, and an FY 2026-27 two-regime tax engine produces the liability. The model is handed the output and asked to explain it.",
    where: { label: "MoneyMentor AI", slug: "moneymentor-ai" },
    source: "Monte Carlo and tax engines",
  },
  {
    id: "conflict",
    subject: "Conflict",
    owner: "a code predicate",
    rule: "Whether two documents disagree is decided before any model call.",
    mechanism:
      "Same fact, same type, different documents, different normalized values. The current value follows the first written rule that applies: newest source date, then version order, then latest upload, which is the weakest rule and is labelled as such on screen.",
    where: { label: "CROWN-X", slug: "crown-x" },
    source: "conflict detection",
  },
  {
    id: "citations",
    subject: "Citations",
    owner: "finalize()",
    rule: "A sentence citing a passage nobody retrieved does not ship.",
    mechanism:
      "The model returns a structured draft. finalize() checks every claim's citation against the retrieved set and drops the ones that do not match. A fluent, confident, well-formatted answer can still lose half its sentences.",
    where: { label: "CROWN-X", slug: "crown-x" },
    source: "finalize() · citation validation",
  },
  {
    id: "instructions",
    subject: "Instructions",
    owner: "a pre-filter",
    rule: "Text found inside a document is data. It is never a command.",
    mechanism:
      "A rule-based security pass runs before the council, in about a millisecond, and a second pass redacts PII on the way out. In CROWN-X, a claim supported only by a passage addressed to an assistant is dropped like any other uncited claim.",
    where: { label: "ACHP", slug: "achp" },
    source: "security pre-filter, in and out",
  },
];

/* ─────────────────────────────────────────────────────────
   02 — What broke
   ───────────────────────────────────────────────────────── */

export type FlightRecord = {
  id: string;
  system: string;
  slug: string;
  date: string;
  /** The headline, in the language of the bug. */
  failure: string;
  expected: string;
  observed: string;
  response: string;
  result: string;
  source: string;
};

/** Each one changed an architecture. */
export const flightRecords: FlightRecord[] = [
  {
    id: "REC-01",
    system: "CROWN-X",
    slug: "crown-x",
    date: "Sep 2026",
    failure: "A benchmark that hid its own errors",
    expected: "63 live retrieval queries scored, or a run that fails loudly.",
    observed: "19 of the 63 were silently lost to the project's own rate limits. The harness still printed a score.",
    response: "Those numbers were thrown away rather than published with a footnote.",
    result: "The harness now fails on any error. A benchmark is trustworthy or it is absent.",
    source: "docs/BENCHMARKS.md",
  },
  {
    id: "REC-02",
    system: "CROWN-X",
    slug: "crown-x",
    date: "Sep 2026",
    failure: "The conflict detector that flagged everything",
    expected: "Conflicts surfaced on the questions where they change the answer.",
    observed:
      "A conflict was attached whenever a conflicting passage was retrieved. Status accuracy fell from 0.825 to 0.275.",
    response:
      "Detecting a conflict and deciding whether it matters to this question were separated. A conflict card now also needs the question to name the fact.",
    result: "A conflict can be missed. A conflict is never invented.",
    source: "docs/BENCHMARKS.md",
  },
  {
    id: "REC-03",
    system: "MoneyMentor AI",
    slug: "moneymentor-ai",
    date: "2025",
    failure: "LangGraph parallel state",
    expected: "Four specialists fanning out across a parallel graph, then merging.",
    observed: "Stateful parallel edges raised an unpacking error at the join.",
    response: "Agents were rewritten as pure functions of (state, client) with no UI calls, run on a ThreadPoolExecutor.",
    result: "True fan-out, and the interface updates only after every future resolves.",
    source: "README · System architecture",
  },
  {
    id: "REC-04",
    system: "CROWN-X",
    slug: "crown-x",
    date: "Sep 2026",
    failure: "Fragments outranked the workflows",
    expected: "Whole routines mined out of the document set, ranked above their own parts.",
    observed: "Precision 0.4. Pieces of real routines outranked the routines themselves.",
    response: "A fragment rule drops any sub-sequence with no support of its own (ADR-022).",
    result: "Precision 1.0.",
    source: "docs/BENCHMARKS.md · ADR-022",
  },
  {
    id: "REC-05",
    system: "CROWN-X",
    slug: "crown-x",
    date: "Sep 2026",
    failure: "Listing a model is not calling it",
    expected: "Bedrock inference on a fresh AWS account, on day one of a four-day build.",
    observed: "The account could list foundation models. Every inference call was denied while it was still being verified.",
    response: "A provider interface was written that same day rather than waiting on the account.",
    result: "Groq in production, Bedrock one configuration switch away.",
    source: "README · AWS architecture",
  },
  {
    id: "REC-06",
    system: "MoneyMentor AI",
    slug: "moneymentor-ai",
    date: "2025",
    failure: "413 at the join",
    expected: "The supervisor merging four specialist reports into one plan.",
    observed: "Four full reports in one prompt exceeded the payload limit. 413.",
    response: "Each report is capped at 280 characters before the supervisor ever sees it.",
    result: "The merge stopped failing, and the specialists kept their full output for the interface.",
    source: "README · System architecture",
  },
  {
    id: "REC-07",
    system: "ACHP",
    slug: "achp",
    date: "2026",
    failure: "Two cases that still do not pass",
    expected: "Seven narrative-integrity cases above their thresholds.",
    observed: "Five pass. Propaganda and conspiracy framing score below threshold.",
    response: "The thresholds were left where they were.",
    result: "Reported as 5 / 7 on the project page, in the README, and here. Not tuned away.",
    source: "README · NIL test suite",
  },
];

/* ─────────────────────────────────────────────────────────
   03 — The lab: measured, then decided
   ───────────────────────────────────────────────────────── */

export type Experiment = {
  id: string;
  title: string;
  system: string;
  slug: string;
  hypothesis: string;
  result: string;
  cost: string;
  /** Was the gate set in advance met? */
  gate: "passed" | "failed";
  gateNote: string;
  decision: string;
  shipped: boolean;
  source: string;
};

export const experiments: Experiment[] = [
  {
    id: "EXP-017",
    title: "Cross-encoder reranker",
    system: "CROWN-X",
    slug: "crown-x",
    hypothesis: "Reranking the fused candidate set will put the right passage first more often.",
    result: "It did. MRR rose from 0.694 to 0.864.",
    cost: "p95 latency past the budget, and recall@8, the number the model actually reads, did not move.",
    gate: "failed",
    gateNote: "+150 ms p95, set before the run",
    decision: "Built, benchmarked, kept off in production.",
    shipped: false,
    source: "ADR-017 · docs/BENCHMARKS.md",
  },
  {
    id: "EXP-RRF",
    title: "Hybrid retrieval, fused",
    system: "CROWN-X",
    slug: "crown-x",
    hypothesis: "Keyword and vector search fail on different queries, so fusing them should beat either alone.",
    result: "BM25 and k-NN fused with reciprocal rank fusion at k = 60, top 8. Recall@8 of 0.950 on the deployed stack.",
    cost: "Two indexes to keep in step, and embeddings that had to run inside the Lambda to stay in budget.",
    gate: "passed",
    gateNote: "recall@8 measured on the live stack",
    decision: "Shipped. It is the retrieval layer.",
    shipped: true,
    source: "docs/BENCHMARKS.md",
  },
  {
    id: "EXP-ABL",
    title: "Ablate every agent",
    system: "StyleLab",
    slug: "stylelab",
    hypothesis: "Some of the seven roles in the crew are not changing the answer.",
    result: "An 11-test ablation suite removes each role in turn and compares the output.",
    cost: "A suite that has to be re-run whenever a prompt changes.",
    gate: "passed",
    gateNote: "a role stays only if removing it changes the result",
    decision: "The crew is the smallest set that still changes the answer, and it has to keep proving that.",
    shipped: true,
    source: "README · Engineering evidence",
  },
  {
    id: "EXP-DEG",
    title: "The degradation ladder",
    system: "StyleLab",
    slug: "stylelab",
    hypothesis: "A shallower answer is better than a confident one that is not grounded.",
    result:
      "Five rungs: full crew, crew without Trend Scout, Architect and Editor only, a deterministic ranker, then an honest statement of what the wardrobe is missing.",
    cost: "Five paths to keep tested instead of one.",
    gate: "passed",
    gateNote: "no rung may invent an item you do not own",
    decision: "Shipped. AI failure never becomes hallucinated inventory.",
    shipped: true,
    source: "README · Graceful degradation",
  },
  {
    id: "EXP-CACHE",
    title: "Semantic cache on repeat queries",
    system: "Technology Mindz",
    slug: "",
    hypothesis: "Enterprise users ask the same question in different words, so inference can often be skipped.",
    result: "Inference latency fell by 35%, measured with a Python A/B evaluation harness rather than by feel.",
    cost: "A staleness window to choose, and a cache to invalidate when source documents change.",
    gate: "passed",
    gateNote: "measured A/B, not a stopwatch",
    decision: "Shipped to a pipeline serving 10,000+ queries a day.",
    shipped: true,
    source: "Role: AI Developer, Technology Mindz",
  },
];

/* ─────────────────────────────────────────────────────────
   04 — External results
   ───────────────────────────────────────────────────────── */

export type Achievement = {
  id: string;
  /** What was won or reached. */
  award: string;
  event: string;
  year: string;
  /** The size of the field, where it is publicly known. */
  field?: string;
  line: string;
};

export const achievements: Achievement[] = [
  {
    id: "amazon-ml",
    award: "Top 1%",
    event: "Amazon ML Challenge",
    year: "2026",
    field: "8,358 teams · 27,745 participants",
    line: "A ranked machine-learning problem, scored on a held-out private leaderboard rather than on a demo.",
  },
  {
    id: "flipkart-grid",
    award: "Semi-finalist",
    event: "Flipkart GRiD 8.0",
    year: "2026",
    field: "national · three tracks",
    line: "The round where you are handed a real Flipkart problem and submit working code for their engineers to read.",
  },
  {
    id: "appsheet",
    award: "Winner",
    event: "Google AppSheet no-code challenge",
    year: "2023",
    line: "The first thing I shipped to a deadline, built before I could have written the backend for it.",
  },
];

/* ─────────────────────────────────────────────────────────
   05 — The map
   ───────────────────────────────────────────────────────── */

/** The artifact drawn on each node. One per system, taken from what it does. */
export type Glyph = "garment" | "document" | "claim" | "fan" | "curve" | "stack" | "index";

export type MapNode = {
  slug: string;
  glyph: Glyph;
  /** What the artifact on the node is. */
  artifact: string;
  /** Percentage position on the desktop stage. */
  x: number;
  y: number;
};

export const mapNodes: MapNode[] = [
  { slug: "crown-x", glyph: "document", artifact: "two dates that disagree", x: 50, y: 11 },
  { slug: "stylelab", glyph: "garment", artifact: "a garment, half read", x: 15, y: 30 },
  { slug: "achp", glyph: "claim", artifact: "a claim under attack", x: 85, y: 28 },
  { slug: "zenstep", glyph: "stack", artifact: "clutter, cut into steps", x: 15, y: 63 },
  { slug: "moneymentor-ai", glyph: "fan", artifact: "a distribution, not a number", x: 85, y: 61 },
  { slug: "vitosynth", glyph: "curve", artifact: "a response over four hours", x: 50, y: 82 },
  { slug: "aixplorer", glyph: "index", artifact: "a list of other people's tools", x: 85, y: 90 },
];

export type MapEdge = {
  a: string;
  b: string;
  label: string;
  /** technique: the same engineering is in both. lineage: one led to the other. */
  kind: "technique" | "lineage";
};

export const mapEdges: MapEdge[] = [
  { a: "crown-x", b: "achp", label: "hybrid retrieval, BM25 + dense", kind: "technique" },
  { a: "crown-x", b: "stylelab", label: "validation gates on model output", kind: "technique" },
  { a: "stylelab", b: "achp", label: "many roles, one bounded graph", kind: "technique" },
  { a: "stylelab", b: "zenstep", label: "vision to typed JSON", kind: "technique" },
  { a: "zenstep", b: "vitosynth", label: "the protocol drives the interface", kind: "technique" },
  { a: "vitosynth", b: "moneymentor-ai", label: "simulate first, explain after", kind: "technique" },
  { a: "moneymentor-ai", b: "achp", label: "parallel specialists, one synthesiser", kind: "technique" },
  { a: "aixplorer", b: "moneymentor-ai", label: "where it started", kind: "lineage" },
];
