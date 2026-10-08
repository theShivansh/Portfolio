"use client";

import { useEffect, useRef } from "react";

export type FieldWorld = "chamber" | "vault" | "studio";

const WORLD_INDEX: Record<FieldWorld, number> = { chamber: 0, vault: 1, studio: 2 };

/*
 * One fragment shader, three places.
 *
 *   chamber  ACHP's room: one light aimed down at one claim, dust in the beam.
 *   vault    CROWN-X's ledger: ruled lines, a slow read-head passing over them.
 *   studio   StyleLab's sweep: paper backdrop under a moving softbox.
 *
 * Changing world does not cross-fade. The new place eats the old one along a
 * noise front, and the front itself is drawn in the signal colour: the only
 * moment lime appears on this surface is the moment something changes.
 */
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uPx;
uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uMix;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

vec3 chamber(vec2 uv, vec2 px) {
  vec3 c = vec3(0.027, 0.027, 0.039);
  vec2 src = vec2(0.5, 1.12);
  vec2 d = uv - src;
  d.x *= uRes.x / uRes.y;
  float ang = abs(atan(d.x, -d.y));
  float cone = smoothstep(0.42, 0.05, ang) * smoothstep(1.9, 0.2, length(d));
  float breathe = 0.86 + 0.14 * sin(uTime * 0.55);
  c += vec3(1.0, 0.95, 0.84) * cone * 0.085 * breathe;
  // a cold floor, the colour of the demo's own glow
  c += vec3(0.07, 0.09, 0.22) * smoothstep(0.55, 0.0, uv.y) * 0.32;
  // dust drifting through the beam
  float dust = step(0.9965, hash(floor(px / 3.0) + floor(vec2(uTime * 2.0, -uTime * 7.0))));
  c += vec3(1.0, 0.96, 0.86) * dust * cone * 0.55;
  return c;
}

vec3 vault(vec2 uv, vec2 px) {
  vec3 c = vec3(0.051, 0.063, 0.078);
  float row = 30.0;
  float y = px.y / row;
  float line = smoothstep(1.4, 0.0, abs(fract(y) * row - row * 0.5));
  float head = fract(uTime * 0.045);
  float band = exp(-pow((uv.y - (1.15 - head * 1.3)) * 7.0, 2.0));
  c += vec3(0.62, 0.72, 0.95) * line * (0.02 + band * 0.08);
  c += vec3(0.25, 0.32, 0.5) * band * 0.035;
  // one margin rule, as in a ledger
  float margin = smoothstep(1.2, 0.0, abs(px.x - uRes.x / uPx * 0.06));
  c += vec3(0.95, 0.6, 0.25) * margin * 0.10;
  return c;
}

vec3 studio(vec2 uv, vec2 px) {
  vec3 c = vec3(0.886, 0.871, 0.831);
  // the sweep: lighter at the bend, falling off to the floor and walls
  c *= 0.93 + 0.09 * smoothstep(0.0, 0.65, uv.y) - 0.05 * smoothstep(0.7, 1.0, uv.y);
  float t = uTime * 0.07;
  vec2 box = vec2(0.5 + 0.32 * sin(t), 0.72 + 0.08 * cos(t * 1.3));
  vec2 d = uv - box; d.x *= uRes.x / uRes.y;
  c += vec3(1.0, 0.99, 0.97) * exp(-dot(d, d) * 3.2) * 0.07;
  c += (noise(px / 1.6) - 0.5) * 0.022;
  return c;
}

vec3 world(float w, vec2 uv, vec2 px) {
  if (w < 0.5) return chamber(uv, px);
  if (w < 1.5) return vault(uv, px);
  return studio(uv, px);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 px = gl_FragCoord.xy / uPx;
  vec3 a = world(uFrom, uv, px);
  vec3 b = world(uTo, uv, px);
  float n = fbm(uv * vec2(uRes.x / uRes.y, 1.0) * 2.6 + 3.1);
  float edge = uMix * 1.25 - 0.12;
  float m = 1.0 - smoothstep(edge - 0.035, edge + 0.035, n);
  vec3 col = mix(a, b, m);
  float front = smoothstep(0.03, 0.0, abs(n - edge)) * step(0.001, uMix) * step(uMix, 0.999);
  col = mix(col, vec3(0.784, 1.0, 0.0), front * 0.75);
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const MORPH_MS = 950;

/**
 * The surface behind the flagship deck. Decorative: aria-hidden, no input,
 * and the section's own CSS background is the fallback whenever WebGL is
 * missing. It only animates while on screen, renders at half resolution
 * (everything it draws is soft), and holds a still frame under reduced
 * motion.
 */
export function WorldField({ world, still, className }: { world: FieldWorld; still: boolean; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ go: (w: FieldWorld) => void; setStill: (s: boolean) => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl || gl.isContextLost()) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uPx = u("uPx"), uTime = u("uTime"), uFrom = u("uFrom"), uTo = u("uTo"), uMix = u("uMix");

    let from = WORLD_INDEX[world];
    let to = from;
    let morphStart = -Infinity;
    let isStill = still;
    let visible = false;
    let raf = 0;
    const t0 = performance.now();

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uPx, scale);
    };

    const draw = (now: number) => {
      const k = isStill ? 1 : Math.min(1, (now - morphStart) / MORPH_MS);
      if (k >= 1) from = to;
      gl.uniform1f(uTime, isStill ? 4 : (now - t0) / 1000);
      gl.uniform1f(uFrom, from);
      gl.uniform1f(uTo, to);
      gl.uniform1f(uMix, from === to ? 1 : 1 - Math.pow(1 - k, 3));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "";
    };

    const loop = (now: number) => {
      draw(now);
      raf = visible && !isStill && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);
    const onVis = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVis);

    api.current = {
      go: (w) => {
        const next = WORLD_INDEX[w];
        if (next === to) return;
        from = isStill ? next : to;
        to = next;
        morphStart = performance.now();
        if (isStill) draw(performance.now());
        else kick();
      },
      setStill: (s) => {
        isStill = s;
        if (s) draw(performance.now());
        else kick();
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      api.current = null;
      // The context is left to the browser: React may mount this twice
      // (StrictMode), and a context lost on purpose cannot be had back.
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
    // The context is built once; world and motion changes go through api.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api.current?.go(world);
  }, [world]);

  useEffect(() => {
    api.current?.setStill(still);
  }, [still]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
