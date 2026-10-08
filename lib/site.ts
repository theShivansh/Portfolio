/** Site-wide identity and links. Optional links render only when set. */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Shivansh Shukla",
  codename: "FIELD/INTELLIGENCE",
  role: "AI Engineer & Systems Builder",
  title: "Shivansh Shukla — AI Engineer & Systems Builder",
  description:
    "AI engineer who builds systems that don't trust the model: evidence-first RAG, adversarial multi-agent verification and grounded AI, with evals and live demos.",
  url: resolveSiteUrl(),
  email: "shivanshshuklajaipur@gmail.com",
  github: "https://github.com/theShivansh",
  huggingface: "https://huggingface.co/theshivansh",
  /** The AI content channel. Engineering by day, explaining it by curiosity. */
  youtube: "https://youtube.com/@techolaugh",
  youtubeHandle: "@techolaugh",
  /** Set NEXT_PUBLIC_LINKEDIN_URL to show a LinkedIn link. */
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined,
  /**
   * Put a PDF at public/resume.pdf and set NEXT_PUBLIC_RESUME_PATH=/resume.pdf
   * to show every "Download resume" link.
   */
  resume: process.env.NEXT_PUBLIC_RESUME_PATH || undefined,
} as const;

export type Chapter = {
  id: string;
  n: string;
  /** One word, for the instrument row in the header. */
  label: string;
  /** The chapter as the page itself names it. */
  long: string;
};

/**
 * The chapters, in page order. Section ids must match.
 * The order is an argument: three systems running, then what the rest are,
 * then what they are not allowed to do, how that is checked, and where it
 * failed anyway.
 */
export const chapters: Chapter[] = [
  { id: "work", n: "01", label: "Flagship", long: "Flagship systems" },
  { id: "map", n: "02", label: "Map", long: "The map" },
  { id: "systems", n: "03", label: "Kinds", long: "Three kinds of system" },
  { id: "boundaries", n: "04", label: "Trust", long: "What I don't trust" },
  { id: "architecture", n: "05", label: "Method", long: "How I build it" },
  { id: "evidence", n: "06", label: "Proof", long: "How I test it" },
  { id: "failures", n: "07", label: "Broke", long: "What broke" },
  { id: "notes", n: "08", label: "Lab", long: "What I learned" },
  { id: "experience", n: "09", label: "Field", long: "Where I've been" },
  { id: "about", n: "10", label: "Why", long: "Why I build this way" },
  { id: "contact", n: "11", label: "Next", long: "What's next" },
];
