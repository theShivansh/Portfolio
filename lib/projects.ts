import type { Project } from "./types";

/**
 * Source of truth: each project's README and docs on github.com/theShivansh.
 * Numbers are copied, never rounded up. If a README does not support a
 * claim, it is not here.
 */

const GH = "https://github.com/theShivansh";

export const projects: Project[] = [
  {
    slug: "stylelab",
    number: "01",
    title: "StyleLab",
    category: "Perception + grounding",
    tier: "primary",
    featured: true,
    subtitle: "AI wardrobe intelligence for the clothes you actually own.",
    thesis: "The model proposes. The database decides. The user corrects.",
    description:
      "Photos of real garments become structured wardrobe data with a confidence score on every field. A seven-role CrewAI crew ranks and explains outfits, then every result is re-validated against user-scoped SQL before it reaches the screen.",
    problem:
      "A styling model can recommend something that sounds right and doesn't exist in your closet. StyleLab treats ownership as a product invariant, not a suggestion.",
    decision: {
      title: "AI ranks. Software owns truth.",
      body: "Ownership, candidate retrieval and item existence stay deterministic and outside the model. Model output is untrusted data that has to pass schema, business and ownership validation. A perfectly formatted answer can still be rejected, and that is the point.",
    },
    architecture: [
      { id: "photo", label: "Photo", detail: "one independent job per garment", kind: "io" },
      { id: "vision", label: "Vision extraction", detail: "Groq vision model, per-field confidence", kind: "model" },
      { id: "structured", label: "Structured wardrobe", detail: "category, colour, fit, formality", kind: "store" },
      { id: "correction", label: "User correction", detail: "source = user_corrected", kind: "human" },
      { id: "owned", label: "Owned candidates", detail: "user_id-scoped SQL", kind: "code" },
      { id: "crew", label: "Advisory crew", detail: "7 roles, 4 sequential hops", kind: "model" },
      { id: "validate", label: "Validation", detail: "schema · business · ownership", kind: "gate" },
      { id: "outfit", label: "Outfit", kind: "io" },
    ],
    failure: [
      "Full advisory crew, all seven roles",
      "Crew without Trend Scout when the trend source is unavailable",
      "Architect + Editor only when the latency circuit breaker trips",
      "Deterministic ranker over the same ownership-scoped candidates",
      "An honest gap statement: “your wardrobe needs a bottom for this”",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind 4", "FastAPI", "Python 3.11", "PostgreSQL", "Groq", "CrewAI", "Playwright"],
    repository: `${GH}/StyleLab`,
    liveDemo: "https://the-style-lab-ai.vercel.app/",
    evidence: [
      { label: "Backend tests (pytest)", value: "709", status: "test-verified", source: "docs/PROGRESS.md" },
      { label: "Adversarial AI evaluation cases", value: "127", status: "test-verified", source: "docs/AI-EVAL-CASES.md" },
      { label: "Web unit tests (Vitest)", value: "90", status: "test-verified", source: "docs/TESTING.md" },
      { label: "Playwright E2E, desktop + mobile", value: "68", status: "test-verified", source: "docs/TESTING.md" },
      { label: "Refusal-harness scenarios", value: "19 / 19", status: "test-verified", source: "README · Engineering evidence" },
      { label: "Agent ablation suite", value: "11 tests", status: "test-verified", source: "README · Engineering evidence" },
      { label: "Full six-agent crew, live", value: "~8.1 s", status: "measured", source: "README · Engineering evidence", note: "Provider-dependent. Evidence of shape, not a benchmark." },
      { label: "Swap path (Architect + Editor)", value: "~4.4 s", status: "measured", source: "README · Engineering evidence" },
    ],
    images: [
      {
        src: "/images/projects/stylelab-live.png",
        alt: "StyleLab landing page: an oxford shirt analysed into category top, type oxford shirt, colour navy marked likely, material cotton and fit regular marked best guess",
        width: 1440,
        height: 900,
        caption: "Every guess is labelled as a guess: “likely” and “best guess” sit next to each extracted field.",
        origin: "captured from live demo",
      },
    ],
    started: "Sep 2026",
    status: "Live",
  },
  {
    slug: "crown-x",
    number: "02",
    title: "CROWN-X",
    category: "Evidence + memory",
    tier: "primary",
    featured: true,
    subtitle: "Evidence-first answers over changing project documents.",
    thesis: "Every sentence cites its passage. When sources disagree, you see both, and the rule that decided.",
    description:
      "Hybrid BM25 + k-NN retrieval over a workspace's documents, one structured answer from gpt-oss-120b, and a citation validator that drops any claim pointing at a passage that wasn't retrieved. Conflicts are found by code before the model writes a word.",
    problem:
      "The brief says submissions close on 20 September. The organiser's update moves it to 22. A normal document chatbot answers from whichever passage ranks first and never mentions that another source disagrees.",
    decision: {
      title: "Keep the model out of correctness-critical logic.",
      body: "A conflict is a deterministic predicate: same fact, same type, different documents, different normalized values. The current value is the first written rule that applies: newest source date, then version order, then latest upload, which is the weakest rule and is named as such.",
    },
    architecture: [
      { id: "browser", label: "Browser", detail: "Next.js static export on Amplify", kind: "io" },
      { id: "gateway", label: "API Gateway", detail: "HTTP API, per-route throttles", kind: "code" },
      { id: "lambda", label: "Lambda", detail: "ONNX bge-small embeddings in-process", kind: "code" },
      { id: "s3", label: "S3", detail: "pre-signed POST uploads, pinned models", kind: "store" },
      { id: "opensearch", label: "OpenSearch", detail: "BM25 + k-NN, RRF k = 60, top 8", kind: "store" },
      { id: "conflict", label: "Conflict check", detail: "code, before any model call", kind: "gate" },
      { id: "llm", label: "LLM", detail: "Groq gpt-oss-120b → AnswerDraft", kind: "model" },
      { id: "citations", label: "Citation validation", detail: "finalize(): drop uncited claims", kind: "gate" },
    ],
    failure: [
      "Nothing relevant retrieved: “Not enough evidence”, with no model call",
      "Timeout or short 429: retried once, then one fallback to gpt-oss-20b",
      "Text in a document addressed to an assistant is data; a claim supported only by it is dropped",
      "Every error shows a request ID that CloudWatch Logs Insights finds in seconds",
    ],
    stack: ["Python 3.12", "TypeScript", "Next.js", "AWS Lambda", "API Gateway", "S3", "DynamoDB", "OpenSearch", "ONNX", "Groq"],
    repository: `${GH}/CROWN-X`,
    liveDemo: "https://main.d1jy52bqj8dt1h.amplifyapp.com/",
    evidence: [
      { label: "Contradiction precision / recall", value: "1.0 / 1.0", status: "benchmark", source: "docs/BENCHMARKS.md", note: "6 conflicting pairs, 4 facts, offline and live." },
      { label: "Format-only differences flagged", value: "0", status: "benchmark", source: "docs/BENCHMARKS.md", note: "“22 Sept” and “2026-09-22” normalize as equal." },
      { label: "Golden set: pass rate / value match", value: "0.95 / 1.0", status: "benchmark", source: "docs/BENCHMARKS.md", note: "40 questions, live stack." },
      { label: "Retrieval recall@8, deployed", value: "0.950", status: "measured", source: "docs/BENCHMARKS.md" },
      { label: "Upload to “Ready”, p50 / p95", value: "927 / 1367 ms", status: "measured", source: "README · Step 1" },
      { label: "Tests in CI", value: "343 API · 28 web · 7 E2E", status: "test-verified", source: "README · Evaluation framework" },
      { label: "AWS cost, 17–19 Sep, before credits", value: "$1.86", status: "measured", source: "README · AWS architecture and cost" },
    ],
    images: [
      {
        src: "/images/projects/crownx-conflict-inspector.png",
        alt: "CROWN-X conflict inspector: brief v1 says 20 September, organiser update 3 says 22 September and is marked newer",
        width: 728,
        height: 580,
        caption: "Conflict inspector: both sources side by side, the newer one marked, and the rule that chose the current value.",
        origin: "repository",
      },
      {
        src: "/images/projects/crownx-timeline.png",
        alt: "CROWN-X value timeline: 20 Sep 2026 in brief v1, changed to 22 Sep 2026 in organiser update 3, confirmed in meeting notes",
        width: 728,
        height: 232,
        caption: "Value timeline, ordered by each document's own header date. The conflict segment is dashed.",
        origin: "repository",
      },
      {
        src: "/images/projects/crownx-evidence-chat.png",
        alt: "CROWN-X answer card showing Sources disagree, current value 22 Sep 2026 by newest source date, with citation chips on each sentence",
        width: 728,
        height: 432,
        caption: "“Sources disagree” comes from code. Every sentence carries citation chips.",
        origin: "repository",
      },
    ],
    started: "Sep 2026",
    status: "Live",
    caveat:
      "Evaluation datasets were written for the project. They show the system does what it claims on known cases, not accuracy on anyone else's documents. Built solo for AWS First Commit 2026 (Ship It track), 17–20 September 2026.",
  },
  {
    slug: "achp",
    number: "03",
    title: "ACHP",
    category: "Adversarial reasoning",
    tier: "primary",
    featured: true,
    subtitle: "Adversarial Claim & Honesty Probe.",
    thesis: "Seven agents challenge a claim before the system writes a verdict.",
    description:
      "A claim passes a rule-based security gate, hybrid retrieval and atomic decomposition, then faces a factual attacker, a narrative auditor and a five-part narrative integrity layer in parallel. A judge turns the debate into five formula-defined scores and an auditable report.",
    problem:
      "Asking one model “is this true?” returns one opinion: no counter-evidence, no missing perspectives, no view of how the claim is framed.",
    decision: {
      title: "A structured debate, parallel where independent.",
      body: "Adversary A, Adversary B and the Narrative Integrity Layer don't depend on each other, so they run under asyncio.gather and the stage costs only its slowest branch. Scores are explicit weighted formulas, so every number in a report can be traced to its inputs.",
    },
    architecture: [
      { id: "security-in", label: "Security", detail: "rule-based pre-filter, ~1 ms", kind: "gate" },
      { id: "retriever", label: "Retriever", detail: "BM25 + FAISS, web fallback, semantic cache", kind: "code" },
      { id: "proposer", label: "Proposer", detail: "atomic claims with provenance", kind: "model" },
      { id: "adversary-a", label: "Adversary A", detail: "factual attacker", kind: "model" },
      { id: "adversary-b", label: "Adversary B", detail: "narrative auditor", kind: "model" },
      { id: "nil", label: "NIL", detail: "5 integrity sub-agents", kind: "model" },
      { id: "judge", label: "Judge", detail: "verdict + 5 metrics", kind: "model" },
      { id: "report", label: "Report", detail: "post-filter, SSE stream, export", kind: "io" },
    ],
    failure: [
      "Multi-tier model fallback per agent; failures are surfaced, never silent",
      "Fast mode skips the NIL for short factual queries",
      "A second debate round is triggered when initial confidence is below 0.70",
      "Output security pass redacts PII before a report is returned",
    ],
    stack: ["Python 3.12", "FastAPI", "Next.js", "Groq", "FAISS", "rank-bm25", "MiniLM", "VADER", "Redis", "SSE", "Docker"],
    repository: `${GH}/ACHP`,
    liveDemo: "https://achp-seven.vercel.app/",
    evidence: [
      { label: "Parallel stage {A ‖ B ‖ NIL}, mean", value: "9.1 s", status: "reported", source: "README · Latency by pipeline stage" },
      { label: "Total, cold / warm cache", value: "35.6 s / < 0.1 s", status: "reported", source: "README · Latency by pipeline stage" },
      { label: "NIL test suite", value: "5 / 7 pass", status: "reported", source: "README · NIL test suite", note: "Propaganda and conspiracy cases miss threshold. Kept in the suite, not hidden." },
      { label: "Formula-defined metrics", value: "CTS · PCS · BIS · NSS · EPS", status: "reported", source: "README · ACHP metrics" },
    ],
    images: [
      {
        src: "/images/projects/achp-live.png",
        alt: "ACHP dashboard: agent manager listing retriever, proposer, adversary A and B, sentiment, bias, perspective, framing, NIL layer, judge and orchestrator next to a claim input",
        width: 1440,
        height: 900,
        caption: "The deployed dashboard: every agent is listed and inspectable before a claim is submitted.",
        origin: "captured from live demo",
      },
    ],
    started: "Apr 2026",
    status: "Live",
    caveat: "Latency and suite results are as reported in the repository README. Verdicts are structured analysis, not ground truth.",
  },
  {
    slug: "moneymentor-ai",
    number: "04",
    title: "MoneyMentor AI",
    category: "Simulation",
    tier: "secondary",
    featured: false,
    subtitle: "A multi-agent personal CFO with deterministic financial engines.",
    thesis: "Four specialists in parallel, one supervisor, and engines that do the maths a model shouldn't.",
    description:
      "Budget, risk, investment and web-research agents fan out in parallel; a supervisor merges them into a 30/60/90-day plan. The numbers come from code: a 1,200-path Monte Carlo engine, SIP compounding and an FY 2026-27 Indian tax engine.",
    problem:
      "Most AI finance apps render one LLM answer. Money questions need arithmetic that is correct every time, and advice grounded in India's actual tax rules.",
    decision: {
      title: "ThreadPoolExecutor, not LangGraph.",
      body: "Stateful parallel edges in LangGraph failed in practice, so agents became pure functions (state, client) → str run on a thread pool. The UI updates only after every future resolves, and each report is capped at 280 characters before the supervisor sees it, which stopped 413 errors.",
    },
    architecture: [
      { id: "input", label: "Monthly cashflow", detail: "income, expenses, savings, goal", kind: "io" },
      { id: "budget", label: "Budget", detail: "50/30/20, anomalies", kind: "model" },
      { id: "risk", label: "Risk", detail: "runway, fund gap", kind: "model" },
      { id: "invest", label: "Investments", detail: "ELSS · SIP · PPF · NPS", kind: "model" },
      { id: "web", label: "Web research", detail: "compound-beta, 3-layer fallback", kind: "model" },
      { id: "supervisor", label: "Supervisor", detail: "synthesis, capped inputs", kind: "model" },
      { id: "montecarlo", label: "Monte Carlo", detail: "1,200 log-normal paths", kind: "code" },
      { id: "plan", label: "30 / 60 / 90-day plan", kind: "io" },
    ],
    failure: [
      "Web data: compound-beta → DuckDuckGo scrape → curated knowledge base → LLM synthesis",
      "Tool-call responses with empty content are parsed from their arguments, then retried without tools",
      "Supervisor falls back to an always-available model",
    ],
    stack: ["Python", "Streamlit", "Groq", "Plotly", "concurrent.futures"],
    repository: `${GH}/MoneyMentor-AI`,
    liveDemo: "https://aimoneymentor.streamlit.app/",
    evidence: [
      { label: "Monte Carlo paths", value: "1,200", status: "reported", source: "README · Monte Carlo engine", note: "P10 / P50 / P90 outcomes, 1–30 year horizon." },
      { label: "Tax engine, old and new regime", value: "FY 2026-27", status: "reported", source: "README · Tax engine" },
      { label: "Parallel specialists", value: "4 + supervisor", status: "reported", source: "README · System architecture" },
    ],
    images: [
      {
        src: "/images/projects/moneymentor-dashboard.png",
        alt: "MoneyMentor AI dashboard with financial inputs, agent roster and analysis tabs",
        width: 1714,
        height: 1079,
        caption: "The Streamlit app: seven tabs from financial input to the AI advisor.",
        origin: "repository",
      },
    ],
    started: "Jul 2025",
    status: "Live",
    caveat: "The live app runs on Streamlit Community Cloud and may take a moment to wake.",
  },
  {
    slug: "vitosynth",
    number: "05",
    title: "VitoSynth",
    category: "Simulation",
    tier: "secondary",
    featured: false,
    subtitle: "A consumer-facing metabolic simulation prototype.",
    thesis: "Separate what the meal is from what it might do, and type both.",
    description:
      "A two-phase pipeline: a multimodal model turns a meal photo, label or description into structured nutrition data, then a second pass simulates six response dimensions against a user profile. The client is React 19 + TypeScript with typed simulation results.",
    problem:
      "Calorie counts flatten a meal into one number. The prototype asks a different question: what could a meal change over the next few hours, for this person, at this time of day?",
    decision: {
      title: "Two phases, typed contracts.",
      body: "Extraction and simulation are separate calls with separate schemas, so a bad photo read fails before any simulation runs. A 429 falls back to a lighter model instead of breaking the flow.",
    },
    architecture: [
      { id: "meal", label: "Meal image", detail: "photo, label or text", kind: "io" },
      { id: "extract", label: "Structured input", detail: "multimodal extraction to typed macros", kind: "model" },
      { id: "sim", label: "Simulation", detail: "profile-conditioned model pass", kind: "model" },
      { id: "dims", label: "Six dimensions", detail: "typed SimulationResult", kind: "io" },
    ],
    failure: ["Rate limit (429) falls back to a lighter model", "Extraction and simulation fail independently"],
    stack: ["React 19", "TypeScript", "Vite", "Groq", "Recharts", "Vercel"],
    repository: `${GH}/VitoSynth`,
    liveDemo: "https://vito-synth.vercel.app/",
    evidence: [],
    images: [
      {
        src: "/images/projects/vitosynth-live.png",
        alt: "VitoSynth simulator: meal input, glucose forecast chart, metabolic state panel and an organ stress diagram",
        width: 1440,
        height: 900,
        caption: "The prototype's simulator view before a meal is entered.",
        origin: "captured from live demo",
      },
    ],
    started: "Jun 2026",
    status: "Live prototype",
    caveat:
      "Prototype. Outputs are model-generated simulations informed by published research. They are not clinically validated and are not medical advice.",
  },
  {
    slug: "zenstep",
    number: "06",
    title: "ZenStep",
    category: "Intervention",
    tier: "secondary",
    featured: false,
    subtitle: "An AI intervention system that turns a cluttered space into executable steps.",
    thesis: "More chaos and less time means smaller steps.",
    description:
      "A photo of a cluttered space goes through a serverless proxy to a Groq vision model, which returns a strict JSON protocol of tasks, timings and tone cues, sized to the time you have: 2, 10 or 30 minutes.",
    problem:
      "When a space is overwhelming, the hardest part is choosing a first step. A chat reply adds more text to read. ZenStep returns one small action at a time.",
    decision: {
      title: "JSON drives the interface, not prose.",
      body: "The model returns a state machine of tasks rather than markdown, so the UI can render, check off and pace each step. The browser never talks to the provider: Vercel functions hold the key, sanitize payloads and handle 429s and 400s.",
    },
    architecture: [
      { id: "photo", label: "Messy state", detail: "photo upload", kind: "io" },
      { id: "proxy", label: "Serverless proxy", detail: "/api/analyze, key stays server-side", kind: "code" },
      { id: "vision", label: "Vision model", detail: "entropy × time budget", kind: "model" },
      { id: "protocol", label: "Task protocol", detail: "strict JSON", kind: "io" },
    ],
    failure: ["Provider errors (429 / 400) are caught in the function and returned as clear states"],
    stack: ["React 19", "TypeScript", "Vite", "Vercel Functions", "Groq"],
    repository: `${GH}/Zenstep`,
    liveDemo: "https://zenstep-pi.vercel.app/",
    evidence: [],
    images: [
      {
        src: "/images/projects/zenstep-live.png",
        alt: "ZenStep start screen: an upload area labelled Scan the chaos",
        width: 1440,
        height: 900,
        caption: "One action on the first screen: upload a photo of the space.",
        origin: "captured from live demo",
      },
    ],
    started: "May 2026",
    status: "Live",
  },
  {
    slug: "aixplorer",
    number: "07",
    title: "AIXPLORER",
    category: "Archive",
    tier: "archive",
    featured: false,
    subtitle: "A directory of AI tools, a glossary, and a prompt lab.",
    thesis: "Where the work started: curating AI before building with it.",
    description:
      "A static HTML, CSS and JavaScript site: curated AI tools across categories, an A–Z glossary of AI terms, and an interactive prompt builder. No build step, hosted on GitHub Pages.",
    problem: "In early 2025 the useful AI tools were scattered across launch posts and lists. This collected them in one place.",
    decision: {
      title: "No framework.",
      body: "Plain static pages, so there was nothing to build and nothing to maintain beyond the content itself.",
    },
    architecture: [
      { id: "tools", label: "AI tools", kind: "io" },
      { id: "glossary", label: "Glossary", kind: "io" },
      { id: "prompt", label: "Prompt lab", kind: "io" },
    ],
    failure: [],
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    repository: `${GH}/AIXPLORER`,
    liveDemo: "https://theshivansh.github.io/AIXPLORER/",
    evidence: [],
    images: [
      {
        src: "/images/projects/aixplorer-live.png",
        alt: "AIxplorer home page listing AI tools in categories such as Latest AI, Top 10 Trends, Image Generators and Writing",
        width: 1440,
        height: 900,
        caption: "The directory's home page.",
        origin: "captured from live demo",
      },
    ],
    started: "Mar 2025",
    status: "Archive",
  },
];

export const primaryProjects = projects.filter((p) => p.tier === "primary");
export const secondaryProjects = projects.filter((p) => p.tier === "secondary");
export const archiveProjects = projects.filter((p) => p.tier === "archive");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** The next case in reading order, wrapping around. */
export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length] as Project;
}
