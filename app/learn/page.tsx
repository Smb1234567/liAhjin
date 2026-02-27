import ChapterMap from '../../components/ChapterMap';
import { supabaseServer } from '../../lib/supabaseServer';
import { slugify } from '../../lib/slug';

export default async function LearnPage() {
  const supabase = supabaseServer();
  const { data: chapters, error } = await supabase.from('chapters').select('*').order('order_index');
  const unlockedChapterIds = new Set<number>([1, 2, 3]);
  const completedChapterIds = new Set<number>([1, 2]);

  const chapterNodes = (chapters ?? []).map((chapter, index) => ({
    id: chapter.id,
    slug: slugify(chapter.title),
    title: chapter.title,
    rank: chapter.rank_required,
    locked: !unlockedChapterIds.has(chapter.id),
    completed: completedChapterIds.has(chapter.id),
    current: chapter.id === 3 || (!completedChapterIds.has(chapter.id) && index === 0)
  }));

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">Chapter Map</h1>
          <p className="text-gray-400">Follow the connected nodes to unlock the next rank.</p>
        </div>
        {error && (
          <div className="glow-panel rounded-xl p-4 text-sm text-red-400">
            Failed to load chapters: {error.message}
          </div>
        )}
        {!error && chapterNodes.length === 0 && (
          <div className="glow-panel rounded-xl p-4 text-sm text-amber-300">
            No chapters returned from Supabase.
          </div>
        )}
        <ChapterMap chapters={chapterNodes} />
      </div>
    </main>
  );
}
