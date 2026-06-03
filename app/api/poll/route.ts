import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('poll_votes')
    .select('side')

  if (error) {
    return NextResponse.json({ bride: 0, groom: 0, total: 0 })
  }

  const bride = data.filter(r => r.side === 'bride').length
  const groom = data.filter(r => r.side === 'groom').length
  return NextResponse.json({ bride, groom, total: bride + groom })
}

export async function POST(req: NextRequest) {
  const { side } = await req.json()
  if (side !== 'bride' && side !== 'groom') {
    return NextResponse.json({ message: 'Invalid side' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('poll_votes')
    .insert([{ side }])

  if (error) {
    return NextResponse.json({ message: 'Failed to record vote' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Vote recorded' }, { status: 201 })
}
