import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';

export async function GET() {
  try {
    const sql = getDb();
    const result = await sql`select now() as ts`;
    const host = new URL(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || '').host;
    return NextResponse.json(
      { ok: true, host, ts: result?.[0]?.ts ?? null },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
