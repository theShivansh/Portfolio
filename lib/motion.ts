/**
 * Motion tokens for the few places JavaScript needs them.
 * CSS equivalents live in app/tokens.css; keep the two in step.
 */
export const duration = {
  micro: 150,
  small: 240,
  medium: 400,
  large: 700,
} as const;

/** Stop-motion runs "on twos", like hand-drawn animation. */
export const stopMotionFps = 10;

export type MotionPreference = "full" | "reduced";
export type SoundPreference = "on" | "off";

export const storageKeys = {
  motion: "fi:motion",
  sound: "fi:sound",
  field: "fi:field",
  intro: "fi:intro",
} as const;

/** Reads the effective motion preference set on <html> by the boot script. */
export function currentMotion(): MotionPreference {
  if (typeof document === "undefined") return "full";
  return document.documentElement.dataset.motion === "reduced" ? "reduced" : "full";
}

/**
 * Runs before paint (inlined in <head>) so preferences never flash.
 * Motion: stored choice, else the OS setting. Sound: off unless chosen.
 * Intro plate: once per session, full motion only, not on a deep link or a
 * background tab; any input lifts it early.
 */
export const bootScript = `(()=>{try{var d=document.documentElement,s=localStorage,m=s.getItem("${storageKeys.motion}");d.dataset.motionChoice=m||"system";d.dataset.motion=m||(matchMedia("(prefers-reduced-motion: reduce)").matches?"reduced":"full");d.dataset.sound=s.getItem("${storageKeys.sound}")==="on"?"on":"off";d.dataset.field=s.getItem("${storageKeys.field}")==="on"?"on":"off";}catch(e){}try{var t=sessionStorage;if(d.dataset.motion!=="reduced"&&!location.hash&&document.visibilityState==="visible"&&!t.getItem("${storageKeys.intro}")){t.setItem("${storageKeys.intro}","1");d.dataset.intro="play";var v=["pointerdown","keydown","wheel","touchstart"],o={capture:true,passive:true},x=function(){d.dataset.intro="done";v.forEach(function(n){removeEventListener(n,x,o)})};v.forEach(function(n){addEventListener(n,x,o)});addEventListener("animationend",function y(e){if(e.animationName.indexOf("plate-off")>-1){removeEventListener("animationend",y);x()}});requestAnimationFrame(function(){requestAnimationFrame(function(){if(d.dataset.intro==="play")d.dataset.intro="run"})});setTimeout(x,6000)}}catch(e){}})();`;
