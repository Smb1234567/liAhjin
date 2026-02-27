'use client';

import { useState } from 'react';
import Terminal from './Terminal';

export type ChallengeSessionProps = {
  challengeId: number;
  setupScript: string | null;
  validatorScript: string | null;
};

export default function ChallengeSession({ challengeId, setupScript, validatorScript }: ChallengeSessionProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail'>('idle');
  const [output, setOutput] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);

  const createSession = async () => {
    setStatus('running');
    const res = await fetch('/api/sandbox/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setup_script: setupScript })
    });
    if (!res.ok) {
      setStatus('idle');
      return;
    }
    const data = await res.json();
    setSessionId(data.session_id);
    setWebsocketUrl(data.websocket_url);
  };

  const submit = async () => {
    if (!sessionId || !validatorScript) return;
    const res = await fetch('/api/sandbox/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, validator_script: validatorScript })
    });
    const data = await res.json();
    setAttempts((prev) => prev + 1);
    if (data.result === 'PASS') {
      setStatus('pass');
    } else {
      setStatus('fail');
    }
    setOutput(data.output || '');
  };

  return (
    <div className="glow-panel rounded-xl p-6 h-[520px] flex flex-col">
      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
        <span>Live Terminal</span>
        <span className="text-amber-300">Attempts: {attempts}</span>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border border-gray-800">
        <Terminal websocketUrl={websocketUrl ?? undefined} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={createSession}
          className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200"
          disabled={status === 'running' && !!sessionId}
        >
          {sessionId ? 'Session Active' : 'Start Session'}
        </button>
        <button
          onClick={submit}
          className="rounded-full bg-amber-400 px-4 py-2 text-sm text-gray-950"
          disabled={!sessionId}
        >
          Submit for Validation
        </button>
        {status === 'pass' && <span className="text-green-400 text-sm">PASS — XP awarded.</span>}
        {status === 'fail' && <span className="text-red-400 text-sm">FAIL — try again.</span>}
      </div>
      {output && (
        <pre className="mt-3 max-h-24 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-300">{output}</pre>
      )}
      <input type="hidden" value={challengeId} />
    </div>
  );
}
