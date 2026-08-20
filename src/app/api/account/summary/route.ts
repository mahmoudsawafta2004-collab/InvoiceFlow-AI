import { NextResponse } from "next/server";
import { getAccountSummary } from "@/lib/account-summary";

export const dynamic = "force-dynamic";

/**
 * Kept for clients that need to re-read account state after it changes (a
 * completed checkout, a plan switch). First paint no longer depends on it —
 * the app layout seeds the same data straight from the server.
 */
export async function GET() {
  return NextResponse.json(await getAccountSummary());
}
