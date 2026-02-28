import ChallengeGate from '../../../components/ChallengeGate';
import { getFallbackChallengeBySlug, getFallbackChallengesByChapterId } from '../../../lib/localChallengeData';
import { supabaseServer } from '../../../lib/supabaseServer';

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
  let dataSource: 'cloud' | 'local' = 'cloud';

  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase.from('challenges').select('*').eq('slug', params.slug).single();
    if (error || !data) throw error ?? new Error('Challenge not found in cloud.');
    challenge = data;
    if (challenge) {
      const { data: chapterData, error: chapterError } = await supabase
        .from('challenges')
        .select('id, slug, chapter_id, order_index')
        .eq('chapter_id', challenge.chapter_id)
        .order('order_index');
      if (chapterError) throw chapterError;
      chapterChallenges = chapterData ?? [];
    }
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
    }
  }

  if (!challenge) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="font-display text-3xl">Challenge not found</h1>
        </div>
      </main>
    );
  }
  return <ChallengeGate challenge={challenge} chapterChallenges={chapterChallenges} dataSource={dataSource} />;
}
