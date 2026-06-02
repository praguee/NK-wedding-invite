import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ message: 'Password is required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD || ''
    const inputHash = crypto.createHash('sha256').update(String(password)).digest('hex')
    const correctHash = crypto.createHash('sha256').update(adminPassword).digest('hex')

    if (inputHash === correctHash) {
      return NextResponse.json({ message: 'OK' }, { status: 200 })
    }
    return NextResponse.json({ message: 'Incorrect password' }, { status: 401 })
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
