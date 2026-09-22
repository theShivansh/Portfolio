import { ScrollStory } from "../motion/ScrollStory";
import { NoteToSystemVisual } from "./NoteToSystemVisual";

/** Zone 01. The one major immersive moment on the site. */
export function NoteToSystem() {
  return (
    <ScrollStory
      id="note-to-system"
      label="Zone 01 · From note to system"
      visual={<NoteToSystemVisual />}
      steps={[
        {
          title: "Sketch",
          body: "Every system here started as three boxes on paper: input, model, output. It is a useful lie.",
        },
        {
          title: "Annotation",
          body: "The questions go in the margin. Where does the truth live? Who checks the output? What happens when the model is wrong?",
        },
        {
          title: "Structure",
          body: "Answering them splits the model box into stages, each with one job: retrieve, orchestrate, validate, let a person correct.",
        },
        {
          title: "System",
          body: "Then the paths that matter: stores the model reads from, a bounded retry when validation rejects, corrections that ground the next run.",
        },
        {
          title: "Live interface",
          body: "Finally every stage reports its state, so the interface can show what was checked, not just what was generated. The sketch stays underneath.",
        },
      ]}
    />
  );
}
