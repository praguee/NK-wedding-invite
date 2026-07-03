import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('id, name, plus_ones, message, created_at')
    .not('message', 'is', null)
    .neq('message', '')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Guestbook fetch error', error)
    return NextResponse.json([], { status: 200 })
  }

  return NextResponse.json(data ?? [])
}
