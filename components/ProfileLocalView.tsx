'use client';

import { useMemo } from 'react';
import HunterCard from './HunterCard';
import { getLocalProgress } from '../lib/localProgress';
import { TITLES } from '../lib/titles';

function resolveTitles(progress: ReturnType<typeof getLocalProgress>) {
  if (!progress.titles.length) return ['Rising Hunter'];
  const labelByKey = new Map(TITLES.map((title) => [title.key, title.label]));
  return progress.titles.map((key) => labelByKey.get(key) ?? key);
}

export default function ProfileLocalView({ username }: { username: string }) {
  const progress = useMemo(() => getLocalProgress(), []);
  const titles = useMemo(() => resolveTitles(progress), [progress]);

  const stats = {
    STR: Math.min(10, Math.max(1, progress.stats.STR)),
    INT: Math.min(10, Math.max(1, progress.stats.INT)),
    AGI: Math.min(10, Math.max(1, progress.stats.AGI)),
    END: Math.min(10, Math.max(1, progress.stats.END))
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

  const chapterEstimate = Math.min(14, progress.completedChapterIds.length);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <HunterCard username={username} rank={progress.rank} titles={titles} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl mb-4">Stats</h2>
            <svg viewBox="0 0 100 100" className="mx-auto h-48 w-48">
              <polygon points="50,10 90,50 50,90 10,50" fill="rgba(96,225,255,0.1)" stroke="#1e2a3a" />
              <polygon points={points} fill="rgba(248,184,78,0.28)" stroke="#f8b84e" />
              <text x="50" y="6" fontSize="6" textAnchor="middle" fill="#8d98aa">INT</text>
              <text x="95" y="52" fontSize="6" textAnchor="end" fill="#8d98aa">AGI</text>
              <text x="50" y="98" fontSize="6" textAnchor="middle" fill="#8d98aa">END</text>
              <text x="5" y="52" fontSize="6" textAnchor="start" fill="#8d98aa">STR</text>
            </svg>
          </div>

          <div className="glow-panel rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-display text-2xl">Chapter Progress</h3>
              <div className="panel-inset mt-3 h-2 overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#f8b84e] via-[#f5bc5d] to-[#d99a39]"
                  style={{ width: `${Math.floor((chapterEstimate / 14) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-soft">{chapterEstimate} / 14 chapters complete</p>
            </div>
            <div>
              <h3 className="font-display text-2xl">Recent Clears</h3>
              <ul className="mt-2 space-y-2 text-sm text-soft">
                {(progress.completedChallenges.slice(-3).reverse().length
                  ? progress.completedChallenges.slice(-3).reverse()
                  : ['echo-hello'])
                  .map((slug) => (
                    <li key={slug}>{slug}</li>
                ))}
              </ul>
            </div>
            <div className="streak-flame text-sm text-gold">🔥 {progress.streak} day streak</div>
          </div>
        </div>
      </div>
    </main>
  );
}
