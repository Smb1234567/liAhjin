import { NextResponse } from 'next/server';

const baseUrl = process.env.SANDBOX_SERVICE_URL || process.env.NEXT_PUBLIC_SANDBOX_URL;

export async function POST(req: Request) {
  if (!baseUrl) {
    return NextResponse.json({ error: 'SANDBOX_SERVICE_URL missing' }, { status: 500 });
  }
  const body = await req.json();
  const res = await fetch(`${baseUrl}/session/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
