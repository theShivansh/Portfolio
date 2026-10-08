import { flagships, videoFiles } from "@/lib/showcase";
import { site } from "@/lib/site";
import { FlagshipDeck } from "./FlagshipDeck";

/**
 * Chapter 01. The deck is interactive; the structured data beside it is
 * not, so search engines read each demo as a VideoObject with its real
 * duration, poster and file.
 */
export function Flagships() {
  const abs = (path: string) => new URL(path, site.url).toString();
  const videos = flagships.map(({ project, showcase }) => {
    const f = videoFiles(showcase.video.base);
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: `${project.title}: ${showcase.line}`,
      description: showcase.video.description,
      thumbnailUrl: [abs(f.poster)],
      contentUrl: abs(f.hd),
      uploadDate: showcase.video.uploaded,
      duration: `PT${Math.round(showcase.video.duration)}S`,
      embedUrl: abs(`/#${project.slug}`),
      creator: { "@type": "Person", name: site.name, url: site.url },
    };
  });

  return (
    <>
      <FlagshipDeck flagships={flagships} />
      <script
        type="application/ld+json"
        // Static, build-time data from lib/showcase.ts; no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videos).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
