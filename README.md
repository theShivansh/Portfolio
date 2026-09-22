# FIELD/INTELLIGENCE

Portfolio of **Shivansh Shukla**, AI engineer. A human-made AI systems field notebook: editorial pages, hand-drawn annotations, and working system diagrams that explain each project by letting you use it.

## Stack

- Next.js 16.3 (App Router, Turbopack), React 19.3, TypeScript (strict), Tailwind CSS 4 for the reset and theme bridge; component styles are CSS Modules over a single token layer (`app/tokens.css`).
- No animation library. Motion uses native CSS scroll-driven animations (`animation-timeline: view()/scroll()`), CSS transitions, React `<ViewTransition>` and one shared `IntersectionObserver` step controller. Browsers without scroll timelines get a one-shot timed fallback or the final state.
- Fonts are self-hosted (`app/fonts`, SIL OFL): Bricolage Grotesque (display + body), IBM Plex Mono (metadata), Caveat (annotations only, not preloaded).
- Every page is statically prerendered. The build log refreshes GitHub push dates daily (ISR) and falls back to curated data if the API is unreachable.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build && npm start
```

## Configure

All optional. Copy `.env.example` to `.env.local`.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap and Open Graph base. On Vercel, the production domain is used automatically. |
| `NEXT_PUBLIC_RESUME_PATH` | Put a PDF in `public/` (e.g. `public/resume.pdf`) and set `/resume.pdf`. Every "Download resume" link appears only when this is set. |
| `NEXT_PUBLIC_LINKEDIN_URL` | Adds LinkedIn to the footer and structured data. |

## Content

Content is data, not markup. To add or edit a project, change `lib/projects.ts` (typed by `lib/types.ts`); lab notes, principles, the proof table and the timeline live in `lib/content.ts`.

**Source-of-truth rule:** every number on the site is copied from the project's own README or docs, and every evidence item says how it is known (`test-verified`, `measured`, `own benchmark`, `reported in README`). Don't add a claim the repository doesn't support.

Project interactions live in `components/projects/*` and are registered in `components/projects/interactions.tsx`.

## Structure

```
app/                 routes: /, /work/[slug], /notes, /about, 404, sitemap, robots, OG image
components/
  motion/            ScrollStory (pinned zones), StopMotion, Reveal, SectionMarker,
                     Annotation, HandDrawnLine, ViewTransitionLink, MotionSafe
  hero/ systems/ projects/ architecture/ notes/ evidence/ about/ github/ contact/
  diagrams/          ArchitectureDiagram (data-driven pipeline figure)
  navigation/ accessibility/
lib/                 content model, sketch geometry (seeded, deterministic), motion tokens,
                     sound (WebAudio, no files), analytics hooks, GitHub build log
public/images/       real screenshots: from each repository, or captured from the live demos
```

## Motion and accessibility

- Three pinned "soft friction" zones (Note → System, CROWN-X evidence, ACHP branches). Each shows a chapter label, step progress, step buttons and a Skip link. They pin only on screens at least 768 px wide and 600 px tall; elsewhere they show their final state with the steps as short sections.
- **Motion: Full / Reduced** follows the OS setting until changed. Reduced motion lands every animation on its final state and stops stop-motion loops.
- **Sound** is off by default. Cues are under 0.3 s, synthesized on demand, and never autoplay.
- **Field mode** is optional: it adds handwritten annotations, extra metadata and the graph-paper grid. Nothing essential is hidden behind it.
- Skip links, visible focus everywhere, native `<details>` for the evidence table, no hover-only interactions, and 44 px touch targets.

## Analytics

`lib/analytics.ts` records `project_open`, `live_demo`, `github`, `resume` and `contact` clicks through `[data-track]` attributes, forwarding to Vercel Analytics or Plausible only if one is installed. Nothing personal is recorded.
