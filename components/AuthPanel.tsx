'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabase';

export default function AuthPanel() {
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const status = typeof window !== 'undefined' ? window.localStorage.getItem('linuxhunter_cloud_status') : null;
    if (status === 'down') {
      setOffline(true);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setOffline(true);
        return;
      }
      try {
        const session = await supabase.auth.getSession();
        if (cancelled) return;
        setUserEmail(session.data.session?.user.email ?? null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Auth unavailable');
      }
    };
    run();
    const supabase = getSupabaseClient();
    const { data } = supabase?.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    }) ?? { data: { subscription: { unsubscribe: () => undefined } } };

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const signInWithGitHub = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const signInWithEmail = async () => {
    if (!email) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <div className="glow-panel rounded-xl p-5 space-y-3">
      <h3 className="font-display text-2xl">Account Access</h3>
      {offline ? (
        <div className="text-sm text-amber-300">Auth unavailable in local fallback mode.</div>
      ) : userEmail ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Signed in as {userEmail}</p>
          <button onClick={signOut} className="rounded-full border border-gray-700 px-4 py-2 text-sm">
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {error && <div className="text-xs text-red-400">{error}</div>}
          <button onClick={signInWithGitHub} className="w-full rounded-full bg-amber-400 px-4 py-2 text-gray-950">
            Continue with GitHub
          </button>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm"
              placeholder="you@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button onClick={signInWithEmail} className="rounded-full border border-gray-700 px-4 py-2 text-sm">
              Send Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
