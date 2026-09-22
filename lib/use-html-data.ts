"use client";

import { useSyncExternalStore } from "react";

/**
 * Site preferences live as data attributes on <html> (set before paint by
 * the boot script). This hook reads one as an external store, so every
 * control stays in sync without effects or duplicated state.
 */
export function useHtmlData(key: "motion" | "sound" | "field", serverValue: string): string {
  return useSyncExternalStore(
    (onChange) => {
      const obs = new MutationObserver(onChange);
      obs.observe(document.documentElement, { attributes: true, attributeFilter: [`data-${key}`] });
      return () => obs.disconnect();
    },
    () => document.documentElement.dataset[key] ?? serverValue,
    () => serverValue,
  );
}
