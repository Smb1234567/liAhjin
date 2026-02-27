export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

const rankOrder: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export function rankFromLevel(level: number): Rank {
  if (level >= 70) return 'SSS';
  if (level >= 60) return 'SS';
  if (level >= 50) return 'S';
  if (level >= 40) return 'A';
  if (level >= 30) return 'B';
  if (level >= 20) return 'C';
  if (level >= 10) return 'D';
  return 'E';
}

export function nextLevelXp(level: number) {
  return Math.floor(100 + level * 35);
}

export function applyHintPenalty(baseXp: number, hintsUsed: number) {
  const penalty = Math.min(hintsUsed * 0.1, 0.6);
  return Math.max(0, Math.floor(baseXp * (1 - penalty)));
}

export function awardStats(tags: string[]) {
  const stats = { STR: 0, INT: 0, AGI: 0, END: 0 };
  tags.forEach((tag) => {
    if (['bash', 'script', 'automation'].includes(tag)) stats.STR += 1;
    if (['concept', 'theory', 'manpage'].includes(tag)) stats.INT += 1;
    if (['speed', 'timed'].includes(tag)) stats.AGI += 1;
    if (['streak'].includes(tag)) stats.END += 1;
  });
  return stats;
}

export function rankColor(rank: Rank) {
  switch (rank) {
    case 'E':
      return 'text-rank-e';
    case 'D':
      return 'text-rank-d';
    case 'C':
      return 'text-rank-c';
    case 'B':
      return 'text-rank-b';
    case 'A':
      return 'text-rank-a';
    case 'S':
      return 'text-rank-s';
    case 'SS':
      return 'text-orange-400';
    case 'SSS':
      return 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400';
  }
}

export function isRankUnlocked(currentRank: Rank, requiredRank: Rank) {
  return rankOrder.indexOf(currentRank) >= rankOrder.indexOf(requiredRank);
}
