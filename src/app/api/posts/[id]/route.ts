import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// ─── PUT /api/posts/[id] ──────────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("posts")
    .update({
      caption: body.caption,
      post_type: body.postType,
      status: body.status,
      scheduled_date: body.scheduledDate ?? null,
      hashtags: body.hashtags ?? [],
      likes: body.likes ?? null,
      comments: body.comments ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapDbPost(data));
}

// ─── DELETE /api/posts/[id] ───────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const { id } = await params;

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
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
