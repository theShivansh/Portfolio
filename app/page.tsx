import { ViewTransition } from "react";
import { About } from "@/components/about/About";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { Boundaries } from "@/components/boundaries/Boundaries";
import { Contact } from "@/components/contact/Contact";
import { EvidenceSection } from "@/components/evidence/EvidenceSection";
import { Experience } from "@/components/experience/Experience";
import { Failures } from "@/components/failures/Failures";
import { BuildLog } from "@/components/github/BuildLog";
import { WorldGate } from "@/components/motion/WorldGate";
import { Hero } from "@/components/hero/Hero";
import { SystemMap } from "@/components/map/SystemMap";
import { NotesSection } from "@/components/notes/NotesSection";
import { WorkSection } from "@/components/projects/WorkSection";
import { SystemsStory } from "@/components/systems/SystemsStory";

/** Revalidate the build log's GitHub facts once a day. */
export const revalidate = 86400;

/**
 * The order is the argument: what the systems are, what they are not
 * allowed to decide, how that is built and checked, where it broke anyway,
 * what that taught me, and who was watching.
 */
export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main" tabIndex={-1}>
        <Hero />
        <SystemMap />
        <SystemsStory />
        <WorkSection />
        <Boundaries />
        <ArchitectureSection />
        <EvidenceSection />
        <WorldGate from="paper" to="recorder" eyebrow="Chapter 07" chapter="failures" />
        <Failures />
        <NotesSection />
        <Experience />
        <About />
        <BuildLog />
        <Contact />
      </main>
    </ViewTransition>
  );
}
