import DataSourceBadge from '../../../components/DataSourceBadge';
import ChapterChallengesClient from '../../../components/ChapterChallengesClient';
import { getFallbackChallengesByChapterId } from '../../../lib/localChallengeData';
import { getLocalChapterBySlug } from '../../../lib/localChapterData';
import { fetchChapterWithChallengesBySlug, type ChallengeRow } from '../../../lib/dbQueries';

export default async function ChapterDetailPage({ params }: { params: { chapter: string } }) {
  let source: 'cloud' | 'local' = 'cloud';
  let chapter: { id: number; title: string } | null = null;
  let challenges: ChallengeRow[] = [];

  try {
    const { chapter: dbChapter, chapterChallenges } = await fetchChapterWithChallengesBySlug(params.chapter);
    if (!dbChapter) throw new Error('Chapter not found in cloud.');
    chapter = { id: dbChapter.id, title: dbChapter.title };
    challenges = chapterChallenges;
  } catch {
    source = 'local';
    chapter = getLocalChapterBySlug(params.chapter);
    if (chapter) {
      challenges = getFallbackChallengesByChapterId(chapter.id);
    }
  }

  if (!chapter) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="font-display text-3xl">Chapter not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">{chapter.title}</h1>
          <p className="text-soft">Complete every challenge to unlock the next chapter.</p>
          <div className="mt-3">
            <DataSourceBadge source={source} note={source === 'local' ? 'offline' : undefined} />
          </div>
        </div>
        {source === 'local' && (
          <div className="glow-panel rounded-xl p-4 text-sm text-gold">
            Cloud unreachable. Showing local fallback data.
          </div>
        )}
        <ChapterChallengesClient challenges={challenges} />
      </div>
    </main>
  );
}
