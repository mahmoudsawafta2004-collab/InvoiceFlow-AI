import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser, getUsageInfo } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB, mirrors the client-side dropzone limit

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    supplierName: fieldSchema(SchemaType.STRING),
    invoiceNumber: fieldSchema(SchemaType.STRING),
    invoiceDate: fieldSchema(SchemaType.STRING),
    dueDate: fieldSchema(SchemaType.STRING),
    currency: fieldSchema(SchemaType.STRING),
    subtotal: fieldSchema(SchemaType.NUMBER),
    tax: fieldSchema(SchemaType.NUMBER),
    total: fieldSchema(SchemaType.NUMBER),
  },
  required: [
    "supplierName",
    "invoiceNumber",
    "invoiceDate",
    "dueDate",
    "currency",
    "subtotal",
    "tax",
    "total",
  ],
} as unknown as Schema;

function fieldSchema(valueType: SchemaType): Schema {
  return {
    type: SchemaType.OBJECT,
    properties: {
      value: { type: valueType },
      confidence: {
        type: SchemaType.NUMBER,
        description: "Confidence from 0 to 1 that this value was read correctly.",
      },
    },
    required: ["value", "confidence"],
  } as unknown as Schema;
}

const PROMPT = `You are an expert accounting assistant. Extract the following fields from this invoice document:
- supplierName: the vendor/supplier/company name issuing the invoice
- invoiceNumber: the invoice number or reference ID
- invoiceDate: the invoice issue date, formatted as YYYY-MM-DD
- dueDate: the payment due date, formatted as YYYY-MM-DD (if not present, estimate as empty string)
- currency: the 3-letter ISO currency code (e.g. USD, EUR, JOD). Infer from symbols if needed.
- subtotal: the subtotal amount before tax, as a plain number (no currency symbols or commas)
- tax: the VAT/tax amount, as a plain number. If no tax line exists, use 0.
- total: the final total amount due, as a plain number

For each field, also return a confidence score between 0 and 1 reflecting how certain you are the value is correct and was read directly from the document. Use lower confidence if a value was inferred, ambiguous, or missing from the source.
Return ONLY the structured data.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Extraction is not available right now. Please try again later.",
        code: "NO_API_KEY",
      },
      { status: 503 }
    );
  }

  // Once accounts are configured, every extraction must be attributed to a
  // signed-in user and checked against their plan — this is the only place
  // usage is actually enforced, so it has to hold even if the UI is bypassed.
  let userId: string | null = null;
  if (isSupabaseConfigured()) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Sign in to extract invoices.", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const usage = await getUsageInfo(user);
    if (usage.limit !== null && usage.remaining !== null && usage.remaining <= 0) {
      return NextResponse.json(
        {
          error: `You've used all ${usage.limit} invoices on your current plan for this billing period. Upgrade to continue.`,
          code: "USAGE_LIMIT",
        },
        { status: 402 }
      );
    }
    userId = user.id;
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 15MB." },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json({ error: "This file is empty." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const header = Buffer.from(bytes.slice(0, 5)).toString("ascii");
  if (header !== "%PDF-") {
    return NextResponse.json(
      { error: "This file is not a valid PDF. It may be corrupted or mislabeled." },
      { status: 400 }
    );
  }

  const base64 = Buffer.from(arrayBuffer).toString("base64");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType: "application/pdf" } },
      { text: PROMPT },
    ]);

    const text = result.response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "The AI response could not be read. Please try this invoice again." },
        { status: 502 }
      );
    }

    if (userId) {
      const admin = createAdminClient();
      // Best-effort: a logging failure must never block a successful
      // extraction from reaching the user.
      await admin
        ?.from("usage_events")
        .insert({ user_id: userId, file_name: file.name })
        .then(undefined, () => {});
    }

    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed.";

    if (/api[ _]?key/i.test(message) || /API_KEY_INVALID/i.test(message)) {
      return NextResponse.json(
        { error: "Extraction is not available right now. Please try again later." },
        { status: 503 }
      );
    }
    if (/quota|rate.?limit|429/i.test(message)) {
      return NextResponse.json(
        { error: "Gemini rate limit reached. Wait a moment and try again." },
        { status: 429 }
      );
    }
    if (/503|overloaded|unavailable/i.test(message)) {
      return NextResponse.json(
        { error: "Gemini is temporarily overloaded. Please retry this invoice." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Extraction failed for this invoice. Please try again." },
      { status: 500 }
    );
  }
}
