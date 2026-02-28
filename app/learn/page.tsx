import DataSourceBadge from '../../components/DataSourceBadge';
import LearnMapClient from '../../components/LearnMapClient';
import { localChapters } from '../../lib/localChapterData';
import { fallbackChallenges } from '../../lib/localChallengeData';
import { supabaseServer } from '../../lib/supabaseServer';

export default async function LearnPage() {
  let chapters: Array<{
    id: number;
    order_index: number;
    title: string;
    rank_required: string;
  }> = [];
  let challenges: Array<{
    id: number;
    slug: string;
    chapter_id: number;
    order_index: number;
  }> = [];
  let source: 'cloud' | 'local' = 'cloud';
  let errorMessage: string | null = null;

  try {
    const supabase = supabaseServer();
    const { data: chapterData, error } = await supabase.from('chapters').select('*').order('order_index');
    if (error) throw error;
    chapters = chapterData ?? [];
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('id, slug, chapter_id, order_index')
      .order('order_index');
    if (challengeError) throw challengeError;
    challenges = challengeData ?? [];
  } catch (error) {
    source = 'local';
    errorMessage = error instanceof Error ? error.message : 'Supabase unavailable.';
    chapters = localChapters;
    challenges = fallbackChallenges.map((challenge) => ({
      id: challenge.id,
      slug: challenge.slug,
      chapter_id: challenge.chapter_id,
      order_index: challenge.order_index
    }));
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">Chapter Map</h1>
          <p className="text-gray-400">Follow the connected nodes to unlock the next rank.</p>
          <div className="mt-3">
            <DataSourceBadge source={source} note={source === 'local' ? 'offline' : undefined} />
          </div>
        </div>
        {source === 'local' && (
          <div className="glow-panel rounded-xl p-4 text-sm text-amber-300">
            Supabase unreachable. Showing local fallback data.
            {errorMessage ? ` (${errorMessage})` : ''}
          </div>
        )}
        {source === 'cloud' && chapters.length === 0 && (
          <div className="glow-panel rounded-xl p-4 text-sm text-amber-300">
            No chapters returned from Supabase.
          </div>
        )}
        <LearnMapClient chapters={chapters} challenges={challenges} />
      </div>
    </main>
  );
}
