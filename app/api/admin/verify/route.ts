import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getLimit, recordHit, resetKey } from '@/lib/rate-limit'

// Lock out after 5 failed attempts per IP for 15 minutes.
// Durable across serverless instances (see lib/rate-limit.ts).
const MAX_ATTEMPTS = 5
const WINDOW_SECONDS = 15 * 60

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const key = `admin_verify:${ip}`

  const { count, resetAtMs } = await getLimit(key, WINDOW_SECONDS)
  if (count >= MAX_ATTEMPTS) {
    const mins = Math.max(1, Math.ceil((resetAtMs - Date.now()) / 60000))
    return NextResponse.json(
      { message: `Too many attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}.` },
      { status: 429 },
    )
  }

  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD || ''
    const inputHash  = Buffer.from(crypto.createHash('sha256').update(String(password)).digest('hex'))
    const correctHash = Buffer.from(crypto.createHash('sha256').update(adminPassword).digest('hex'))

    const match = inputHash.length === correctHash.length &&
      crypto.timingSafeEqual(inputHash, correctHash)

    if (match) {
      await resetKey(key)
      return NextResponse.json({ message: 'OK' }, { status: 200 })
    }

    // Record the failed attempt.
    await recordHit(key, WINDOW_SECONDS)
    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
