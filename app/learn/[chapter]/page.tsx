import DataSourceBadge from '../../../components/DataSourceBadge';
import ChapterChallengesClient from '../../../components/ChapterChallengesClient';
import { getFallbackChallengesByChapterId } from '../../../lib/localChallengeData';
import { getLocalChapterBySlug } from '../../../lib/localChapterData';
import { supabaseServer } from '../../../lib/supabaseServer';
import { slugify } from '../../../lib/slug';

export default async function ChapterDetailPage({ params }: { params: { chapter: string } }) {
  let source: 'cloud' | 'local' = 'cloud';
  let chapter: { id: number; title: string } | null = null;
  let challenges: Array<{
    id: number;
    slug: string;
    title: string;
    xp_reward: number;
    time_limit_seconds: number;
    difficulty: string;
    chapter_id: number;
    order_index: number;
  }> = [];

  try {
    const supabase = supabaseServer();
    const { data: chapters, error } = await supabase.from('chapters').select('*');
    if (error || !chapters) throw error ?? new Error('No chapters returned.');
    chapter = chapters.find((item) => slugify(item.title) === params.chapter) ?? null;
    if (chapter) {
      const { data, error: challengeError } = await supabase
        .from('challenges')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('order_index');
      if (challengeError) throw challengeError;
      challenges = data ?? [];
    }
    if (!chapter) {
      throw new Error('Chapter not found in cloud.');
    }
  } catch {
    source = 'local';
    chapter = getLocalChapterBySlug(params.chapter);
    if (chapter) {
      challenges = getFallbackChallengesByChapterId(chapter.id);
    }
  }

  if (!chapter) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="font-display text-3xl">Chapter not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">{chapter.title}</h1>
          <p className="text-gray-400">Complete every challenge to unlock the next chapter.</p>
          <div className="mt-3">
            <DataSourceBadge source={source} note={source === 'local' ? 'offline' : undefined} />
          </div>
        </div>
        {source === 'local' && (
          <div className="glow-panel rounded-xl p-4 text-sm text-amber-300">
            Supabase unreachable. Showing local fallback data.
          </div>
        )}
        <ChapterChallengesClient challenges={challenges} />
      </div>
    </main>
  );
}
