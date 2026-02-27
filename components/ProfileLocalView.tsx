'use client';

import { useMemo } from 'react';
import HunterCard from './HunterCard';
import { getLocalProgress } from '../lib/localProgress';

function deriveTitles(progress: ReturnType<typeof getLocalProgress>) {
  const titles: string[] = [];
  if (progress.completedChallenges.length >= 1) titles.push('The Awakened One');
  if (progress.completedChallenges.includes('pipe-01')) titles.push('Pipe Dream');
  if (progress.hintsUsedTotal === 0 && progress.completedChallenges.length >= 3) titles.push('Silent Hunter');
  if (progress.rank === 'S' || progress.rank === 'SS' || progress.rank === 'SSS') titles.push('S-Rank Hunter');
  return titles.length ? titles : ['Rising Hunter'];
}

export default function ProfileLocalView({ username }: { username: string }) {
  const progress = useMemo(() => getLocalProgress(), []);
  const titles = useMemo(() => deriveTitles(progress), [progress]);

  const stats = {
    STR: Math.min(10, Math.floor(progress.completedChallenges.length / 2) + 1),
    INT: Math.min(10, Math.floor((progress.totalXp || 0) / 120) + 1),
    AGI: Math.min(10, Math.max(1, 10 - Math.floor(progress.hintsUsedTotal / 2))),
    END: Math.min(10, progress.streak + 1)
  };

  const max = 10;
  const points = [
    [50, 10 + (1 - stats.INT / max) * 40],
    [90 - (1 - stats.AGI / max) * 40, 50],
    [50, 90 - (1 - stats.END / max) * 40],
    [10 + (1 - stats.STR / max) * 40, 50]
  ]
    .map((point) => point.join(','))
    .join(' ');

  const chapterEstimate = Math.min(14, Math.max(1, Math.floor(progress.completedChallenges.length / 4)));

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <HunterCard username={username} rank={progress.rank} titles={titles} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl mb-4">Stats</h2>
            <svg viewBox="0 0 100 100" className="mx-auto h-48 w-48">
              <polygon points="50,10 90,50 50,90 10,50" fill="rgba(59,130,246,0.15)" stroke="#1f2937" />
              <polygon points={points} fill="rgba(245,158,11,0.35)" stroke="#f59e0b" />
              <text x="50" y="6" fontSize="6" textAnchor="middle" fill="#9ca3af">INT</text>
              <text x="95" y="52" fontSize="6" textAnchor="end" fill="#9ca3af">AGI</text>
              <text x="50" y="98" fontSize="6" textAnchor="middle" fill="#9ca3af">END</text>
              <text x="5" y="52" fontSize="6" textAnchor="start" fill="#9ca3af">STR</text>
            </svg>
          </div>

          <div className="glow-panel rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-display text-2xl">Chapter Progress</h3>
              <div className="mt-3 h-2 rounded-full bg-gray-800">
                <div className="h-full bg-green-500" style={{ width: `${Math.floor((chapterEstimate / 14) * 100)}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-400">{chapterEstimate} / 14 chapters complete</p>
            </div>
            <div>
              <h3 className="font-display text-2xl">Recent Clears</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-400">
                {(progress.completedChallenges.slice(-3).reverse().length
                  ? progress.completedChallenges.slice(-3).reverse()
                  : ['echo-hello'])
                  .map((slug) => (
                    <li key={slug}>{slug}</li>
                  ))}
              </ul>
            </div>
            <div className="streak-flame text-sm text-amber-300">🔥 {progress.streak} day streak</div>
          </div>
        </div>
      </div>
    </main>
  );
}
