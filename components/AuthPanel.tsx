'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthPanel() {
  const [email, setEmail] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
      void session;
    };
  }, []);

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const signInWithEmail = async () => {
    if (!email) return;
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="glow-panel rounded-xl p-5 space-y-3">
      <h3 className="font-display text-2xl">Account Access</h3>
      {userEmail ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-300">Signed in as {userEmail}</p>
          <button onClick={signOut} className="rounded-full border border-gray-700 px-4 py-2 text-sm">
            Sign out
          </button>
        </div>
      ) : (
        <div className="space-y-3">
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
