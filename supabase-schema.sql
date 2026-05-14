-- 在 Supabase SQL Editor 中执行此脚本

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE personas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  bio           TEXT DEFAULT '',
  persona_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
  admin_token   UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  chat_count    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_personas_id ON personas (id);
CREATE INDEX idx_personas_created_at ON personas (created_at DESC);

ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select" ON personas FOR SELECT USING (true);
CREATE POLICY "public_insert" ON personas FOR INSERT WITH CHECK (true);
CREATE POLICY "public_delete" ON personas FOR DELETE USING (true);
