import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST() {
  return NextResponse.json({
    error: 'The Repairs feature has been discontinued at BABA TEE GLOBAL.'
  }, { status: 410 });
}
