'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type Pulse = { id: number; x: number; y: number };

/**
 * Tracks route/data activity and renders:
 * - Bottom progress bar
 * - Tap/click interaction ripple
 */
export default function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams?.toString() ?? '', [searchParams]);

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pulses, setPulses] = useState<Pulse[]>([]);

  const rafRef = useRef<number | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showGuardRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef(0);
  const startAt = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const pulseIdRef = useRef(0);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const id = pulseIdRef.current++;
      setPulses((prev) => [...prev, { id, x: event.clientX, y: event.clientY }]);
      setTimeout(() => {
        setPulses((prev) => prev.filter((pulse) => pulse.id !== id));
      }, 520);
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

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
    }, 120);
  }, [startTicking]);

  const end = useCallback(() => {
    inflight.current = Math.max(0, inflight.current - 1);
    if (inflight.current === 0) {
      const elapsed = startAt.current ? performance.now() - startAt.current : 0;
      startAt.current = null;
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalFetch = window.fetch;
    if ((window as any).__lhProgressPatched) return;
    (window as any).__lhProgressPatched = true;

    const patchedFetch: typeof fetch = (...args) => {
      const [input] = args;
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const sameOrigin = !url.startsWith('http') || url.startsWith(window.location.origin);
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

  useEffect(() => {
    begin();
    const timer = setTimeout(end, 320);
    return () => clearTimeout(timer);
  }, [pathname, search, begin, end]);

  const percent = Math.round(progress);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
        {pulses.map((pulse) => (
          <span
            key={pulse.id}
            className="absolute h-8 w-8 rounded-full border border-[#60e1ff]/70 animate-[ping_520ms_ease-out_1]"
            style={{ left: pulse.x - 16, top: pulse.y - 16 }}
          />
        ))}
      </div>
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 transition-opacity duration-180 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden
      >
        <div className="relative h-2.5 bg-[#0f1520]/80 backdrop-blur-sm">
          <div
            className="absolute left-0 top-0 h-full bg-[#60e1ff] shadow-[0_0_20px_rgba(96,225,255,0.72)] transition-[width] duration-140"
            style={{ width: `${percent}%` }}
          />
          <div className="absolute -top-5 right-3 text-[11px] font-semibold text-[#a7f0ff] drop-shadow">
            {percent}%
          </div>
        </div>
      </div>
    </>
  );
}
