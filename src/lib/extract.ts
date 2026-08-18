import type { InvoiceData } from "./types";
import { getStoredApiKey } from "./storage";

export class ExtractionError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

export async function extractInvoice(file: File): Promise<InvoiceData> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  const key = getStoredApiKey();
  if (key) headers["x-gemini-key"] = key;

  const res = await fetch("/api/extract", {
    method: "POST",
    headers,
    body: formData,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new ExtractionError(json.error || "Extraction failed.", json.code);
  }

  return json.data as InvoiceData;
}
