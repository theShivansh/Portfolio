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
    "AI engineer building evidence-grounded, multi-agent, simulation, and human-in-the-loop systems.",
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
 * The order is an argument: what the systems are, then what they are not
 * allowed to do, then how that is checked, then where it failed anyway.
 */
export const chapters: Chapter[] = [
  { id: "map", n: "01", label: "Map", long: "The map" },
  { id: "systems", n: "02", label: "Kinds", long: "Three kinds of system" },
  { id: "work", n: "03", label: "Work", long: "Selected work" },
  { id: "boundaries", n: "04", label: "Trust", long: "What I don't trust" },
  { id: "architecture", n: "05", label: "Method", long: "How I build it" },
  { id: "evidence", n: "06", label: "Proof", long: "How I test it" },
  { id: "failures", n: "07", label: "Broke", long: "What broke" },
  { id: "notes", n: "08", label: "Lab", long: "What I learned" },
  { id: "experience", n: "09", label: "Field", long: "Where I've been" },
  { id: "about", n: "10", label: "Why", long: "Why I build this way" },
  { id: "contact", n: "11", label: "Next", long: "What's next" },
];
