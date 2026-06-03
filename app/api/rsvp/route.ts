import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

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

function httpsGet(url: string, headers: Record<string, string>): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request(
      { hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'GET', headers },
      (res) => {
        let body = ''
        res.on('data', (chunk) => { body += chunk })
        res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
      }
    )
    req.on('error', reject)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

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

    const authHeaders = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    }

    // Duplicate check
    const checkRes = await httpsGet(
      `${supabaseUrl}/rest/v1/rsvps?name=eq.${encodeURIComponent(name.trim())}&select=id`,
      authHeaders
    )
    if (checkRes.status === 200) {
      const existing = JSON.parse(checkRes.body)
      if (existing.length > 0) {
        return NextResponse.json(
          { message: "You've already RSVP'd! Contact us if you need to make changes." },
          { status: 409 }
        )
      }
    }

    // Insert
    const insertRes = await httpsPost(
      `${supabaseUrl}/rest/v1/rsvps`,
      JSON.stringify({ name: name.trim(), plus_ones: plusOnesNum, message: message?.trim() || null }),
      { ...authHeaders, Prefer: 'return=representation' }
    )

    if (insertRes.status !== 200 && insertRes.status !== 201) {
      return NextResponse.json({ message: `Insert failed: ${insertRes.status} ${insertRes.body}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'RSVP submitted successfully' }, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ message: `Error: ${msg}` }, { status: 500 })
  }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  const result: Record<string, string> = {
    url_env: supabaseUrl ? supabaseUrl.slice(0, 40) : 'MISSING',
    key_env: serviceKey ? 'present' : 'MISSING',
  }

  try {
    const r = await httpsGet(`${supabaseUrl}/rest/v1/`, {
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey}`,
    })
    result.supabase_ping = `${r.status}`
  } catch (e) {
    result.supabase_ping = `FAIL: ${e instanceof Error ? e.message : String(e)}`
  }

  return NextResponse.json(result)
}
