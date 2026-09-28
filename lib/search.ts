import { projects } from "./projects";
import { chapters, site } from "./site";
import { achievements, boundaries, experiments, flightRecords } from "./universe";

/**
 * The command palette index. Built from the same records the page renders,
 * so anything findable here is something that exists on the site. Deep
 * targets (a failure, an experiment, a boundary) carry the element id they
 * scroll to.
 */

export type CommandKind = "Chapter" | "System" | "Experiment" | "Failure" | "Boundary" | "Result" | "Elsewhere";

export type Command = {
  id: string;
  label: string;
  kind: CommandKind;
  hint?: string;
  href: string;
  external?: boolean;
  /** Extra terms to match on, lowercase. */
  terms: string;
};

function terms(...parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export const commands: Command[] = [
  ...chapters.map(
    (c): Command => ({
      id: `chapter-${c.id}`,
      label: c.long,
      kind: "Chapter",
      hint: `Chapter ${c.n}`,
      href: `/#${c.id}`,
      terms: terms(c.long, c.label, c.n, c.id),
    }),
  ),
  ...projects.map(
    (p): Command => ({
      id: `system-${p.slug}`,
      label: p.title,
      kind: "System",
      hint: p.category,
      href: `/work/${p.slug}`,
      terms: terms(p.title, p.category, p.subtitle, p.thesis, p.stack.join(" ")),
    }),
  ),
  ...experiments.map(
    (e): Command => ({
      id: `experiment-${e.id}`,
      label: `${e.id} · ${e.title}`,
      kind: "Experiment",
      hint: e.shipped ? "Shipped" : "Not shipped",
      href: `/#exp-${e.id.toLowerCase()}`,
      terms: terms(e.id, e.title, e.system, e.hypothesis, e.decision),
    }),
  ),
  ...flightRecords.map(
    (f): Command => ({
      id: `failure-${f.id}`,
      label: `${f.id} · ${f.failure}`,
      kind: "Failure",
      hint: f.system,
      href: `/#${f.id.toLowerCase()}`,
      terms: terms(f.id, f.failure, f.system, f.observed, f.response),
    }),
  ),
  ...boundaries.map(
    (b): Command => ({
      id: `boundary-${b.id}`,
      label: `${b.subject} is owned by ${b.owner}`,
      kind: "Boundary",
      hint: b.where.label,
      href: `/#bnd-${b.id}`,
      terms: terms(b.subject, b.owner, b.rule, b.where.label),
    }),
  ),
  ...achievements.map(
    (a): Command => ({
      id: `result-${a.id}`,
      label: `${a.event} — ${a.award}`,
      kind: "Result",
      hint: a.year,
      href: "/#results",
      terms: terms(a.event, a.award, a.year, a.field),
    }),
  ),
  {
    id: "link-github",
    label: "GitHub",
    kind: "Elsewhere",
    hint: "theShivansh",
    href: site.github,
    external: true,
    terms: "github code repositories source",
  },
  {
    id: "link-youtube",
    label: "TECHOLaugh",
    kind: "Elsewhere",
    hint: `YouTube ${site.youtubeHandle}`,
    href: site.youtube,
    external: true,
    terms: "youtube video content channel techolaugh explaining",
  },
  {
    id: "link-huggingface",
    label: "Hugging Face",
    kind: "Elsewhere",
    hint: "theshivansh",
    href: site.huggingface,
    external: true,
    terms: "hugging face models spaces",
  },
  {
    id: "link-email",
    label: "Email Shivansh",
    kind: "Elsewhere",
    hint: site.email,
    href: `mailto:${site.email}`,
    external: true,
    terms: `email contact write ${site.email}`,
  },
  ...(site.linkedin
    ? [
        {
          id: "link-linkedin",
          label: "LinkedIn",
          kind: "Elsewhere" as const,
          href: site.linkedin,
          external: true,
          terms: "linkedin profile",
        },
      ]
    : []),
  ...(site.resume
    ? [
        {
          id: "link-resume",
          label: "Resume",
          kind: "Elsewhere" as const,
          hint: "PDF",
          href: site.resume,
          external: true,
          terms: "resume cv pdf download",
        },
      ]
    : []),
];

/** Substring match over label and terms, in index order. */
export function searchCommands(query: string, limit = 9): Command[] {
  const q = query.trim().toLowerCase();
  if (!q) return commands.filter((c) => c.kind === "Chapter" || c.kind === "System").slice(0, limit);
  const words = q.split(/\s+/);
  return commands
    .filter((c) => {
      const hay = `${c.label.toLowerCase()} ${c.terms}`;
      return words.every((w) => hay.includes(w));
    })
    .slice(0, limit);
}
