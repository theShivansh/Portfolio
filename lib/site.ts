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
  /** Set NEXT_PUBLIC_LINKEDIN_URL to show a LinkedIn link. */
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || undefined,
  /**
   * Put a PDF at public/resume.pdf and set NEXT_PUBLIC_RESUME_PATH=/resume.pdf
   * to show every "Download resume" link.
   */
  resume: process.env.NEXT_PUBLIC_RESUME_PATH || undefined,
} as const;

export type Chapter = { id: string; n: string; label: string };

/** Navigation chapters, in page order. Section ids must match. */
export const chapters: Chapter[] = [
  { id: "systems", n: "01", label: "Systems" },
  { id: "work", n: "02", label: "Work" },
  { id: "architecture", n: "03", label: "Architecture" },
  { id: "notes", n: "04", label: "Notes" },
  { id: "about", n: "05", label: "About" },
  { id: "contact", n: "06", label: "Contact" },
];
