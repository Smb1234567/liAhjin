import { slugify } from './slug';

export type ChapterInput = {
  id: number;
  order_index: number;
  title: string;
  rank_required: string;
};

export type ChallengeInput = {
  id: number;
  slug: string;
  chapter_id: number;
  order_index: number;
};

export function buildChapterNodes(
  chapters: ChapterInput[],
  challenges: ChallengeInput[],
  completedChallengeSlugs: string[]
) {
  const sortedChapters = [...chapters].sort((a, b) => a.order_index - b.order_index);
  const challengesByChapter = new Map<number, ChallengeInput[]>();

  challenges.forEach((challenge) => {
    const list = challengesByChapter.get(challenge.chapter_id) ?? [];
    list.push(challenge);
    challengesByChapter.set(challenge.chapter_id, list);
  });

  challengesByChapter.forEach((list) => list.sort((a, b) => a.order_index - b.order_index));

  const completedChapterIds = new Set<number>();
  sortedChapters.forEach((chapter) => {
    const list = challengesByChapter.get(chapter.id) ?? [];
    if (list.length > 0 && list.every((challenge) => completedChallengeSlugs.includes(challenge.slug))) {
      completedChapterIds.add(chapter.id);
    }
  });

  const nodes = sortedChapters.map((chapter, index) => {
    const previousChapter = sortedChapters[index - 1];
    const unlocked = index === 0 || (previousChapter ? completedChapterIds.has(previousChapter.id) : false);
    const completed = completedChapterIds.has(chapter.id);
    return {
      id: chapter.id,
      slug: slugify(chapter.title),
      title: chapter.title,
      rank: chapter.rank_required,
      locked: !unlocked,
      completed,
      current: false
    };
  });

  const currentIndex = nodes.findIndex((node) => !node.locked && !node.completed);
  if (currentIndex >= 0) {
    nodes[currentIndex] = { ...nodes[currentIndex], current: true };
  }

  return { nodes, completedChapterIds: Array.from(completedChapterIds) };
}

export function buildChallengeStatuses<T extends ChallengeInput>(
  challenges: T[],
  completedChallengeSlugs: string[]
) {
  const sorted = [...challenges].sort((a, b) => a.order_index - b.order_index);
  return sorted.map((challenge, index) => {
    const previous = sorted[index - 1];
    const unlocked = index === 0 || (previous ? completedChallengeSlugs.includes(previous.slug) : false);
    return {
      ...challenge,
      unlocked,
      completed: completedChallengeSlugs.includes(challenge.slug)
    } as T & { unlocked: boolean; completed: boolean };
  });
}
