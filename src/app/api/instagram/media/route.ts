import { NextResponse } from "next/server";
import { fetchInstagramMedia, isInstagramConfigured } from "@/lib/instagram-api";

export const dynamic = "force-dynamic";

// GET /api/instagram/media
export async function GET() {
  if (!isInstagramConfigured) {
    return NextResponse.json(
      { error: "Instagram API not configured", configured: false },
      { status: 503 }
    );
  }

  const media = await fetchInstagramMedia();
  return NextResponse.json({ media, configured: true });
}
