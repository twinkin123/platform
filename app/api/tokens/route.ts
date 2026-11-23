import { NextResponse } from "next/server";
import { getTokens } from "@/lib/scan";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(await getTokens(), {
    headers: { "cache-control": "s-maxage=5, stale-while-revalidate=30" },
  });
}
