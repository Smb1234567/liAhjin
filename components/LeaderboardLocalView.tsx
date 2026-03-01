'use client';

import { useMemo } from 'react';
import RankBadge from './RankBadge';
import { getLocalProgress } from '../lib/localProgress';
import { TITLES } from '../lib/titles';

type Row = {
  position: number;
  username: string;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';
  title: string;
  xp: number;
  streak: number;
};

export default function LeaderboardLocalView() {
  const rows = useMemo(() => {
    const progress = getLocalProgress();
    const labelByKey = new Map(TITLES.map((title) => [title.key, title.label]));
    const topTitle = progress.titles.length ? labelByKey.get(progress.titles[0]) ?? progress.titles[0] : 'Rising Hunter';
    const seed: Omit<Row, 'position'>[] = [
      { username: 'shadowfox', rank: 'A', title: 'Pipe Dream', xp: 8200, streak: 14 },
      { username: 'kernelkid', rank: 'B', title: 'The Awakened One', xp: 7600, streak: 9 },
      { username: 'grepqueen', rank: 'C', title: 'Grep God', xp: 6400, streak: 22 }
    ];

    seed.push({
      username: 'you',
      rank: progress.rank,
      title: topTitle,
      xp: progress.totalXp,
      streak: progress.streak
    });

    return seed
      .sort((a, b) => b.xp - a.xp)
      .map((row, index) => ({ ...row, position: index + 1 }));
  }, []);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">Leaderboard</h1>
          <p className="text-soft">Top hunters ranked by total XP (local mode).</p>
        </div>
        <div className="glow-panel rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#101722] text-soft">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Hunter</th>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Top Title</th>
                <th className="px-4 py-3 text-left">XP</th>
                <th className="px-4 py-3 text-left">Streak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.username} className="border-t border-[#1e2a3a]">
                  <td className="px-4 py-3">{row.position}</td>
                  <td className="px-4 py-3">{row.username}</td>
                  <td className="px-4 py-3"><RankBadge rank={row.rank} /></td>
                  <td className="px-4 py-3 text-soft">{row.title}</td>
                  <td className="px-4 py-3 text-soft">{row.xp}</td>
                  <td className="px-4 py-3 text-gold">🔥 {row.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
