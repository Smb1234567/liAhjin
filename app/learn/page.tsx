import DataSourceBadge from '../../components/DataSourceBadge';
import LearnMapClient from '../../components/LearnMapClient';
import { localChapters } from '../../lib/localChapterData';
import { fallbackChallenges } from '../../lib/localChallengeData';
import { fetchChaptersAndChallenges, type ChapterRow, type ChallengeRow } from '../../lib/dbQueries';

export default async function LearnPage() {
  let chapters: ChapterRow[] = [];
  let challenges: Array<{
    id: number;
    slug: string;
    chapter_id: number;
    order_index: number;
  }> = [];
  let source: 'cloud' | 'local' = 'cloud';
  let errorMessage: string | null = null;

  try {
    const { chapters: dbChapters, challenges: dbChallenges } = await fetchChaptersAndChallenges();
    chapters = dbChapters;
    challenges = dbChallenges.map((c) => ({
      id: c.id,
      slug: c.slug,
      chapter_id: c.chapter_id,
      order_index: c.order_index
    }));
  } catch (error) {
    source = 'local';
    errorMessage = error instanceof Error ? error.message : 'Cloud database unavailable.';
    chapters = localChapters;
    challenges = fallbackChallenges.map((challenge) => ({
      id: challenge.id,
      slug: challenge.slug,
      chapter_id: challenge.chapter_id,
      order_index: challenge.order_index
    }));
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">Chapter Map</h1>
          <p className="text-soft">Follow the connected nodes to unlock the next rank.</p>
          <div className="mt-3">
            <DataSourceBadge source={source} note={source === 'local' ? 'offline' : undefined} />
          </div>
        </div>
        {source === 'local' && (
          <div className="glow-panel rounded-xl p-4 text-sm text-gold">
            Cloud unreachable. Showing local fallback data.
            {errorMessage ? ` (${errorMessage})` : ''}
          </div>
        )}
        {source === 'cloud' && chapters.length === 0 && (
          <div className="glow-panel rounded-xl p-4 text-sm text-gold">
            No chapters returned from cloud.
          </div>
        )}
        <LearnMapClient chapters={chapters} challenges={challenges} />
      </div>
    </main>
  );
}
