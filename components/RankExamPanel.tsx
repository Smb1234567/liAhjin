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
        <span className="text-xs text-soft">Rank {currentRank}</span>
      </div>
      <p className="mt-2 text-sm text-soft">
        {unlocked ? 'Exam unlocked. Prove your worth.' : 'Complete all chapters to unlock the exam.'}
      </p>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="text-gold">Cooldown: {formatCooldown(cooldownMs)}</span>
        <button
          className="rounded-full border border-[#f8b84e]/80 bg-[#f8b84e] px-4 py-2 text-[#120d05] shadow-[0_0_20px_rgba(248,184,78,0.25)] transition hover:shadow-[0_0_28px_rgba(248,184,78,0.38)]"
          disabled={!unlocked || cooldownMs > 0}
        >
          Enter Exam
        </button>
      </div>
    </div>
  );
}
