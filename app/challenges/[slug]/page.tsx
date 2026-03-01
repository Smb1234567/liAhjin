import ChallengeGate from '../../../components/ChallengeGate';
import { getChallengeSlugCandidates } from '../../../lib/challengeSlugAliases';
import { fallbackChallenges, getFallbackChallengeBySlug, getFallbackChallengesByChapterId } from '../../../lib/localChallengeData';
import { localChapters } from '../../../lib/localChapterData';
import { fetchChaptersAndChallenges, type ChapterRow, type ChallengeRow } from '../../../lib/dbQueries';

function buildOrderedChallengeSlugs(
  chapters: Array<Pick<ChapterRow, 'id' | 'order_index'>>,
  challenges: Array<Pick<ChallengeRow, 'slug' | 'chapter_id' | 'order_index'>>
) {
  const chapterOrder = new Map(chapters.map((chapter) => [chapter.id, chapter.order_index]));
  return [...challenges]
    .sort((a, b) => {
      const chapterA = chapterOrder.get(a.chapter_id) ?? Number.MAX_SAFE_INTEGER;
      const chapterB = chapterOrder.get(b.chapter_id) ?? Number.MAX_SAFE_INTEGER;
      if (chapterA !== chapterB) return chapterA - chapterB;
      return a.order_index - b.order_index;
    })
    .map((challenge) => challenge.slug);
}

export default async function ChallengePage({ params }: { params: { slug: string } }) {
  let challenge: {
    id: number;
    chapter_id: number;
    order_index: number;
    slug: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[] | null;
    xp_reward: number;
    time_limit_seconds: number;
    hints: string[] | null;
    setup_script: string | null;
    validator_script: string | null;
  } | null = null;
  let chapterChallenges: Array<{ id: number; slug: string; chapter_id: number; order_index: number }> = [];
  let nextChallengeSlug: string | null = null;
  let dataSource: 'cloud' | 'local' = 'cloud';
  const slugCandidates = getChallengeSlugCandidates(params.slug);

  try {
    const { chapters, challenges } = await fetchChaptersAndChallenges();
    for (const slugCandidate of slugCandidates) {
      const found = challenges.find((row) => row.slug === slugCandidate);
      if (!found) continue;
      challenge = found;
      chapterChallenges = challenges
        .filter((row) => row.chapter_id === found.chapter_id)
        .map((row) => ({
          id: row.id,
          slug: row.slug,
          chapter_id: row.chapter_id,
          order_index: row.order_index
        }))
        .sort((a, b) => a.order_index - b.order_index);
      break;
    }

    if (!challenge) throw new Error('Challenge not found in cloud.');

    const orderedSlugs = buildOrderedChallengeSlugs(chapters, challenges);
    const currentIndex = orderedSlugs.indexOf(challenge.slug);
    nextChallengeSlug =
      currentIndex >= 0 && currentIndex < orderedSlugs.length - 1 ? orderedSlugs[currentIndex + 1] : null;
  } catch {
    dataSource = 'local';
    challenge = getFallbackChallengeBySlug(params.slug);
    if (challenge) {
      chapterChallenges = getFallbackChallengesByChapterId(challenge.chapter_id).map((item) => ({
        id: item.id,
        slug: item.slug,
        chapter_id: item.chapter_id,
        order_index: item.order_index
      }));
      const orderedSlugs = buildOrderedChallengeSlugs(localChapters, fallbackChallenges);
      const currentIndex = orderedSlugs.indexOf(challenge.slug);
      nextChallengeSlug =
        currentIndex >= 0 && currentIndex < orderedSlugs.length - 1 ? orderedSlugs[currentIndex + 1] : null;
    }
  }

  if (!challenge) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="font-display text-3xl">Challenge not found</h1>
        </div>
      </main>
    );
  }
  return (
    <ChallengeGate
      challenge={challenge}
      chapterChallenges={chapterChallenges}
      dataSource={dataSource}
      nextChallengeSlug={nextChallengeSlug}
    />
  );
}
