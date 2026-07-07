import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import { recordHit } from '@/lib/rate-limit'

// Rate limit: max 3 RSVPs per IP per 10 minutes (durable across instances)
const RSVP_LIMIT = 3
const RSVP_WINDOW_SECONDS = 10 * 60

function httpsPost(url: string, data: string, headers: Record<string, string>): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: { ...headers, 'Content-Length': Buffer.byteLength(data) },
      },
      (res) => {
        let body = ''
        res.on('data', (chunk) => { body += chunk })
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
      }
    )
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const hits = await recordHit(`rsvp:${ip}`, RSVP_WINDOW_SECONDS)
  if (hits > RSVP_LIMIT) {
    return NextResponse.json({ message: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!supabaseUrl || !serviceKey) {
    console.error('RSVP API: missing env vars', { url: !!supabaseUrl, key: !!serviceKey })
    return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, plus_ones, message } = body

    if (!name?.trim()) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }
    if (name.trim().length > 200) {
      return NextResponse.json({ message: 'Name is too long' }, { status: 400 })
    }
    const plusOnesNum = Number(plus_ones)
    if (isNaN(plusOnesNum) || plusOnesNum < 0 || plusOnesNum > 5) {
      return NextResponse.json({ message: 'Plus-ones must be between 0 and 5' }, { status: 400 })
    }
    if (message && message.trim().split(/\s+/).filter(Boolean).length > 100) {
      return NextResponse.json({ message: 'Message exceeds 100 word limit' }, { status: 400 })
    }

    const authHeaders = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    }

    // Insert. Duplicate names are rejected by the database's unique constraint
    // (case-insensitive once the migration adds the lower(trim(name)) index),
    // which surfaces as a 409 — more reliable than an app-level pre-check.
    const insertRes = await httpsPost(
      `${supabaseUrl}/rest/v1/rsvps`,
      JSON.stringify({ name: name.trim(), plus_ones: plusOnesNum, message: message?.trim() || null }),
      { ...authHeaders, Prefer: 'return=representation' }
    )

    if (insertRes.status === 409) {
      return NextResponse.json(
        { message: "You've already RSVP'd! Contact us if you need to make changes." },
        { status: 409 }
      )
    }

    if (insertRes.status !== 200 && insertRes.status !== 201) {
      console.error('RSVP insert failed', insertRes.status, insertRes.body)
      return NextResponse.json({ message: 'Failed to submit RSVP. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ message: 'RSVP submitted successfully' }, { status: 201 })
  } catch (err) {
    console.error('RSVP route error', err)
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
