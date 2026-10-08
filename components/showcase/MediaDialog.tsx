"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./showcase.module.css";

/**
 * A native modal <dialog>. The browser does the hard parts: Escape closes
 * it, focus is trapped inside, everything behind it is inert, and focus
 * returns to whatever opened it. This adds the backdrop click, the scroll
 * lock, and the entrance (a soft scale and fade, defined in CSS).
 */
export function MediaDialog({
  open,
  onClose,
  labelledBy,
  wide = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  wide?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null;
      d.showModal();
      document.documentElement.dataset.dialog = "";
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onDialogClose = () => {
      delete document.documentElement.dataset.dialog;
      onClose();
      opener.current?.focus({ preventScroll: true });
    };
    d.addEventListener("close", onDialogClose);
    return () => d.removeEventListener("close", onDialogClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${wide ? styles.dialogWide : ""}`}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        // A click on the backdrop lands on the dialog element itself.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {open ? children : null}
    </dialog>
  );
}
