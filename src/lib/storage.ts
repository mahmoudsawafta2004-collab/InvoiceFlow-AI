import { useSyncExternalStore } from "react";
import type { Batch, InvoiceRow } from "./types";

const HISTORY_KEY = "invoiceflow.history";
const API_KEY_STORAGE = "invoiceflow.geminiKey";

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveBatch(rows: InvoiceRow[]): Batch {
  const batch: Batch = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    rowCount: rows.length,
    successCount: rows.filter((r) => r.status === "done").length,
    errorCount: rows.filter((r) => r.status === "error").length,
    rows,
  };

  const history = getHistory();
  history.unshift(batch);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  emitChange();
  return batch;
}

export function getHistory(): Batch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as Batch[]) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  emitChange();
}

export function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function setStoredApiKey(key: string) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key);
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
  emitChange();
}

let historyCache: Batch[] = [];
let historyCacheRaw: string | null = null;

function getHistorySnapshot(): Batch[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (raw !== historyCacheRaw) {
    historyCacheRaw = raw;
    try {
      historyCache = raw ? (JSON.parse(raw) as Batch[]) : [];
    } catch {
      historyCache = [];
    }
  }
  return historyCache;
}

const EMPTY_HISTORY: Batch[] = [];

function getHistoryServerSnapshot(): Batch[] {
  return EMPTY_HISTORY;
}

export function useHistory(): Batch[] {
  return useSyncExternalStore(subscribe, getHistorySnapshot, getHistoryServerSnapshot);
}

function getApiKeySnapshot(): string {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

function getApiKeyServerSnapshot(): string {
  return "";
}

export function useApiKey(): string {
  return useSyncExternalStore(subscribe, getApiKeySnapshot, getApiKeyServerSnapshot);
}
