import type { LabNote, Principle, ProofRow } from "./types";

export const capabilities = [
  {
    n: "01",
    title: "Perception",
    items: ["Vision", "Grounding", "Uncertainty", "Human correction"],
    line: "Turn photos into data a system can check, and show where the model is unsure.",
    projects: ["stylelab", "zenstep"],
  },
  {
    n: "02",
    title: "Reasoning",
    items: ["RAG", "Multi-agent orchestration", "Adversarial evaluation", "Evidence"],
    line: "Retrieve, argue, cite. Nothing reaches the user without a source.",
    projects: ["crown-x", "achp"],
  },
  {
    n: "03",
    title: "Simulation + action",
    items: ["Monte Carlo", "Digital twins", "Optimization", "Behavioral intervention"],
    line: "Let code compute the numbers, then turn them into a next step.",
    projects: ["moneymentor-ai", "vitosynth", "zenstep"],
  },
] as const;

export const builtWith = [
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "FastAPI",
  "AWS",
  "PostgreSQL",
  "Groq",
  "OpenSearch",
  "CrewAI",
] as const;

export const principles: Principle[] = [
  {
    n: "01",
    title: "Model ≠ system",
    body: "A model is one component. Retrieval, validation, state and interface decide whether its output is useful.",
    where: "Every project here",
    diagram: { from: "Model", to: "Proposal", not: "Truth" },
  },
  {
    n: "02",
    title: "Evidence > confidence",
    body: "A fluent answer with no source is dropped. CROWN-X removes any sentence whose citation wasn't retrieved.",
    where: "CROWN-X",
    diagram: { from: "Claim", to: "Passage", not: "Vibes" },
  },
  {
    n: "03",
    title: "Deterministic where possible",
    body: "Ownership, conflicts, tax slabs and Monte Carlo paths are code. The model only gets the parts code can't do.",
    where: "StyleLab · CROWN-X · MoneyMentor",
    diagram: { from: "Rule", to: "Decision", not: "Guess" },
  },
  {
    n: "04",
    title: "Human correction is a feature",
    body: "When StyleLab is unsure a shirt is black, you say navy. That correction becomes the wardrobe's canonical state.",
    where: "StyleLab",
    diagram: { from: "Inference", to: "Confirmed", not: "Silent" },
  },
  {
    n: "05",
    title: "Failure states are product states",
    body: "No evidence means a clear “not enough evidence”, not a guess. A slow crew degrades to a smaller one, not an error.",
    where: "StyleLab · CROWN-X",
    diagram: { from: "Failure", to: "Designed state", not: "Crash" },
  },
];

export const proofRows: ProofRow[] = [
  {
    id: "orchestration",
    area: "Orchestration",
    summary: "Multi-agent pipelines",
    why: "One prompt can't hold every concern. Separate roles can be tested, timed and removed on their own.",
    how: "Bounded DAGs rather than open-ended loops: independent roles run in parallel, and the critical path is kept short. StyleLab's seven roles run in four sequential hops.",
    where: [
      { label: "StyleLab", slug: "stylelab" },
      { label: "ACHP", slug: "achp" },
      { label: "MoneyMentor AI", slug: "moneymentor-ai" },
    ],
  },
  {
    id: "grounding",
    area: "Grounding",
    summary: "RAG + ownership constraints",
    why: "An answer is only as good as the set it was allowed to choose from.",
    how: "Hybrid BM25 + dense retrieval fused with RRF, with tenant filters inside the query. In StyleLab the candidate set is the user's own wardrobe, retrieved by SQL.",
    where: [
      { label: "CROWN-X", slug: "crown-x" },
      { label: "StyleLab", slug: "stylelab" },
      { label: "ACHP", slug: "achp" },
    ],
  },
  {
    id: "validation",
    area: "Validation",
    summary: "Deterministic checks around LLM output",
    why: "Model output is untrusted data until code accepts it.",
    how: "Strict schemas with extra fields forbidden, then business rules, then ownership or citation whitelists. Failing any gate rejects the result, whatever the model's confidence.",
    where: [
      { label: "StyleLab", slug: "stylelab" },
      { label: "CROWN-X", slug: "crown-x" },
    ],
  },
  {
    id: "simulation",
    area: "Simulation",
    summary: "Monte Carlo and domain engines",
    why: "Probabilities and tax slabs must be computed, not generated.",
    how: "1,200 log-normal paths per projection with P10/P50/P90 bands, SIP compounding and a two-regime tax engine, all in code. The model explains the output; it doesn't produce it.",
    where: [
      { label: "MoneyMentor AI", slug: "moneymentor-ai" },
      { label: "VitoSynth", slug: "vitosynth" },
    ],
  },
  {
    id: "evaluation",
    area: "Evaluation",
    summary: "Adversarial AI testing",
    why: "Testing only helpful outputs says nothing about what happens when the model is wrong.",
    how: "Injection, cross-user and malformed-output cases; ablation suites that cut any agent that doesn't change the result; offline and live gates reported separately, never averaged.",
    where: [
      { label: "StyleLab", slug: "stylelab" },
      { label: "CROWN-X", slug: "crown-x" },
      { label: "ACHP", slug: "achp" },
    ],
  },
  {
    id: "deployment",
    area: "Deployment",
    summary: "AWS, Vercel, FastAPI",
    why: "A system isn't finished until someone else can use it.",
    how: "CROWN-X runs as one SAM template on Lambda, API Gateway, S3, DynamoDB and OpenSearch. StyleLab ships Next.js on Vercel, FastAPI on FastAPI Cloud and PostgreSQL on Supabase.",
    where: [
      { label: "CROWN-X", slug: "crown-x" },
      { label: "StyleLab", slug: "stylelab" },
      { label: "ZenStep", slug: "zenstep" },
    ],
  },
  {
    id: "security",
    area: "Security",
    summary: "Proxying, validation, data boundaries",
    why: "AI features widen the attack surface: keys, prompts, uploads and other users' data.",
    how: "Provider keys stay server-side behind proxies or SSM. Retrieved text is escaped as data. Uploads have EXIF and GPS stripped. Foreign IDs are a hard failure.",
    where: [
      { label: "ZenStep", slug: "zenstep" },
      { label: "CROWN-X", slug: "crown-x" },
      { label: "StyleLab", slug: "stylelab" },
    ],
  },
];

/** Real lessons, each traceable to an ADR, benchmark log or README section. */
export const labNotes: LabNote[] = [
  {
    id: "reranker",
    date: "Sep 2026",
    project: "CROWN-X",
    projectSlug: "crown-x",
    title: "Measured, then left off",
    body: "A cross-encoder reranker lifted MRR from 0.694 to 0.864. It also blew the +150 ms p95 latency gate set in advance, and recall@8, the number the model actually reads, didn't move.",
    outcome: "Built, benchmarked, kept off in production (ADR-017).",
  },
  {
    id: "conflict-scope",
    date: "Sep 2026",
    project: "CROWN-X",
    projectSlug: "crown-x",
    title: "The conflict detector that flagged everything",
    body: "The first version attached a conflict whenever a conflicting passage was retrieved. Status accuracy fell from 0.825 to 0.275. Detecting a conflict and deciding whether it matters to the question are separate problems.",
    outcome: "A conflict card now also needs the question to name the fact. One can be missed; one is never invented.",
  },
  {
    id: "fragments",
    date: "Sep 2026",
    project: "CROWN-X",
    projectSlug: "crown-x",
    title: "Fragments outranked the workflows",
    body: "The first workflow-mining run scored precision 0.4: pieces of real routines outranked the routines themselves.",
    outcome: "A fragment rule (ADR-022) drops sub-sequences with no support of their own. Precision 1.0.",
  },
  {
    id: "hidden-errors",
    date: "Sep 2026",
    project: "CROWN-X",
    projectSlug: "crown-x",
    title: "A benchmark that hid its errors",
    body: "One live retrieval run silently lost 19 of 63 queries to the project's own rate limits, and still produced a score.",
    outcome: "Those numbers were thrown away. The harness now fails on any error.",
  },
  {
    id: "day-one",
    date: "Sep 2026",
    project: "CROWN-X",
    projectSlug: "crown-x",
    title: "Listing a model isn't calling it",
    body: "On day one the new AWS account could list Bedrock models, but every inference call was denied while the account was verified.",
    outcome: "A provider interface: Groq in production, Bedrock one configuration switch away.",
  },
  {
    id: "threadpool",
    date: "2025",
    project: "MoneyMentor AI",
    projectSlug: "moneymentor-ai",
    title: "LangGraph out, thread pool in",
    body: "Stateful parallel edges raised an unpacking error. Agents were rewritten as pure functions with no UI calls, run on a ThreadPoolExecutor.",
    outcome: "True fan-out, and the UI updates only after fan-in.",
  },
  {
    id: "honest-failures",
    date: "2026",
    project: "ACHP",
    projectSlug: "achp",
    title: "Two failures kept in the suite",
    body: "The narrative integrity suite passes 5 of 7 cases. Propaganda and conspiracy framing still score below their thresholds.",
    outcome: "Reported as failures, not tuned away.",
  },
  {
    id: "shallower",
    date: "Sep 2026",
    project: "StyleLab",
    projectSlug: "stylelab",
    title: "A shallower answer beats fabricated confidence",
    body: "When the trend source or the latency budget fails, StyleLab removes roles from the crew instead of failing. At the bottom of the ladder it says what your wardrobe is missing and stops.",
    outcome: "AI failure never becomes hallucinated inventory.",
  },
];

/**
 * Timeline entries come from GitHub account and repository creation dates.
 * Years with nothing verifiable are left out rather than filled in.
 */
export const timeline = [
  {
    year: "2023",
    phase: "Foundations",
    entries: ["GitHub account opened, September 2023."],
  },
  {
    year: "2025",
    phase: "Building",
    entries: [
      "AIXPLORER, a directory of AI tools, a glossary and a prompt lab (March).",
      "MoneyMentor AI, the first multi-agent system: parallel specialists and finance engines (July).",
    ],
  },
  {
    year: "2026",
    phase: "Systems + evaluation",
    entries: [
      "ACHP, an adversarial claim-verification council (April).",
      "ZenStep and VitoSynth, vision-driven intervention and simulation prototypes (May, June).",
      "StyleLab, grounded wardrobe AI with 709 backend tests (September).",
      "CROWN-X, built solo for AWS First Commit 2026 (September).",
    ],
  },
  {
    year: "2027",
    phase: "Next systems",
    entries: ["In progress."],
  },
] as const;
