import { NextResponse } from 'next/server';

const baseUrl = process.env.SANDBOX_SERVICE_URL || process.env.NEXT_PUBLIC_SANDBOX_URL;

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    return NextResponse.json({ error: 'SANDBOX_SERVICE_URL missing' }, { status: 500 });
  }
  const res = await fetch(`${baseUrl}/session/${params.id}`, { method: 'DELETE' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
