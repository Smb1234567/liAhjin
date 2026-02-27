import { applyHintPenalty, nextLevelXp, rankFromLevel, type Rank } from './xp';

const STORAGE_KEY = 'linuxhunter_progress_v1';

export type LocalProgress = {
  level: number;
  rank: Rank;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  streak: number;
  completedChallenges: string[];
  attempts: number;
  hintsUsedTotal: number;
  lastLevelUpAt: number | null;
};

export type ChallengeResultInput = {
  slug: string;
  baseXp: number;
  hintsUsed: number;
  timeTakenSeconds: number;
  parTimeSeconds: number;
  attempts: number;
};

export type ChallengeResultOutput = {
  progress: LocalProgress;
  xpAwarded: number;
  levelUps: number;
};

const defaultProgress: LocalProgress = {
  level: 1,
  rank: 'E',
  totalXp: 0,
  currentLevelXp: 10,
  nextLevelXp: nextLevelXp(1),
  streak: 0,
  completedChallenges: [],
  attempts: 0,
  hintsUsedTotal: 0,
  lastLevelUpAt: null
};

function hasWindow() {
  return typeof window !== 'undefined';
}

export function getLocalProgress(): LocalProgress {
  if (!hasWindow()) return defaultProgress;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProgress;
  try {
    const parsed = JSON.parse(raw) as LocalProgress;
    return {
      ...defaultProgress,
      ...parsed,
      rank: rankFromLevel(parsed.level ?? 1),
      nextLevelXp: nextLevelXp(parsed.level ?? 1)
    };
  } catch {
    return defaultProgress;
  }
}

export function saveLocalProgress(progress: LocalProgress) {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function applySpeedBonus(xp: number, timeTakenSeconds: number, parTimeSeconds: number) {
  if (parTimeSeconds <= 0) return xp;
  if (timeTakenSeconds <= parTimeSeconds) {
    return Math.floor(xp * 1.1);
  }
  return xp;
}

export function recordChallengeResult(input: ChallengeResultInput): ChallengeResultOutput {
  const progress = getLocalProgress();
  const penalizedXp = applyHintPenalty(input.baseXp, input.hintsUsed);
  const xpAwarded = applySpeedBonus(penalizedXp, input.timeTakenSeconds, input.parTimeSeconds);

  let next = {
    ...progress,
    totalXp: progress.totalXp + xpAwarded,
    currentLevelXp: progress.currentLevelXp + xpAwarded,
    attempts: progress.attempts + input.attempts,
    hintsUsedTotal: progress.hintsUsedTotal + input.hintsUsed
  };

  if (!next.completedChallenges.includes(input.slug)) {
    next.completedChallenges = [...next.completedChallenges, input.slug];
    next.streak += 1;
  }

  let levelUps = 0;
  while (next.currentLevelXp >= next.nextLevelXp) {
    next.currentLevelXp -= next.nextLevelXp;
    next.level += 1;
    next.rank = rankFromLevel(next.level);
    next.nextLevelXp = nextLevelXp(next.level);
    levelUps += 1;
  }

  if (levelUps > 0) {
    next.lastLevelUpAt = Date.now();
  }

  saveLocalProgress(next);
  return { progress: next, xpAwarded, levelUps };
}

export function clearRecentLevelUp() {
  const progress = getLocalProgress();
  if (!progress.lastLevelUpAt) return;
  const next = { ...progress, lastLevelUpAt: null };
  saveLocalProgress(next);
}
