import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ─── GET /api/posts ───────────────────────────────────────────────────────────

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map snake_case DB columns → camelCase
  const posts = (data ?? []).map(mapDbPost);
  return NextResponse.json(posts);
}

// ─── POST /api/posts ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const body = await req.json();
  const now = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("posts")
    .insert({
      caption: body.caption,
      post_type: body.postType,
      status: body.status,
      scheduled_date: body.scheduledDate ?? null,
      created_at: now,
      hashtags: body.hashtags ?? [],
      likes: body.likes ?? null,
      comments: body.comments ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapDbPost(data), { status: 201 });
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbPost(row: any) {
  return {
    id: row.id,
    caption: row.caption,
    postType: row.post_type,
    status: row.status,
    scheduledDate: row.scheduled_date ?? undefined,
    createdAt: row.created_at,
    likes: row.likes ?? undefined,
    comments: row.comments ?? undefined,
    hashtags: row.hashtags ?? [],
    instagramId: row.instagram_id ?? undefined,
    permalink: row.permalink ?? undefined,
  };
}
