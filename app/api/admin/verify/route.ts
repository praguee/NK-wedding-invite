import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Track failed attempts per IP in-process (resets on cold start — good enough for this use case)
const attempts = new Map<string, { count: number; blockedUntil: number }>()
const MAX_ATTEMPTS = 5
const BLOCK_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()

  const record = attempts.get(ip)
  if (record && now < record.blockedUntil) {
    const mins = Math.ceil((record.blockedUntil - now) / 60000)
    return NextResponse.json({ message: `Too many attempts. Try again in ${mins} minute${mins > 1 ? 's' : ''}.` }, { status: 429 })
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
      attempts.delete(ip)
      return NextResponse.json({ message: 'OK' }, { status: 200 })
    }

    // Increment failure count
    const cur = attempts.get(ip) ?? { count: 0, blockedUntil: 0 }
    cur.count += 1
    if (cur.count >= MAX_ATTEMPTS) {
      cur.blockedUntil = now + BLOCK_MS
    }
    attempts.set(ip, cur)

    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
