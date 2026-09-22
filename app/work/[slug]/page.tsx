import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { CaseFile } from "@/components/projects/CaseFile";
import { CaseHeader } from "@/components/projects/CaseHeader";
import { ViewTransitionLink } from "@/components/motion/ViewTransitionLink";
import { getProject, nextProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import styles from "./page.module.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title}: ${p.subtitle}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { type: "article", url: `/work/${p.slug}`, title, description: p.description, siteName: site.name },
    twitter: { card: "summary_large_image", title, description: p.description },
  };
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.description,
    codeRepository: p.repository,
    programmingLanguage: p.stack.slice(0, 3),
    author: { "@type": "Person", name: site.name, url: site.url },
    ...(p.liveDemo ? { url: p.liveDemo } : {}),
  };

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main" tabIndex={-1} className={styles.main}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <div className="page sheet">
          <div className={`margin ${styles.margin}`}>
            <ViewTransitionLink href={`/#${p.tier === "archive" ? "archive" : p.slug}`} direction="back" className={styles.back}>
              ← All work
            </ViewTransitionLink>
            <p className="meta">Case file</p>
            <p className={styles.caseMeta}>
              {p.started}
              <br />
              {p.status}
            </p>
          </div>
          <div className="body">
            <CaseHeader project={p} as="h1" openLink={false} />
            <p className={styles.description}>{p.description}</p>
            <CaseFile project={p} variant="page" />

            <nav className={styles.next} aria-label="Next case">
              <p className="meta">Next case file</p>
              <ViewTransitionLink href={`/work/${next.slug}`} className={styles.nextLink} data-track="project_open" data-project={next.slug}>
                <span className={styles.nextN}>{next.number}</span>
                <span className={styles.nextTitle}>{next.title}</span>
                <span className={styles.nextSub}>{next.subtitle}</span>
              </ViewTransitionLink>
            </nav>
          </div>
        </div>
      </main>
    </ViewTransition>
  );
}
