import { ViewTransition } from "react";
import { About } from "@/components/about/About";
import { ArchitectureSection } from "@/components/architecture/ArchitectureSection";
import { Contact } from "@/components/contact/Contact";
import { BuildLog } from "@/components/github/BuildLog";
import { Hero } from "@/components/hero/Hero";
import { NotesSection } from "@/components/notes/NotesSection";
import { WorkSection } from "@/components/projects/WorkSection";
import { SystemsSnapshot } from "@/components/systems/SystemsSnapshot";

/** Revalidate the build log's GitHub facts once a day. */
export const revalidate = 86400;

export default function Home() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="main" tabIndex={-1}>
        <Hero />
        <SystemsSnapshot />
        <WorkSection />
        <ArchitectureSection />
        <NotesSection />
        <About />
        <BuildLog />
        <Contact />
      </main>
    </ViewTransition>
  );
}
