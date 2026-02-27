import type { Rank } from './xp';

export const rankExamMap: Record<Rank, { nextRank: Rank | null; chapterIds: number[] }> = {
  E: { nextRank: 'D', chapterIds: [1, 2] },
  D: { nextRank: 'C', chapterIds: [3, 4, 5, 6] },
  C: { nextRank: 'B', chapterIds: [7, 8] },
  B: { nextRank: 'A', chapterIds: [9, 10, 11] },
  A: { nextRank: 'S', chapterIds: [12, 13] },
  S: { nextRank: 'SS', chapterIds: [14] },
  SS: { nextRank: 'SSS', chapterIds: [14] },
  SSS: { nextRank: null, chapterIds: [14] }
};

export function isRankExamUnlocked(currentRank: Rank, completedChapterIds: number[]) {
  const gate = rankExamMap[currentRank];
  return gate.chapterIds.every((id) => completedChapterIds.includes(id));
}

export function examCooldownRemaining(lastFailAt?: string | null) {
  if (!lastFailAt) return 0;
  const last = new Date(lastFailAt).getTime();
  const cooldownMs = 24 * 60 * 60 * 1000;
  const remaining = cooldownMs - (Date.now() - last);
  return remaining > 0 ? remaining : 0;
}

export function formatCooldown(ms: number) {
  if (ms <= 0) return 'Ready';
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m`;
}
