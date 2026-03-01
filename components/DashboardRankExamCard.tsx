'use client';

import { useEffect, useMemo, useState } from 'react';
import { examCooldownRemaining, isRankExamUnlocked, rankExamMap } from '../lib/rankExams';
import { getLocalProgress, recordRankExamFail, recordRankExamPass } from '../lib/localProgress';
import { buildChapterNodes, type ChapterInput, type ChallengeInput } from '../lib/unlockRules';
import { rankExamContent } from '../lib/rankExamContent';
import { Button } from './ui/button';

export default function DashboardRankExamCard({
  chapters,
  challenges
}: {
  chapters: ChapterInput[];
  challenges: ChallengeInput[];
}) {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [cooldownMs, setCooldownMs] = useState(0);
  const [currentRank, setCurrentRank] = useState<'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'>('E');
  const [completedChapterIds, setCompletedChapterIds] = useState<number[]>([]);

  useEffect(() => {
    const progress = getLocalProgress();
    setCurrentRank(progress.rank);
    setCooldownMs(examCooldownRemaining(progress.lastRankExamFailAt ? String(progress.lastRankExamFailAt) : null));
    const { completedChapterIds: completed } = buildChapterNodes(
      chapters,
      challenges,
      progress.completedChallenges
    );
    setCompletedChapterIds(completed);
  }, [chapters, challenges]);

  useEffect(() => {
    if (cooldownMs <= 0) return;
    const interval = window.setInterval(() => {
      const progress = getLocalProgress();
      setCooldownMs(examCooldownRemaining(progress.lastRankExamFailAt ? String(progress.lastRankExamFailAt) : null));
    }, 60000);
    return () => window.clearInterval(interval);
  }, [cooldownMs]);

  const unlocked = useMemo(
    () => isRankExamUnlocked(currentRank, completedChapterIds),
    [currentRank, completedChapterIds]
  );

  const nextRank = rankExamMap[currentRank]?.nextRank;
  const prompt = rankExamContent[currentRank]?.prompt ?? 'Exam pending.';
  const expected = rankExamContent[currentRank]?.answer ?? '';

  const submitExam = () => {
    if (!unlocked || cooldownMs > 0 || !nextRank) return;
    const normalized = answer.trim().toLowerCase();
    const expectedNormalized = expected.trim().toLowerCase();
    if (normalized === expectedNormalized && expectedNormalized.length > 0) {
      const updated = recordRankExamPass(nextRank);
      setCurrentRank(updated.rank);
      setMessage(`PASS — Rank increased to ${updated.rank}.`);
      setAnswer('');
      setCooldownMs(0);
      return;
    }
    recordRankExamFail();
    setMessage('FAIL — cooldown applied.');
    setCooldownMs(examCooldownRemaining(String(Date.now())));
  };

  return (
    <div className="glow-panel rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Rank-Up Exam</h3>
        <span className="text-xs text-soft">Rank {currentRank}</span>
      </div>
      <p className="mt-2 text-sm text-soft">
        {unlocked ? 'Exam unlocked. Prove your worth.' : 'Complete all chapters to unlock the exam.'}
      </p>
      <div className="mt-3 text-xs text-gold">Cooldown: {cooldownMs > 0 ? `${Math.ceil(cooldownMs / 60000)}m` : 'Ready'}</div>
      <div className="mt-4 space-y-3 text-sm">
        <div className="panel-inset rounded-lg p-3">{prompt}</div>
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Type command exactly"
          className="w-full rounded-lg border border-[#1e2a3a] bg-[#0c1119] px-3 py-2 text-sm text-[#e8eef8] outline-none transition focus:border-[#60e1ff]/65 focus:shadow-[0_0_20px_rgba(96,225,255,0.18)]"
          disabled={!unlocked || cooldownMs > 0 || !nextRank}
        />
        <Button onClick={submitExam} disabled={!unlocked || cooldownMs > 0 || !nextRank}>
          Submit Exam
        </Button>
        {message && <div className="text-xs text-soft">{message}</div>}
      </div>
    </div>
  );
}
