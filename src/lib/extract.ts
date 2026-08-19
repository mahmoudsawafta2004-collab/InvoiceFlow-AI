import type { InvoiceData } from "./types";

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

  let res: Response;
  try {
    res = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ExtractionError(
      "Could not reach the server. Check your connection and try again."
    );
  }

  let json: { data?: InvoiceData; error?: string; code?: string };
  try {
    json = await res.json();
  } catch {
    throw new ExtractionError("Unexpected server response. Please try again.");
  }

  if (!res.ok) {
    throw new ExtractionError(json.error || "Extraction failed.", json.code);
  }

  return json.data as InvoiceData;
}
