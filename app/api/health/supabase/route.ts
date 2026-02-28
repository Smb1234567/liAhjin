import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export async function GET() {
  if (!SUPABASE_URL) {
    return NextResponse.json(
      { ok: false, error: 'Missing SUPABASE_URL.' },
      { status: 500 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1500);

  try {
    const url = new URL('/auth/v1/health', SUPABASE_URL);
    const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        host: url.host
      },
      { status: res.ok ? 200 : 503 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
