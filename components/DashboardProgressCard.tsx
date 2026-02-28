'use client';

import { useEffect, useState } from 'react';
import LevelUpOverlay from './LevelUpOverlay';
import RankBadge from './RankBadge';
import XPBar from './XPBar';
import { clearRecentLevelUp, getLocalProgress, type LocalProgress } from '../lib/localProgress';

export default function DashboardProgressCard() {
  const [progress, setProgress] = useState<LocalProgress | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const next = getLocalProgress();
    setProgress(next);
    if (next.lastLevelUpAt) {
      setShowLevelUp(true);
      const timer = window.setTimeout(() => {
        setShowLevelUp(false);
        clearRecentLevelUp();
      }, 2600);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  if (!progress) return null;

  return (
    <>
      <LevelUpOverlay show={showLevelUp} />
      <div className="glow-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="system-title">System Status</div>
            <h2 className="font-display text-2xl">Level {progress.level}</h2>
          </div>
          <RankBadge rank={progress.rank} />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>XP {progress.currentLevelXp} / {progress.nextLevelXp}</span>
          <span>Total XP: {progress.totalXp}</span>
        </div>
        <XPBar current={progress.currentLevelXp} next={progress.nextLevelXp} />
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span className="streak-flame">🔥 {progress.streak} day streak</span>
          <span className="text-amber-300">System message: Keep your momentum.</span>
        </div>
      </div>
    </>
  );
}
