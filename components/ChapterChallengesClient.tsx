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
    return <div className="glow-panel rounded-xl p-5 text-sm text-gray-400">No challenges available.</div>;
  }

  return (
    <div className="space-y-4">
      {rows.map((challenge) => (
        <div key={challenge.slug} className="glow-panel rounded-xl p-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl">{challenge.title}</h3>
            <p className="text-xs text-gray-400">
              XP {challenge.xp_reward} • {challenge.time_limit_seconds}s • {challenge.difficulty}
            </p>
          </div>
          {!challenge.unlocked ? (
            <span className="text-gray-600">Locked</span>
          ) : (
            <Link
              href={`/challenges/${challenge.slug}`}
              className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200"
            >
              {challenge.completed ? 'Replay' : 'Start'}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
