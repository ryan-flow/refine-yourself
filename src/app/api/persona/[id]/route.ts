import { NextRequest, NextResponse } from 'next/server'
import { dbQueryOne, dbQuery } from '@/lib/db'

interface PersonaRow {
  id: string
  name: string
  bio: string
  persona_profile: Record<string, unknown>
  admin_token: string
  created_at: string
  chat_count: number
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const data = await dbQueryOne<PersonaRow>(
    `SELECT id, name, bio, persona_profile, created_at, chat_count
     FROM personas WHERE id = $1`,
    [id],
  )

  if (!data) {
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

  const persona = await dbQueryOne<{ admin_token: string }>(
    `SELECT admin_token FROM personas WHERE id = $1`,
    [id],
  )

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

  await dbQuery(`DELETE FROM personas WHERE id = $1`, [id])

  return NextResponse.json({ ok: true, data: null })
}
