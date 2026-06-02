import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, plus_ones, message } = body

    if (!name?.trim()) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 })
    }
    if (!email?.trim()) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 })
    }
    const plusOnesNum = Number(plus_ones)
    if (isNaN(plusOnesNum) || plusOnesNum < 0 || plusOnesNum > 5) {
      return NextResponse.json({ message: 'Plus-ones must be between 0 and 5' }, { status: 400 })
    }
    if (message && message.length > 500) {
      return NextResponse.json({ message: 'Message must be 500 characters or less' }, { status: 400 })
    }

    // Duplicate check
    const { data: existing } = await supabase
      .from('rsvps')
      .select('id')
      .eq('name', name.trim())
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { message: "You've already RSVP'd with this name and email" },
        { status: 409 }
      )
    }

    const { data, error } = await supabase
      .from('rsvps')
      .insert([{
        name: name.trim(),
        email: email.trim().toLowerCase(),
        plus_ones: plusOnesNum,
        message: message?.trim() || null,
      }])
      .select()
      .single()

    if (error) {
      console.error('DB error:', error)
      return NextResponse.json({ message: 'Failed to save RSVP. Please try again.' }, { status: 500 })
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
