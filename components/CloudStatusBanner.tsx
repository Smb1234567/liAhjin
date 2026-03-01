'use client';

import { useEffect, useState } from 'react';

type HealthState =
  | { status: 'loading' }
  | { status: 'ok'; host: string }
  | { status: 'down'; message: string };

export default function CloudStatusBanner() {
  const [state, setState] = useState<HealthState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/api/health/db', { cache: 'no-store' });
        if (!res.ok) {
          if (cancelled) return;
          setState({ status: 'down', message: `Health check failed (${res.status})` });
          localStorage.setItem('linuxhunter_cloud_status', 'down');
          return;
        }
        let data: any = null;
        try {
          data = await res.json();
        } catch {
          data = null;
        }
        if (cancelled) return;
        if (data?.ok) {
          setState({ status: 'ok', host: data.host ?? 'database' });
          localStorage.setItem('linuxhunter_cloud_status', 'ok');
          return;
        }
        const message = data?.error ? String(data.error) : 'Unreachable';
        setState({ status: 'down', message });
        localStorage.setItem('linuxhunter_cloud_status', 'down');
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Unreachable';
        setState({ status: 'down', message });
        localStorage.setItem('linuxhunter_cloud_status', 'down');
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'loading') return null;

  if (state.status === 'ok') {
    return (
      <div className="w-full border-b border-[#60e1ff]/35 bg-[#60e1ff]/10 text-[#a7f0ff]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-xs">
          <span className="tracking-wide">Cloud status: connected</span>
          <span className="hidden text-[#a7f0ff]/70 md:inline">{state.host}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-[#f8b84e]/35 bg-[#f8b84e]/10 text-[#ffd792]">
      <div className="mx-auto max-w-6xl px-6 py-2 text-xs">
        Cloud status: unreachable. Running in local fallback mode. ({state.message})
      </div>
    </div>
  );
}
