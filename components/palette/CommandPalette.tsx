"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { searchCommands, type Command } from "@/lib/search";
import styles from "./palette.module.css";

/**
 * Search across the whole site: chapters, systems, experiments, failures,
 * boundaries, results, links. Every entry resolves to something that is
 * actually on a page, so this is navigation, not a terminal costume.
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /** Where focus came from, so Escape can put it back. */
  const openerRef = useRef<HTMLElement | null>(null);
  const listId = useId();
  const titleId = useId();

  const results = useMemo(() => searchCommands(query), [query]);
  const active = results[Math.min(index, results.length - 1)];

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
    // Opened from a shortcut with nothing focused: land on the button.
    const back = openerRef.current;
    if (back && back.isConnected && back !== document.body) back.focus();
    else buttonRef.current?.focus();
  }, []);

  const go = useCallback(
    (cmd: Command) => {
      setOpen(false);
      setQuery("");
      setIndex(0);
      if (cmd.external) {
        if (cmd.href.startsWith("mailto:")) window.location.href = cmd.href;
        else window.open(cmd.href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(cmd.href);
    },
    [router],
  );

  // Cmd/Ctrl+K from anywhere. Nothing else is bound globally.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [index, open, results.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (e.key === "Enter" && active) {
      e.preventDefault();
      go(active);
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={styles.opener}
        onClick={(e) => {
          openerRef.current = e.currentTarget;
          setOpen(true);
        }}
      >
        <span className={styles.openerLabel}>Search</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </button>

      {open ? (
        <div className={styles.scrim} onMouseDown={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={styles.panel}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <p id={titleId} className="visually-hidden">
              Search the site
            </p>
            <div className={styles.field}>
              <span className={styles.prompt} aria-hidden="true">
                /
              </span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search systems, failures, experiments…"
                value={query}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={active ? `cmd-${active.id}` : undefined}
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
              />
              <button type="button" className={styles.esc} onClick={close}>
                Esc
              </button>
            </div>

            <ul id={listId} ref={listRef} role="listbox" aria-label="Results" className={styles.list}>
              {results.map((c, i) => (
                <li
                  key={c.id}
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={active?.id === c.id}
                  data-active={active?.id === c.id}
                  className={styles.item}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(c)}
                >
                  <span className={styles.kind}>{c.kind}</span>
                  <span className={styles.label}>{c.label}</span>
                  {c.hint ? <span className={styles.hint}>{c.hint}</span> : null}
                  <span className={styles.arrow} aria-hidden="true">
                    {c.external ? "↗" : "→"}
                  </span>
                </li>
              ))}
            </ul>

            <p className={styles.empty} aria-live="polite">
              {results.length === 0 ? `Nothing matches “${query}”.` : ""}
            </p>

            <p className={styles.foot}>
              <span>↑↓ move</span>
              <span>↵ open</span>
              <span>esc close</span>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
