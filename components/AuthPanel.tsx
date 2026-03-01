'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function AuthPanel() {
  const { isSignedIn, user } = useUser();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const status = typeof window !== 'undefined' ? window.localStorage.getItem('linuxhunter_cloud_status') : null;
    if (status === 'down') setOffline(true);
  }, []);

  return (
    <div className="glow-panel rounded-xl p-5 space-y-3">
      <h3 className="font-display text-2xl">Account Access</h3>
      {offline ? (
        <div className="text-sm text-gold">Cloud offline. Sign-in disabled.</div>
      ) : isSignedIn ? (
        <div className="flex items-center justify-between">
          <div className="text-sm text-soft">
            Signed in as <span className="font-medium text-gold">{user?.primaryEmailAddress?.emailAddress ?? user?.username ?? 'hunter'}</span>
          </div>
          <UserButton afterSignOutUrl="/dashboard" />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <SignInButton mode="modal">
              <button className="flex-1 rounded-full border border-[#f8b84e]/80 bg-[#f8b84e] px-4 py-2 text-sm font-semibold text-[#120d05] shadow-[0_0_18px_rgba(248,184,78,0.24)] transition hover:shadow-[0_0_28px_rgba(248,184,78,0.36)]">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="flex-1 rounded-full border border-[#1e2a3a] bg-[#101722]/75 px-4 py-2 text-sm text-[#cfd9e8] transition hover:border-[#60e1ff]/55 hover:text-[#d6f6ff] hover:shadow-[0_0_20px_rgba(96,225,255,0.2)]">
                Create account
              </button>
            </SignUpButton>
          </div>
          <p className="text-xs text-dim">Powered by Clerk.</p>
        </div>
      )}
    </div>
  );
}
