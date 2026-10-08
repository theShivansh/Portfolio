"use client";

import { useEffect } from "react";

/**
 * Mirrors the world currently under the header onto <html>, as
 * data-surface (and data-surface-dark when it is one of the dark ones).
 *
 * Nothing about the page's own colours depends on this: every world
 * section paints itself. This only carries the world out to the two
 * surfaces a section cannot reach — the page background behind overscroll,
 * and the sticky header sitting on top of it.
 */
export function WorldWatcher() {
  useEffect(() => {
    const root = document.documentElement;
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-world]:not([data-world-ignore])"));
    if (!zones.length) return;

    const apply = () => {
      // The world owning the strip of page just under the header.
      const probe = 72;
      let current: HTMLElement | null = null;
      for (const el of zones) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) current = el;
      }
      const world = current?.dataset.world ?? "paper";
      const dark = current?.dataset.worldDark !== undefined;
      root.dataset.surface = world;
      if (dark) root.dataset.surfaceDark = "";
      else delete root.dataset.surfaceDark;
    };

    // One observer wakes the recompute; the read itself is a cheap loop.
    const io = new IntersectionObserver(apply, { threshold: [0, 0.01, 0.99, 1] });
    zones.forEach((z) => io.observe(z));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // A section can change world in place (the flagship deck does).
    window.addEventListener("fi:world", onScroll);
    const raf = requestAnimationFrame(apply);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("fi:world", onScroll);
      cancelAnimationFrame(raf);
      delete root.dataset.surface;
      delete root.dataset.surfaceDark;
    };
  }, []);

  return null;
}
