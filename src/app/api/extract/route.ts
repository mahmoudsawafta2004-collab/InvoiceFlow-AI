import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  const apiKey = req.headers.get("x-gemini-key") || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No Gemini API key configured. Add one in Settings or set GEMINI_API_KEY in your environment.",
        code: "NO_API_KEY",
      },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are supported." }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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
    const data = JSON.parse(text);

    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extraction failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
