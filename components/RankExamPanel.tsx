import { formatCooldown } from '../lib/rankExams';
import type { Rank } from '../lib/xp';

export default function RankExamPanel({
  currentRank,
  unlocked,
  cooldownMs
}: {
  currentRank: Rank;
  unlocked: boolean;
  cooldownMs: number;
}) {
  return (
    <div className="glow-panel rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl">Rank-Up Exam</h3>
        <span className="text-xs text-gray-400">Rank {currentRank}</span>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        {unlocked ? 'Exam unlocked. Prove your worth.' : 'Complete all chapters to unlock the exam.'}
      </p>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-amber-300">Cooldown: {formatCooldown(cooldownMs)}</span>
        <button
          className="rounded-full bg-amber-400 px-4 py-2 text-gray-950"
          disabled={!unlocked || cooldownMs > 0}
        >
          Enter Exam
        </button>
      </div>
    </div>
  );
}
