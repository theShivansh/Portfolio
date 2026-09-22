"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Chapter } from "@/lib/site";
import styles from "./nav.module.css";

/**
 * Chapter links plus orientation: which chapter the reader is in now.
 * One IntersectionObserver watches the chapter sections, nothing else.
 */
export function ChapterNav({ chapters }: { chapters: Chapter[] }) {
  const pathname = usePathname();
  const [observed, setObserved] = useState<string | null>(null);
  // Only the home page has chapters; elsewhere nothing is current.
  const current = pathname === "/" ? observed : null;
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setObserved((e.target as HTMLElement).dataset.chapter ?? null);
        }
      },
      // A thin band at 40% of the viewport decides the current chapter.
      { rootMargin: "-40% 0px -59% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const active = chapters.find((c) => c.id === current);

  const list = (
    <ol className={styles.chapters}>
      {chapters.map((c) => (
        <li key={c.id}>
          <Link
            href={`/#${c.id}`}
            className={styles.chapter}
            aria-current={c.id === current ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <span className={styles.chapterN}>[{c.n}]</span> {c.label}
          </Link>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <nav aria-label="Chapters" className={styles.desktopNav}>
        {list}
      </nav>

      <div className={styles.mobileNav}>
        <p className={styles.readout} aria-live="polite">
          {active ? (
            <>
              <span className={styles.chapterN}>{active.n} /</span> {active.label}
            </>
          ) : (
            <span className={styles.chapterN}>Field note</span>
          )}
        </p>
        <button
          ref={buttonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id={menuId} aria-label="Chapters" className={styles.menu} data-open={open} hidden={!open}>
          {list}
        </nav>
      </div>
    </>
  );
}
