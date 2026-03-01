'use client';

import { useEffect, useState } from 'react';
import Terminal from './Terminal';
import { Button } from './ui/button';
import { recordChallengeResult } from '../lib/localProgress';

export type ChallengeSessionProps = {
  challengeId: number;
  slug: string;
  chapterId: number;
  chapterChallengeSlugs: string[];
  setupScript: string | null;
  validatorScript: string | null;
  xpReward: number;
  timeLimitSeconds: number;
  hintsUsed: number;
  tags: string[];
  onSolved?: () => void;
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function ChallengeSession({
  challengeId,
  slug,
  chapterId,
  chapterChallengeSlugs,
  setupScript,
  validatorScript,
  xpReward,
  timeLimitSeconds,
  hintsUsed,
  tags,
  onSolved
}: ChallengeSessionProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [websocketUrl, setWebsocketUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'running' | 'pass' | 'fail' | 'error'>('idle');
  const [output, setOutput] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(timeLimitSeconds);
  const [xpAwarded, setXpAwarded] = useState<number>(0);
  const [levelUps, setLevelUps] = useState<number>(0);

  useEffect(() => {
    if (!startedAt || !sessionId) return;
    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, timeLimitSeconds - elapsed);
      setRemainingSeconds(remaining);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [sessionId, startedAt, timeLimitSeconds]);

  useEffect(() => {
    if (!sessionId) return;
    return () => {
      fetch(`/api/sandbox/session/${sessionId}`, { method: 'DELETE' }).catch(() => undefined);
    };
  }, [sessionId]);

  const createSession = async () => {
    setStatus('running');
    const res = await fetch('/api/sandbox/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setup_script: setupScript })
    });
    if (!res.ok) {
      setStatus('error');
      setOutput('Failed to start sandbox session.');
      return;
    }
    const data = await res.json();
    setSessionId(data.session_id);
    setWebsocketUrl(data.websocket_url);
    setStartedAt(Date.now());
    setRemainingSeconds(timeLimitSeconds);
    setOutput('');
  };

  const submit = async () => {
    if (!sessionId || !validatorScript || remainingSeconds <= 0) return;
    const res = await fetch('/api/sandbox/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, validator_script: validatorScript })
    });
    const data = await res.json();
    const attemptCount = attempts + 1;
    setAttempts(attemptCount);
    if (data.result === 'PASS') {
      setStatus('pass');
      const timeTakenSeconds = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
      const result = recordChallengeResult({
        slug,
        baseXp: xpReward,
        hintsUsed,
        timeTakenSeconds,
        parTimeSeconds: timeLimitSeconds,
        attempts: attemptCount,
        tags,
        chapterId,
        chapterChallengeSlugs
      });
      setXpAwarded(result.xpAwarded);
      setLevelUps(result.levelUps);
      onSolved?.();
    } else {
      setStatus('fail');
    }
    setOutput(data.output || '');
  };

  return (
    <div className="glow-panel rounded-xl p-6 h-[520px] flex flex-col">
      <div className="mb-3 flex items-center justify-between text-sm text-soft">
        <span className="text-cyan">Live Terminal</span>
        <div className="flex items-center gap-3">
          {sessionId && <span className="session-active">Session Active</span>}
          <span className="text-gold">{formatSeconds(remainingSeconds)}</span>
          <span className="text-gold">Attempts: {attempts}</span>
        </div>
      </div>
      <div className="terminal-frame flex-1 overflow-hidden rounded-lg">
        <Terminal websocketUrl={websocketUrl ?? undefined} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          onClick={createSession}
          variant="outline"
          disabled={status === 'running' && !!sessionId}
        >
          {sessionId ? 'Session Active' : 'Start Session'}
        </Button>
        <Button
          onClick={submit}
          disabled={!sessionId || remainingSeconds <= 0 || status === 'pass'}
        >
          Submit for Validation
        </Button>
        {status === 'pass' && <span className="text-gold text-sm">PASS - +{xpAwarded} XP.</span>}
        {status === 'fail' && <span className="text-[#ff7e7e] text-sm">FAIL - try again.</span>}
        {status === 'error' && <span className="text-[#ff7e7e] text-sm">Session error.</span>}
        {levelUps > 0 && <span className="text-gold text-sm">LEVEL UP x{levelUps}</span>}
      </div>
      {output && (
        <pre className="panel-inset mt-3 max-h-24 overflow-auto rounded-lg p-3 text-xs text-soft">{output}</pre>
      )}
      <input type="hidden" value={challengeId} />
    </div>
  );
}
