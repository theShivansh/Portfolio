/**
 * Privacy-light event tracking. Records only which kind of link was used and
 * which project it belonged to: no identifiers, no text, no coordinates.
 *
 * Forwards to Vercel Analytics or Plausible when either is installed on the
 * page; otherwise emits a DOM event and does nothing else.
 */

export type TrackEvent = "project_open" | "live_demo" | "github" | "resume" | "contact";

type Props = { project?: string };

declare global {
  interface Window {
    va?: (event: "event", payload: { name: string; data?: Props }) => void;
    plausible?: (name: string, opts?: { props?: Props }) => void;
  }
}

const allowed = new Set<TrackEvent>(["project_open", "live_demo", "github", "resume", "contact"]);

export function isTrackEvent(v: string | undefined): v is TrackEvent {
  return !!v && allowed.has(v as TrackEvent);
}

export function track(name: TrackEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  window.va?.("event", { name, data: props });
  window.plausible?.(name, { props });
  window.dispatchEvent(new CustomEvent("fi:track", { detail: { name, ...props } }));
}
