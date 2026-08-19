"use client";

import { useEffect, useState } from "react";

let cached: boolean | null = null;

/**
 * Whether the deployment supplies its own Gemini key. `null` while unknown, so
 * callers can avoid flashing a "add your key" prompt before the answer lands.
 */
export function useServerKeyConfigured(): boolean | null {
  const [configured, setConfigured] = useState<boolean | null>(cached);

  useEffect(() => {
    if (cached !== null) return;
    let active = true;

    fetch("/api/config")
      .then((res) => (res.ok ? res.json() : { serverKeyConfigured: false }))
      .then((json) => {
        cached = Boolean(json.serverKeyConfigured);
        if (active) setConfigured(cached);
      })
      .catch(() => {
        if (active) setConfigured(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return configured;
}
