import type { ReactNode } from "react";
import { ScrollStory } from "../motion/ScrollStory";
import { AchpPipeline } from "./achp/AchpPipeline";
import { EvidenceBoard } from "./crownx/EvidenceBoard";
import { FanChart } from "./moneymentor/FanChart";
import { StyleLabDemo } from "./stylelab/StyleLabDemo";
import { VitoLayers } from "./vitosynth/VitoLayers";
import { ZenStepCalm } from "./zenstep/ZenStepCalm";

type Interaction = { title: string; intro: string; node: (scope: string) => ReactNode };

/**
 * One interaction per project, each teaching the project's main idea.
 * `scope` keeps ids unique when the same interaction renders on two pages.
 */
export const interactions: Record<string, Interaction> = {
  stylelab: {
    title: "The model is not the source of truth",
    intro: "Switch between what the vision model inferred and what the owner confirmed.",
    node: () => <StyleLabDemo />,
  },
  "crown-x": {
    title: "One conflict, resolved in the open",
    intro: "Passages are quoted from the repository's demo workspace. The answer card is an illustrative rendering of the deployed flow.",
    node: (scope) => (
      <ScrollStory
        id={`${scope}-crownx-story`}
        label="Zone 02 · Evidence timeline"
        visual={<EvidenceBoard />}
        steps={[
          { title: "Retrieve", body: "Hybrid BM25 + k-NN search returns passages from three documents written on different dates." },
          { title: "Values disagree", body: "Rule-based extraction turns each passage into a typed claim. Two values for one fact: 20 and 22 September." },
          { title: "Code decides it's a conflict", body: "A deterministic predicate, not the model. Format differences like “22 Sept” vs “2026-09-22” never count." },
          { title: "Pick the current value", body: "The first written rule that applies: newest source date. 22 September 2026, and the reader sees why." },
          { title: "Answer with citations", body: "The model writes over exactly these passages. Uncited sentences are dropped. Open a citation to read it in place." },
        ]}
      />
    ),
  },
  achp: {
    title: "A claim under cross-examination",
    intro: "Example output from the repository's offline test run (mock LLM agents). Live outputs vary. Open a branch to inspect it.",
    node: (scope) => (
      <ScrollStory
        id={`${scope}-achp-story`}
        label="Zone 03 · Parallel branches"
        visual={<AchpPipeline />}
        steps={[
          { title: "A claim enters", body: "A rule-based security pass screens for injection, jailbreaks and PII before any model runs." },
          { title: "Retrieve evidence", body: "BM25 + FAISS over uploaded documents, with web search as a fallback and a semantic cache in front." },
          { title: "Decompose", body: "The Proposer splits the claim into atomic, checkable sub-claims with provenance." },
          { title: "Attack in parallel", body: "A factual attacker, a narrative auditor and the five-part integrity layer run at once. The stage costs only its slowest branch." },
          { title: "Judge", body: "The debate becomes a verdict and five metrics, each an explicit weighted formula." },
          { title: "Report", body: "A post-filter redacts PII; the report streams to the dashboard and exports as JSON or PDF." },
        ]}
      />
    ),
  },
  "moneymentor-ai": {
    title: "Probability, not a promise",
    intro: "Move the horizon. The spread widens because uncertainty compounds.",
    node: () => <FanChart />,
  },
  vitosynth: {
    title: "What is modelled",
    intro: "Six response dimensions, drawn without values. The prototype's outputs are simulations, not measurements.",
    node: () => <VitoLayers />,
  },
  zenstep: {
    title: "Less to look at, one step at a time",
    intro: "Analyze, choose the time you have, then work the list. The clutter settles as tasks close.",
    node: () => <ZenStepCalm />,
  },
};
