import type { InvoiceData } from "./types";

export class ExtractionError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Failures worth a second try: Gemini's per-minute cap and its transient
 * "overloaded" state both clear on their own within seconds. Everything else
 * — a missing key, a spent plan quota, a corrupt PDF — is permanent for this
 * request, so retrying only delays the error the person needs to see.
 */
const RETRYABLE_CODES = new Set(["RATE_LIMIT", "OVERLOADED"]);

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 1200;

/**
 * Exponential backoff with jitter. The jitter matters more than the backoff:
 * a batch runs several uploads in parallel, so without it every in-flight
 * request would wake at the same instant and trip the same cap again.
 */
function backoffDelay(attempt: number): number {
  const ceiling = BASE_DELAY_MS * 2 ** (attempt - 1);
  return ceiling / 2 + Math.random() * (ceiling / 2);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestExtraction(file: File): Promise<InvoiceData> {
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

/**
 * Extracts one invoice, riding out Gemini's rate limit rather than surfacing
 * it. A batch of 50 on a free-tier key reliably outruns the per-minute cap,
 * and a row that failed for that reason alone reads to the user as though the
 * product could not handle their file. Retries cost nothing on the happy
 * path — they only run once a retryable failure has already come back.
 */
export async function extractInvoice(file: File): Promise<InvoiceData> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await requestExtraction(file);
    } catch (err) {
      const retryable =
        err instanceof ExtractionError &&
        err.code !== undefined &&
        RETRYABLE_CODES.has(err.code);

      if (!retryable || attempt >= MAX_ATTEMPTS) throw err;

      await sleep(backoffDelay(attempt));
    }
  }
}
