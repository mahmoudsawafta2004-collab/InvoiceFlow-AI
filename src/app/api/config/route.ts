import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reports whether the deployment has its own Gemini key configured, so the UI
 * knows extraction works without the visitor supplying one. Only a boolean is
 * returned — never the key itself.
 */
export function GET() {
  return NextResponse.json({
    serverKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
}
