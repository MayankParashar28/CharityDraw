import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { password } = await req.json()
  const validPass = process.env.ADMIN_PASSWORD || 'admin123'

  if (password === validPass) {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
}
