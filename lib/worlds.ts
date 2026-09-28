/**
 * Worlds.
 *
 * Every case file gets its own surface, drawn from what that system
 * actually handles rather than from a science-fiction palette. Three of
 * them go fully dark, because three of these systems are about things that
 * happen in the dark: an archive, a cross-examination, and a recorder.
 *
 * The one constant across every world is the signal colour. Lime never
 * changes meaning, whatever the paper underneath it is doing.
 *
 * Surfaces are defined as token rebindings in app/worlds.css. This file is
 * only the naming, the copy, and which system lives where.
 */

export type WorldId =
  | "paper"
  | "studio"
  | "vault"
  | "chamber"
  | "field"
  | "clinic"
  | "calm"
  | "archive"
  | "recorder";

export type World = {
  id: WorldId;
  /** What the place is called on a threshold. */
  name: string;
  /** One line, in the language of the place. */
  line: string;
  dark: boolean;
};

export const worlds: Record<WorldId, World> = {
  paper: {
    id: "paper",
    name: "The notebook",
    line: "Where the thinking is done before anything is built.",
    dark: false,
  },
  studio: {
    id: "studio",
    name: "The studio",
    line: "A garment on a sweep, lit well enough for a model to be wrong about it.",
    dark: false,
  },
  vault: {
    id: "vault",
    name: "The vault",
    line: "Documents that disagree, and the rule that decides which one is current.",
    dark: true,
  },
  chamber: {
    id: "chamber",
    name: "The chamber",
    line: "One claim, three attacks running at once, and a judge at the end of it.",
    dark: true,
  },
  field: {
    id: "field",
    name: "The field",
    line: "Twelve hundred futures, plotted, before anyone says a number out loud.",
    dark: false,
  },
  clinic: {
    id: "clinic",
    name: "The clinic",
    line: "A meal, and six things it might do over the next four hours.",
    dark: false,
  },
  calm: {
    id: "calm",
    name: "The quiet room",
    line: "More chaos, less time, smaller steps.",
    dark: false,
  },
  archive: {
    id: "archive",
    name: "The archive",
    line: "Where it started: collecting other people's tools before building any.",
    dark: false,
  },
  recorder: {
    id: "recorder",
    name: "The recorder",
    line: "Seven things that broke, kept exactly as they were found.",
    dark: true,
  },
};

/** Which world each case file is set in. */
export const projectWorld: Record<string, WorldId> = {
  stylelab: "studio",
  "crown-x": "vault",
  achp: "chamber",
  "moneymentor-ai": "field",
  vitosynth: "clinic",
  zenstep: "calm",
  aixplorer: "archive",
};

export function worldFor(slug: string): World {
  return worlds[projectWorld[slug] ?? "paper"];
}

/** The drawing a threshold shows for the world you are walking into. */
export type Signature = "sweep" | "slots" | "spotlight" | "trace";

export const worldSignature: Partial<Record<WorldId, Signature>> = {
  studio: "sweep",
  vault: "slots",
  chamber: "spotlight",
  recorder: "trace",
};
