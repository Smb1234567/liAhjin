import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const timeoutMs = Number.parseInt(process.env.SUPABASE_TIMEOUT_MS || '1500', 10);

function withTimeoutFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return fetch(input, init);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('Supabase request timeout'), timeoutMs);

  if (init.signal) {
    init.signal.addEventListener(
      'abort',
      () => controller.abort(init.signal?.reason ?? 'Upstream abort'),
      { once: true }
    );
  }

  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout));
}

export function supabaseServer() {
  if (process.env.SUPABASE_DISABLED === '1') {
    throw new Error('Supabase disabled by SUPABASE_DISABLED.');
  }
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: {
      fetch: withTimeoutFetch
    }
  });
}
