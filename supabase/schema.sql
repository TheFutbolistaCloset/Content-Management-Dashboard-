-- ContentHub — Supabase schema
-- Paste this entire file into your Supabase project:
-- Dashboard → SQL Editor → New query → Run

-- Posts table (Instagram Manager content pipeline)
CREATE TABLE IF NOT EXISTS posts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  caption      TEXT        NOT NULL,
  post_type    TEXT        NOT NULL CHECK (post_type IN ('image','carousel','reel','story')),
  status       TEXT        NOT NULL CHECK (status IN ('scheduled','draft','published','backlog')),
  scheduled_date TEXT,
  created_at   TEXT        NOT NULL,
  likes        INTEGER,
  comments     INTEGER,
  hashtags     TEXT[]      DEFAULT '{}',
  instagram_id TEXT,          -- filled when synced from Instagram API
  permalink    TEXT           -- Instagram post URL
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Open policy for development — tighten per-user in production
CREATE POLICY "Allow all for now"
  ON posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for common filter patterns
CREATE INDEX IF NOT EXISTS posts_status_idx  ON posts (status);
CREATE INDEX IF NOT EXISTS posts_created_idx ON posts (created_at DESC);
