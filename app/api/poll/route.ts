import { NextResponse } from 'next/server'

// Poll feature removed — route disabled
export async function GET()  { return NextResponse.json({ message: 'Not found' }, { status: 404 }) }
export async function POST() { return NextResponse.json({ message: 'Not found' }, { status: 404 }) }
