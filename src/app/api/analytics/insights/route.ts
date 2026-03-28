import { NextRequest, NextResponse } from "next/server";
import {
  fetchDailyInsights,
  fetchFollowerCount,
  isInstagramConfigured,
} from "@/lib/instagram-api";

export const dynamic = "force-dynamic";

// GET /api/analytics/insights?since=YYYY-MM-DD&until=YYYY-MM-DD
export async function GET(req: NextRequest) {
  if (!isInstagramConfigured) {
    return NextResponse.json(
      { error: "Instagram API not configured", configured: false },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  if (!since || !until) {
    return NextResponse.json(
      { error: "Missing required params: since, until" },
      { status: 400 }
    );
  }

  const [metrics, followerCount] = await Promise.all([
    fetchDailyInsights(since, until),
    fetchFollowerCount(),
  ]);

  return NextResponse.json({ metrics, followerCount, configured: true });
}
