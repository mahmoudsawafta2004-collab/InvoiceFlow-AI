"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function EditableCell({
  value,
  onChange,
  align = "left",
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  align?: "left" | "right";
  type?: "text" | "number";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    setEditing(false);
    if (draft !== value) onChange(draft);
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        className={cn(
          "w-full rounded-md border border-indigo-300 bg-white px-2 py-1 text-sm shadow-sm outline-none ring-2 ring-indigo-100",
          align === "right" && "text-right"
        )}
      />
    );
  }

  return (
    <button
      type="button"
      title={value}
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "block w-full truncate whitespace-nowrap rounded-md px-2 py-1 text-sm hover:bg-neutral-100",
        align === "right" ? "text-right tabular-nums" : "text-left"
      )}
    >
      {value || <span className="text-neutral-300">—</span>}
    </button>
  );
}
