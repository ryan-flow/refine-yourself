import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from('personas')
    .select('id, name, bio, persona_profile, created_at, chat_count')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: '人格不存在' },
      { status: 404 },
    )
  }

  return NextResponse.json({ ok: true, data: { persona: data } })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const adminToken = request.headers.get('x-admin-token')
  if (!adminToken) {
    return NextResponse.json(
      { ok: false, error: '需要提供管理令牌' },
      { status: 401 },
    )
  }

  const { data: persona } = await supabaseAdmin
    .from('personas')
    .select('admin_token')
    .eq('id', id)
    .single()

  if (!persona) {
    return NextResponse.json(
      { ok: false, error: '人格不存在' },
      { status: 404 },
    )
  }

  if (persona.admin_token !== adminToken) {
    return NextResponse.json(
      { ok: false, error: '管理令牌无效' },
      { status: 403 },
    )
  }

  const { error } = await supabaseAdmin
    .from('personas')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return NextResponse.json({ ok: true, data: null })
}
