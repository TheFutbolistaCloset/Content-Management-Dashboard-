import { NextResponse } from "next/server";
import { fetchRssNewsItems } from "@/lib/rss";

export const dynamic = "force-dynamic";

// GET /api/news
export async function GET() {
  const items = await fetchRssNewsItems();
  return NextResponse.json(items);
}
