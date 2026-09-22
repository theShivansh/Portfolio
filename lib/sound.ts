/**
 * Tactile feedback sounds, synthesized with WebAudio: no files to download.
 * Every sound is under 0.3 s, quiet, and plays only when the visitor has
 * turned sound on. Nothing autoplays.
 */

export type Cue = "open" | "toggle" | "tick" | "success";

let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (document.documentElement.dataset.sound !== "on") return null;
  const Ctor = window.AudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(ac: AudioContext, freq: number, start: number, length: number, gain: number, type: OscillatorType = "sine") {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.004);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(amp).connect(ac.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

/** Soft paper movement: a short band-passed noise swell. */
function paper(ac: AudioContext, start: number) {
  const len = 0.22;
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * len), ac.sampleRate);
  const data = buffer.getChannelData(0);
  // Deterministic noise: a linear congruential sequence, not Math.random().
  let s = 1234567;
  for (let i = 0; i < data.length; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    data[i] = (s / 0x7fffffff) * 2 - 1;
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 2400;
  band.Q.value = 0.7;
  const amp = ac.createGain();
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(0.05, start + 0.06);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + len);
  src.connect(band).connect(amp).connect(ac.destination);
  src.start(start);
}

export function play(cue: Cue): void {
  const ac = context();
  if (!ac) return;
  const t = ac.currentTime;
  switch (cue) {
    case "open":
      paper(ac, t);
      break;
    case "toggle":
      blip(ac, 1800, t, 0.03, 0.05, "square");
      blip(ac, 900, t + 0.018, 0.04, 0.04, "square");
      break;
    case "tick":
      blip(ac, 2600, t, 0.025, 0.035, "triangle");
      break;
    case "success":
      blip(ac, 660, t, 0.12, 0.05);
      blip(ac, 990, t + 0.08, 0.16, 0.045);
      break;
  }
}
