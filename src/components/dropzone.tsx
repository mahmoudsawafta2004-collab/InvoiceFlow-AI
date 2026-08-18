"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { UploadCloud, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_FILES = 50;
const MAX_SIZE = 15 * 1024 * 1024; // 15MB per file

export function Dropzone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setRejectionMessage(null);
      if (rejections.length > 0) {
        const tooMany = rejections.some((r) =>
          r.errors.some((e) => e.code === "too-many-files")
        );
        const tooBig = rejections.some((r) =>
          r.errors.some((e) => e.code === "file-too-large")
        );
        const wrongType = rejections.some((r) =>
          r.errors.some((e) => e.code === "file-invalid-type")
        );
        if (tooMany) setRejectionMessage(`You can upload up to ${MAX_FILES} files at once.`);
        else if (tooBig) setRejectionMessage("Each file must be smaller than 15MB.");
        else if (wrongType) setRejectionMessage("Only PDF files are supported.");
        else setRejectionMessage("Some files could not be added.");
      }
      if (accepted.length > 0) onFiles(accepted);
    },
    [onFiles]
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
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16 text-center transition-colors",
          isDragActive
            ? "border-indigo-500 bg-indigo-50/50"
            : "border-neutral-200 bg-neutral-50/50 hover:border-neutral-300 hover:bg-neutral-50",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
          <UploadCloud className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="mt-4 text-sm font-medium text-neutral-900">
          {isDragActive ? "Drop your invoices here" : "Drag & drop invoice PDFs here"}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          or click to browse — up to {MAX_FILES} files, 15MB each
        </p>
      </div>
      {rejectionMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <FileWarning className="h-4 w-4 shrink-0" />
          {rejectionMessage}
        </div>
      )}
    </div>
  );
}
