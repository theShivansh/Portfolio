import { projects } from "./projects";

/**
 * Build log data. Descriptions and stacks are curated in lib/projects.ts;
 * GitHub supplies only the live facts (last push, primary language). If the
 * API is unreachable or rate-limited, the index renders from curated data.
 */

export type RepoRow = {
  slug: string;
  name: string;
  description: string;
  stack: string[];
  status: string;
  url: string;
  language?: string;
  pushedAt?: string;
};

type GitHubRepo = { name: string; language: string | null; pushed_at: string };

const OWNER = "theShivansh";

async function fetchRepos(): Promise<Map<string, GitHubRepo>> {
  try {
    const res = await fetch(`https://api.github.com/users/${OWNER}/repos?per_page=100`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return new Map();
    const data = (await res.json()) as GitHubRepo[];
    return new Map(data.map((r) => [r.name.toLowerCase(), r]));
  } catch {
    return new Map();
  }
}

export async function getBuildLog(): Promise<RepoRow[]> {
  const live = await fetchRepos();
  return projects.map((p) => {
    const name = p.repository.split("/").pop() ?? p.title;
    const gh = live.get(name.toLowerCase());
    return {
      slug: p.slug,
      name,
      description: p.subtitle,
      stack: p.stack.slice(0, 4),
      status: p.status,
      url: p.repository,
      language: gh?.language ?? undefined,
      pushedAt: gh?.pushed_at,
    };
  });
}
