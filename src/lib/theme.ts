"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "invoiceflow.theme";

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function toggleTheme() {
  const next = !isDark();
  document.documentElement.classList.toggle("dark", next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  } catch {}
  for (const listener of listeners) listener();
}

/**
 * The `dark` class on <html> is external state — it is set before hydration by
 * the inline theme script — so it is read through a store rather than an
 * effect. The server snapshot is `false` so markup matches the light default.
 */
export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, isDark, () => false);
}
