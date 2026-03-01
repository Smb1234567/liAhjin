import { applyHintPenalty, nextLevelXp, rankFromLevel, awardStats, type Rank } from './xp';
import { TITLES, checkRankTitle } from './titles';
import { normalizeChallengeSlug } from './challengeSlugAliases';

const STORAGE_KEY = 'linuxhunter_progress_v1';

export type LocalProgress = {
  level: number;
  rank: Rank;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  streak: number;
  completedChallenges: string[];
  completedChapterIds: number[];
  attempts: number;
  hintsUsedTotal: number;
  stats: { STR: number; INT: number; AGI: number; END: number };
  titles: string[];
  tagCounts: Record<string, number>;
  fastSolveCount: number;
  noHintNoFailCount: number;
  dailyChallengeCount: number;
  dailyNoHintCount: number;
  weeklyChallengeCount: number;
  weeklyPermissionCount: number;
  weeklyChapterCompleteCount: number;
  lastActiveAt: number | null;
  lastLevelUpAt: number | null;
  lastRankExamFailAt: number | null;
  lastRankExamPassAt: number | null;
};

export type ChallengeResultInput = {
  slug: string;
  baseXp: number;
  hintsUsed: number;
  timeTakenSeconds: number;
  parTimeSeconds: number;
  attempts: number;
  tags: string[];
  chapterId: number;
  chapterChallengeSlugs: string[];
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
  completedChapterIds: [],
  attempts: 0,
  hintsUsedTotal: 0,
  stats: { STR: 0, INT: 0, AGI: 0, END: 0 },
  titles: [],
  tagCounts: {},
  fastSolveCount: 0,
  noHintNoFailCount: 0,
  dailyChallengeCount: 0,
  dailyNoHintCount: 0,
  weeklyChallengeCount: 0,
  weeklyPermissionCount: 0,
  weeklyChapterCompleteCount: 0,
  lastActiveAt: null,
  lastLevelUpAt: null,
  lastRankExamFailAt: null,
  lastRankExamPassAt: null
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
    const resolvedRank = parsed.rank ?? rankFromLevel(parsed.level ?? 1);
    const normalizedCompletedChallenges = Array.from(
      new Set((parsed.completedChallenges ?? []).map((slug) => normalizeChallengeSlug(slug)))
    );
    return {
      ...defaultProgress,
      ...parsed,
      completedChallenges: normalizedCompletedChallenges,
      rank: resolvedRank,
      nextLevelXp: nextLevelXp(parsed.level ?? 1)
    };
  } catch {
    return defaultProgress;
  }
}

export function saveLocalProgress(progress: LocalProgress) {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new CustomEvent('linuxhunter-progress'));
}

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isSameWeek(a: Date, b: Date) {
  const onejan = new Date(b.getFullYear(), 0, 1);
  const week = Math.floor(((b.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  const weekA = Math.floor(((a.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return b.getFullYear() === a.getFullYear() && week === weekA;
}

function applySpeedBonus(xp: number, timeTakenSeconds: number, parTimeSeconds: number) {
  if (parTimeSeconds <= 0) return xp;
  if (timeTakenSeconds <= parTimeSeconds) {
    return Math.floor(xp * 1.1);
  }
  return xp;
}

export function recordChallengeResult(input: ChallengeResultInput): ChallengeResultOutput {
  const normalizedSlug = normalizeChallengeSlug(input.slug);
  const normalizedChapterChallengeSlugs = Array.from(
    new Set(input.chapterChallengeSlugs.map((slug) => normalizeChallengeSlug(slug)))
  );
  const progress = getLocalProgress();
  const alreadyCompleted = progress.completedChallenges.includes(normalizedSlug);
  const now = Date.now();
  const lastActive = progress.lastActiveAt ? new Date(progress.lastActiveAt) : null;
  const nowDate = new Date(now);
  const resetDaily = !lastActive || !isSameDay(lastActive, nowDate);
  const resetWeekly = !lastActive || !isSameWeek(lastActive, nowDate);

  if (alreadyCompleted) {
    const next = {
      ...progress,
      attempts: progress.attempts + input.attempts,
      lastActiveAt: now
    };
    saveLocalProgress(next);
    return { progress: next, xpAwarded: 0, levelUps: 0 };
  }

  const penalizedXp = applyHintPenalty(input.baseXp, input.hintsUsed);
  const xpAwarded = applySpeedBonus(penalizedXp, input.timeTakenSeconds, input.parTimeSeconds);

  let next = {
    ...progress,
    totalXp: progress.totalXp + xpAwarded,
    currentLevelXp: progress.currentLevelXp + xpAwarded,
    attempts: progress.attempts + input.attempts,
    hintsUsedTotal: progress.hintsUsedTotal + input.hintsUsed,
    dailyChallengeCount: resetDaily ? 0 : progress.dailyChallengeCount,
    dailyNoHintCount: resetDaily ? 0 : progress.dailyNoHintCount,
    weeklyChallengeCount: resetWeekly ? 0 : progress.weeklyChallengeCount,
    weeklyPermissionCount: resetWeekly ? 0 : progress.weeklyPermissionCount,
    weeklyChapterCompleteCount: resetWeekly ? 0 : progress.weeklyChapterCompleteCount,
    lastActiveAt: now
  };

  if (!next.completedChallenges.includes(normalizedSlug)) {
    next.completedChallenges = [...next.completedChallenges, normalizedSlug];
    next.streak += 1;
    next.dailyChallengeCount += 1;
    next.weeklyChallengeCount += 1;
    if (input.hintsUsed === 0) {
      next.dailyNoHintCount += 1;
    }
    if (input.timeTakenSeconds <= input.parTimeSeconds) {
      next.fastSolveCount += 1;
      next.stats.AGI += 1;
    }
    if (input.hintsUsed === 0 && input.attempts === 1) {
      next.noHintNoFailCount += 1;
      next.stats.END += 1;
    }

    const tagDelta = input.tags.reduce(
      (acc, tag) => {
        const key = tag.toLowerCase();
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    next.tagCounts = { ...next.tagCounts, ...tagDelta };
    if (input.tags.some((tag) => tag.toLowerCase().includes('permissions'))) {
      next.weeklyPermissionCount += 1;
    }

    const statDelta = input.tags.length ? awardStats(input.tags) : { STR: 0, INT: 0, AGI: 0, END: 0 };
    next.stats = {
      STR: next.stats.STR + statDelta.STR,
      INT: next.stats.INT + statDelta.INT,
      AGI: next.stats.AGI + statDelta.AGI,
      END: next.stats.END + statDelta.END
    };

    if (normalizedChapterChallengeSlugs.length > 0) {
      const complete = normalizedChapterChallengeSlugs.every((slug) => next.completedChallenges.includes(slug));
      if (complete && !next.completedChapterIds.includes(input.chapterId)) {
        next.completedChapterIds = [...next.completedChapterIds, input.chapterId];
        next.weeklyChapterCompleteCount += 1;
      }
    }
  }

  let levelUps = 0;
  while (next.currentLevelXp >= next.nextLevelXp) {
    next.currentLevelXp -= next.nextLevelXp;
    next.level += 1;
    next.nextLevelXp = nextLevelXp(next.level);
    levelUps += 1;
  }

  if (levelUps > 0) {
    next.lastLevelUpAt = Date.now();
  }

  next.titles = updateTitles(next);

  saveLocalProgress(next);
  return { progress: next, xpAwarded, levelUps };
}

export function clearRecentLevelUp() {
  const progress = getLocalProgress();
  if (!progress.lastLevelUpAt) return;
  const next = { ...progress, lastLevelUpAt: null };
  saveLocalProgress(next);
}

export function recordRankExamPass(nextRank: Rank) {
  const progress = getLocalProgress();
  const next = {
    ...progress,
    rank: nextRank,
    lastRankExamPassAt: Date.now(),
    lastRankExamFailAt: null
  };
  next.titles = updateTitles(next);
  saveLocalProgress(next);
  return next;
}

export function recordRankExamFail() {
  const progress = getLocalProgress();
  const next = { ...progress, lastRankExamFailAt: Date.now() };
  saveLocalProgress(next);
  return next;
}

function updateTitles(progress: LocalProgress) {
  const earned = new Set(progress.titles);
  if (progress.completedChapterIds.includes(1)) earned.add('awakened');
  if (progress.completedChapterIds.includes(4)) earned.add('pipe-dream');
  if (progress.noHintNoFailCount >= 10) earned.add('silent-hunter');
  if (progress.fastSolveCount >= 20) earned.add('speed-demon');
  if ((progress.tagCounts['grep'] ?? 0) + (progress.tagCounts['text'] ?? 0) >= 50) earned.add('grep-god');
  if ((progress.tagCounts['manpage'] ?? 0) + (progress.tagCounts['help'] ?? 0) >= 50) earned.add('manpage');
  const rankTitle = checkRankTitle(progress.rank);
  if (rankTitle) earned.add(rankTitle);

  const knownKeys = new Set(TITLES.map((title) => title.key));
  return Array.from(earned).filter((key) => knownKeys.has(key));
}
