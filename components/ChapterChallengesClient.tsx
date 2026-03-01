'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLocalProgress } from '../lib/localProgress';
import { buildChallengeStatuses, type ChallengeInput } from '../lib/unlockRules';

type ChallengeRowInput = ChallengeInput & {
  title: string;
  xp_reward: number;
  time_limit_seconds: number;
  difficulty: string;
};

type ChallengeRow = ChallengeRowInput & { unlocked: boolean; completed: boolean };

export default function ChapterChallengesClient({ challenges }: { challenges: ChallengeRowInput[] }) {
  const [rows, setRows] = useState<ChallengeRow[]>([]);

  useEffect(() => {
    const update = () => {
      const progress = getLocalProgress();
      const next = buildChallengeStatuses(challenges, progress.completedChallenges);
      setRows(next as ChallengeRow[]);
    };
    update();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'linuxhunter_progress_v1') update();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('linuxhunter-progress', update as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('linuxhunter-progress', update as EventListener);
    };
  }, [challenges]);

  if (rows.length === 0) {
    return <div className="glow-panel rounded-xl p-5 text-sm text-soft">No challenges available.</div>;
  }

  return (
    <div className="space-y-4">
      {rows.map((challenge) => (
        <div key={challenge.slug} className="glow-panel rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl">{challenge.title}</h3>
            <p className="text-xs text-soft">
              XP {challenge.xp_reward} • {challenge.time_limit_seconds}s • {challenge.difficulty}
            </p>
          </div>
          {!challenge.unlocked ? (
            <span className="text-dim">Locked</span>
          ) : (
            <Link
              href={`/challenges/${challenge.slug}`}
              className="rounded-full border border-[#1e2a3a] bg-[#101722]/70 px-4 py-2 text-sm text-[#cfd9e8] transition hover:border-[#f8b84e]/50 hover:text-[#ffe0a7] hover:shadow-[0_0_20px_rgba(248,184,78,0.2)]"
            >
              {challenge.completed ? 'Replay' : 'Start'}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
