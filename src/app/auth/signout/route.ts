import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  // 303, not the default 307: a 307 preserves the method, so the browser would
  // re-POST to "/" — which has no POST handler — and land on a 405 instead of
  // the home page. 303 is what turns the redirect into the GET we want.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
