import { supabaseAdmin as supabase } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('ENV CHECK - URL:', url ? url.slice(0, 30) : 'MISSING', '| KEY:', key ? 'present' : 'MISSING')

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
    if (message && message.length > 500) {
      return NextResponse.json({ message: 'Message must be 500 characters or less' }, { status: 400 })
    }

    // Duplicate check by name
    const { data: existing } = await supabase
      .from('rsvps')
      .select('id')
      .eq('name', name.trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { message: "You've already RSVP'd! Contact us if you need to make changes." },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('rsvps')
      .insert([{
        name: name.trim(),
        plus_ones: plusOnesNum,
        message: message?.trim() || null,
      }])
      .select()
      .single()

    if (error) {
      console.error('DB error code:', error.code, 'message:', error.message, 'details:', error.details)
      return NextResponse.json({ message: `DB error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ message: 'RSVP submitted successfully', data }, { status: 201 })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
