'use client';

import { useEffect, useState } from 'react';
import { getLocalProgress } from '../lib/localProgress';
import { buildChallengeStatuses, type ChallengeInput } from '../lib/unlockRules';
import ChallengeArena from './ChallengeArena';

type ChallengeGateProps = {
  dataSource: 'cloud' | 'local';
  challenge: {
    id: number;
    chapter_id: number;
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[] | null;
    xp_reward: number;
    time_limit_seconds: number;
    hints: string[] | null;
    setup_script: string | null;
    validator_script: string | null;
  };
  chapterChallenges: ChallengeInput[];
};

export default function ChallengeGate({ dataSource, challenge, chapterChallenges }: ChallengeGateProps) {
  const [unlocked, setUnlocked] = useState(true);

  useEffect(() => {
    const progress = getLocalProgress();
    const statuses = buildChallengeStatuses(chapterChallenges, progress.completedChallenges);
    const current = statuses.find((item) => item.slug === challenge.slug);
    setUnlocked(current ? current.unlocked : true);
  }, [challenge.slug, chapterChallenges]);

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="glow-panel rounded-xl p-6">
            <h1 className="font-display text-3xl">Challenge Locked</h1>
            <p className="mt-2 text-sm text-gray-400">
              Complete the previous challenge in this chapter to unlock this one.
            </p>
            <div className="mt-4 text-xs text-amber-300">
              Data source: {dataSource === 'cloud' ? 'Cloud' : 'Local Fallback'}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ChallengeArena
      challenge={challenge}
      dataSource={dataSource}
      chapterChallenges={chapterChallenges}
    />
  );
}
