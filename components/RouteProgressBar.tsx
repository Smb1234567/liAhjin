'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Tracks real network fetches (including Next.js RSC/data fetches) to drive a bottom progress bar.
 * Hides on very fast navigations to avoid flicker.
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams?.toString() ?? '', [searchParams]);

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const rafRef = useRef<number | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showGuardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef(0);
  const startAt = useRef<number | null>(null);
  const visibleRef = useRef(false);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // Incremental progress while fetches are in flight.
  const startTicking = useCallback(() => {
    if (rafRef.current) return;
    const tick = () => {
      setProgress((prev) => {
        const target = inflight.current > 0 ? 94 : 100;
        const delta = Math.max(0.8, (target - prev) * 0.12);
        return clamp(prev + delta, 0, target);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTicking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const begin = useCallback(() => {
    inflight.current += 1;
    startAt.current ??= performance.now();

    if (showGuardRef.current) clearTimeout(showGuardRef.current);
    showGuardRef.current = setTimeout(() => {
      setVisible(true);
      setProgress((prev) => (prev === 0 ? 6 : prev));
      startTicking();
    }, 120); // hide flicker for ultra-fast nav
  }, [startTicking]);

  const end = useCallback(() => {
    inflight.current = Math.max(0, inflight.current - 1);
    if (inflight.current === 0) {
      const elapsed = startAt.current ? performance.now() - startAt.current : 0;
      startAt.current = null;
      // If we never showed because it was fast, ensure we stay hidden.
      if (elapsed < 120 && !visibleRef.current) {
        if (showGuardRef.current) clearTimeout(showGuardRef.current);
        return;
      }
      stopTicking();
      setProgress(100);
      if (hideRef.current) clearTimeout(hideRef.current);
      hideRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 260);
    }
  }, [stopTicking]);

  // Patch fetch once to observe real data loads (Next flight/data requests go through fetch).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalFetch = window.fetch;
    if ((window as any).__lhProgressPatched) return;
    (window as any).__lhProgressPatched = true;

    const patchedFetch: typeof fetch = (...args) => {
      const [input] = args;
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const sameOrigin = !url.startsWith('http') || url.startsWith(window.location.origin);
      // Only track same-origin (covers Next flight/data, API routes); skip assets/externals.
      if (sameOrigin) begin();

      return originalFetch(...args).finally(() => {
        if (sameOrigin) end();
      });
    };

    window.fetch = patchedFetch;

    return () => {
      window.fetch = originalFetch;
    };
  }, [begin, end]);

  // Kick the bar if the route changed but no fetch was captured (edge cases).
  useEffect(() => {
    begin();
    const timer = setTimeout(end, 300); // if nothing else happens, complete quickly
    return () => clearTimeout(timer);
  }, [pathname, search, begin, end]);

  const percent = Math.round(progress);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 transition-opacity duration-180 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden
    >
      <div className="relative h-3 bg-gray-900/80 backdrop-blur-sm">
        <div
          className="absolute left-0 top-0 h-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.5)] transition-[width] duration-140"
          style={{ width: `${percent}%` }}
        />
        <div className="absolute -top-5 right-3 text-[11px] font-semibold text-emerald-200 drop-shadow">
          {percent}%
        </div>
      </div>
    </div>
  );
}
