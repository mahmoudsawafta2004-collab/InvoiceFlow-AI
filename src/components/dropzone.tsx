"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

const MAX_FILES = 50;
const MAX_SIZE = 15 * 1024 * 1024; // 15MB per file

export function Dropzone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const dz = t.dropzone;
  const [rejection, setRejection] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setRejection(null);
      if (rejections.length > 0) {
        const has = (code: string) =>
          rejections.some((r) => r.errors.some((e) => e.code === code));
        if (has("too-many-files")) setRejection(dz.errors.tooMany(MAX_FILES));
        else if (has("file-too-large")) setRejection(dz.errors.tooBig);
        else if (has("file-invalid-type")) setRejection(dz.errors.wrongType);
        else setRejection(dz.errors.generic);
      }
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles, dz]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: MAX_FILES,
    maxSize: MAX_SIZE,
    disabled,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed px-6 py-16 text-center transition-colors duration-200",
          isDragActive
            ? "border-accent bg-accent-soft"
            : "border-line-strong bg-surface-2 hover:border-ink-3 hover:bg-surface-3",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.06, y: -2 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200",
            isDragActive ? "bg-accent text-accent-ink" : "bg-surface-3 text-ink-2"
          )}
        >
          <UploadCloud className="h-5 w-5" />
        </motion.div>

        <p className="mt-4 text-sm font-medium text-ink">
          {isDragActive ? dz.dragActive : dz.dragIdle}
        </p>
        <p className="mt-1 text-[13px] text-ink-3">{dz.hint(MAX_FILES)}</p>
      </div>

      <AnimatePresence>
        {rejection && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="flex items-center gap-2 overflow-hidden rounded-lg bg-bad-soft px-3 py-2 text-[13px] text-bad"
          >
            <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
            {rejection}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
