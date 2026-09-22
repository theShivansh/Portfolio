import type { ArchNode } from "./types";

/**
 * Work experience, as provided by Shivansh. Metrics are his own reported
 * outcomes from each role; gauges only visualize the stated numbers.
 */

/** How a metric is drawn: as a plain readout or a small comparative gauge. */
export type Gauge =
  | { kind: "none" }
  /** Share of a whole, e.g. 92% accuracy. */
  | { kind: "share"; value: number }
  /** Reduction from a baseline, e.g. −35% latency. Range for "50–70%". */
  | { kind: "reduce"; from: number; to?: number }
  /** Increase over a baseline, e.g. +25–30% visibility. */
  | { kind: "increase"; from: number; to?: number };

export type Metric = { value: string; label: string; gauge: Gauge };

export type Highlight = { verb: string; text: string };

export type Role = {
  id: string;
  org: string;
  location: string;
  title: string;
  start: string;
  end: string;
  isoStart: string;
  isoEnd: string;
  duration: string;
  /** One line: what this role was about. */
  summary: string;
  metrics: Metric[];
  highlights: Highlight[];
  stack: string[];
  system: ArchNode[];
  /** A handwritten margin note. */
  note: string;
  /** Projects that reuse the same techniques. */
  carriedInto: { label: string; slug: string; why: string }[];
};

export const roles: Role[] = [
  {
    id: "technology-mindz",
    org: "Technology Mindz",
    location: "Jaipur",
    title: "AI Developer",
    start: "May 2025",
    end: "Jul 2025",
    isoStart: "2025-05",
    isoEnd: "2025-07",
    duration: "2 months",
    summary: "Agent workflows and retrieval on enterprise data, shipped over four agile sprints.",
    metrics: [
      { value: "10,000+", label: "queries a day", gauge: { kind: "none" } },
      { value: "< 500 ms", label: "response latency", gauge: { kind: "none" } },
      { value: "up to 92%", label: "retrieval accuracy", gauge: { kind: "share", value: 92 } },
      { value: "−35%", label: "inference latency", gauge: { kind: "reduce", from: 35 } },
    ],
    highlights: [
      {
        verb: "Orchestrated",
        text: "LangChain and LangGraph agent workflows across four sprints in an agile team, scaling the system to 10,000+ queries a day at under 500 ms.",
      },
      {
        verb: "Built",
        text: "a hybrid BM25 + FAISS retrieval pipeline end to end: ingestion, transformation and evaluation. Retrieval accuracy reached up to 92% on enterprise data.",
      },
      {
        verb: "Cut",
        text: "inference latency by 35% with semantic caching, choosing between model configurations with Python A/B evaluation.",
      },
    ],
    stack: ["Python", "LangChain", "LangGraph", "FAISS", "BM25", "A/B evaluation"],
    system: [
      { id: "query", label: "Query", detail: "10,000+ a day", kind: "io" },
      { id: "cache", label: "Semantic cache", detail: "hit → answer early", kind: "code" },
      { id: "retrieval", label: "Hybrid retrieval", detail: "BM25 + FAISS", kind: "store" },
      { id: "agents", label: "Agent graph", detail: "LangChain · LangGraph", kind: "model" },
      { id: "eval", label: "A/B evaluation", detail: "pick the config", kind: "gate" },
      { id: "answer", label: "Answer", detail: "< 500 ms", kind: "io" },
    ],
    note: "where retrieval met real traffic",
    carriedInto: [
      { label: "ACHP", slug: "achp", why: "BM25 + FAISS retrieval behind a semantic cache" },
      { label: "CROWN-X", slug: "crown-x", why: "hybrid retrieval with measured recall" },
    ],
  },
  {
    id: "grras",
    org: "GRRAS Solutions",
    location: "Jaipur",
    title: "AWS Cloud & Linux Intern",
    start: "May 2026",
    end: "Jul 2026",
    isoStart: "2026-05",
    isoEnd: "2026-07",
    duration: "2 months",
    summary: "The infrastructure under the models: identity, networks, monitoring and automation.",
    metrics: [
      { value: "3", label: "capstone projects", gauge: { kind: "none" } },
      { value: "20+", label: "AWS services", gauge: { kind: "none" } },
      { value: "50–70%", label: "less manual admin", gauge: { kind: "reduce", from: 50, to: 70 } },
      { value: "+25–30%", label: "infrastructure visibility", gauge: { kind: "increase", from: 25, to: 30 } },
    ],
    highlights: [
      {
        verb: "Delivered",
        text: "three capstone projects across 20+ AWS services, including EC2, S3, IAM, VPC, CloudWatch and Bedrock. Graduated with distinction.",
      },
      {
        verb: "Automated",
        text: "recurring Linux administration in Bash, cutting manual effort by roughly 50–70%, and containerized a capstone deployment with Docker.",
      },
      {
        verb: "Hardened",
        text: "EC2 and S3 access with least-privilege IAM policies and CloudWatch monitoring, raising infrastructure visibility by roughly 25–30%.",
      },
    ],
    stack: ["AWS", "EC2", "S3", "IAM", "VPC", "CloudWatch", "Bedrock", "Linux", "Bash", "Docker"],
    system: [
      { id: "iam", label: "IAM", detail: "least-privilege policies", kind: "gate" },
      { id: "vpc", label: "VPC", detail: "network boundary", kind: "code" },
      { id: "compute", label: "EC2 · S3", detail: "compute + storage", kind: "store" },
      { id: "docker", label: "Docker", detail: "containerized deploy", kind: "code" },
      { id: "bash", label: "Bash automation", detail: "recurring admin", kind: "code" },
      { id: "watch", label: "CloudWatch", detail: "metrics + alarms", kind: "io" },
    ],
    note: "same services, two months later: CROWN-X",
    carriedInto: [{ label: "CROWN-X", slug: "crown-x", why: "Lambda, S3, IAM and CloudWatch on AWS" }],
  },
];
