import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  const token = request.headers.get('x-admin-token') ?? ''
  const adminPassword = process.env.ADMIN_PASSWORD ?? ''

  const inputHash   = Buffer.from(crypto.createHash('sha256').update(token).digest('hex'))
  const correctHash = Buffer.from(crypto.createHash('sha256').update(adminPassword).digest('hex'))

  const valid = inputHash.length === correctHash.length &&
    crypto.timingSafeEqual(inputHash, correctHash)

  if (!valid) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Admin rsvps fetch error', error)
    return NextResponse.json({ message: 'Failed to fetch RSVPs' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
