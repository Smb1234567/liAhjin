import { getDb } from './db';
import { slugify } from './slug';

export type ChapterRow = {
  id: number;
  order_index: number;
  title: string;
  rank_required: string;
};

export type ChallengeRow = {
  id: number;
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
  chapter_id: number;
  order_index: number;
};

export async function fetchChaptersAndChallenges() {
  const sql = getDb();
  const chapters = await sql`select id, order_index, title, rank_required from chapters order by order_index` as ChapterRow[];
  const challenges = await sql`
    select id, slug, title, description, difficulty, tags, xp_reward, time_limit_seconds, hints,
           setup_script, validator_script, chapter_id, order_index
    from challenges
    order by order_index` as ChallengeRow[];
  return { chapters, challenges };
}

export async function fetchChapterWithChallengesBySlug(slug: string) {
  const { chapters, challenges } = await fetchChaptersAndChallenges();
  const chapter = chapters.find((c) => slugify(c.title) === slug) ?? null;
  const chapterChallenges: ChallengeRow[] = chapter
    ? challenges.filter((c) => c.chapter_id === chapter.id).sort((a, b) => a.order_index - b.order_index)
    : [];
  return { chapter, chapterChallenges };
}

export async function fetchChallengeBySlug(slug: string) {
  const sql = getDb();
  const challengeRows = await sql`
    select id, slug, title, description, difficulty, tags, xp_reward, time_limit_seconds, hints,
           setup_script, validator_script, chapter_id, order_index
    from challenges
    where slug = ${slug}
    limit 1` as ChallengeRow[];
  const challenge = challengeRows[0] ?? null;
  if (!challenge) return { challenge: null, chapterChallenges: [] };
  const chapterChallenges = await sql`
    select id, slug, chapter_id, order_index
    from challenges
    where chapter_id = ${challenge.chapter_id}
    order by order_index` as Pick<ChallengeRow, 'id' | 'slug' | 'chapter_id' | 'order_index'>[];
  return { challenge, chapterChallenges };
}
