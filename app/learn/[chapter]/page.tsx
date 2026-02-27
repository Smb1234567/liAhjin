import Link from 'next/link';
import { supabaseServer } from '../../../lib/supabaseServer';
import { slugify } from '../../../lib/slug';

export default async function ChapterDetailPage({ params }: { params: { chapter: string } }) {
  const supabase = supabaseServer();
  const { data: chapters } = await supabase.from('chapters').select('*');
  const chapter = chapters?.find((item) => slugify(item.title) === params.chapter);

  if (!chapter) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="font-display text-3xl">Chapter not found</h1>
        </div>
      </main>
    );
  }

  const { data: challenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('chapter_id', chapter.id)
    .order('order_index');

  const completedChallenges = new Set<number>([challenges?.[0]?.id ?? 0]);

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-4xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">{chapter.title}</h1>
          <p className="text-gray-400">Complete every challenge to unlock the next chapter.</p>
        </div>
        <div className="space-y-4">
          {(challenges ?? []).map((challenge, index) => {
            const isCompleted = completedChallenges.has(challenge.id);
            const isUnlocked = index === 0 || completedChallenges.has((challenges ?? [])[index - 1]?.id ?? -1);
            return (
              <div key={challenge.slug} className="glow-panel rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl">{challenge.title}</h3>
                  <p className="text-xs text-gray-400">
                    XP {challenge.xp_reward} • {challenge.time_limit_seconds}s • {challenge.difficulty}
                  </p>
                </div>
                {!isUnlocked ? (
                  <span className="text-gray-600">Locked</span>
                ) : (
                  <Link
                    href={`/challenges/${challenge.slug}`}
                    className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200"
                  >
                    {isCompleted ? 'Replay' : 'Start'}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
