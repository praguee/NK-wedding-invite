import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      message: `Env missing — URL: ${supabaseUrl ? 'OK' : 'MISSING'}, KEY: ${serviceKey ? 'OK' : 'MISSING'}`
    }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { name, plus_ones, message } = body

    if (!name?.trim()) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }
    const plusOnesNum = Number(plus_ones)
    if (isNaN(plusOnesNum) || plusOnesNum < 0 || plusOnesNum > 5) {
      return NextResponse.json({ message: 'Plus-ones must be between 0 and 5' }, { status: 400 })
    }

    // Duplicate check via direct REST API
    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/rsvps?name=eq.${encodeURIComponent(name.trim())}&select=id`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    )

    if (!checkRes.ok) {
      const errText = await checkRes.text()
      return NextResponse.json({ message: `Check failed: ${checkRes.status} ${errText}` }, { status: 500 })
    }

    const existing = await checkRes.json()
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "You've already RSVP'd! Contact us if you need to make changes." },
        { status: 409 }
      )
    }

    // Insert via direct REST API
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/rsvps`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        name: name.trim(),
        plus_ones: plusOnesNum,
        message: message?.trim() || null,
      }),
    })

    if (!insertRes.ok) {
      const errText = await insertRes.text()
      return NextResponse.json({ message: `Insert failed: ${insertRes.status} ${errText}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'RSVP submitted successfully' }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ message: `Error: ${msg}` }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
