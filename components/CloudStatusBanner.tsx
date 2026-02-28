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
        const res = await fetch('/api/health/supabase', { cache: 'no-store' });
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
          setState({ status: 'ok', host: data.host ?? 'supabase.co' });
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
      <div className="w-full border-b border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
        <div className="mx-auto max-w-6xl px-6 py-2 text-xs">
          Cloud status: connected to {state.host}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-amber-500/30 bg-amber-500/10 text-amber-200">
      <div className="mx-auto max-w-6xl px-6 py-2 text-xs">
        Cloud status: unreachable. Running in local fallback mode. ({state.message})
      </div>
    </div>
  );
}
