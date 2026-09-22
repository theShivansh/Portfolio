/**
 * Content schema. Every claim rendered on the site comes from one of these
 * records, and every record points back to the repository it was taken from.
 */

/** How a piece of evidence is known. Rendered next to the number. */
export type EvidenceStatus =
  /** Counted by the project's own test suite / execution ledger. */
  | "test-verified"
  /** Timed or costed on a deployed system. */
  | "measured"
  /** Scored on the project's own evaluation dataset. */
  | "benchmark"
  /** Stated in the repository README; not independently re-run here. */
  | "reported";

export type EvidenceItem = {
  label: string;
  value: string;
  status: EvidenceStatus;
  /** Repository path or README section the value was copied from. */
  source: string;
  note?: string;
};

/** Node kinds drive the visual treatment in architecture diagrams. */
export type NodeKind = "io" | "model" | "code" | "human" | "store" | "gate";

export type ArchNode = {
  id: string;
  label: string;
  detail?: string;
  kind: NodeKind;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  /** Where the image came from. */
  origin: "repository" | "captured from live demo";
};

export type ProjectTier = "primary" | "secondary" | "archive";

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** Short editorial category, e.g. "Perception + grounding". */
  category: string;
  tier: ProjectTier;
  subtitle: string;
  /** One line. The idea a visitor should leave with. */
  thesis: string;
  /** Two or three sentences. */
  description: string;
  problem: string;
  decision: { title: string; body: string };
  architecture: ArchNode[];
  failure: string[];
  stack: string[];
  repository: string;
  liveDemo?: string;
  evidence: EvidenceItem[];
  images: ProjectImage[];
  featured: boolean;
  /** Month the repository was started, from GitHub metadata. */
  started: string;
  status: "Live" | "Live prototype" | "Archive";
  /** Honest scope note shown prominently when present. */
  caveat?: string;
};

export type LabNote = {
  id: string;
  date: string;
  project: string;
  projectSlug: string;
  title: string;
  body: string;
  /** The decision or rule the note ended in. */
  outcome: string;
};

export type Principle = {
  n: string;
  title: string;
  body: string;
  where: string;
  /** Tiny diagram: from → to, with the rejected alternative. */
  diagram: { from: string; to: string; not: string };
};

export type ProofRow = {
  id: string;
  area: string;
  summary: string;
  why: string;
  how: string;
  where: { label: string; slug: string }[];
};
