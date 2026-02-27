import ChallengeArena from '../../../components/ChallengeArena';
import { getFallbackChallengeBySlug } from '../../../lib/localChallengeData';
import { supabaseServer } from '../../../lib/supabaseServer';

export default async function ChallengePage({ params }: { params: { slug: string } }) {
  let challenge: {
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
  } | null = null;

  try {
    const supabase = supabaseServer();
    const { data } = await supabase.from('challenges').select('*').eq('slug', params.slug).single();
    challenge = data;
  } catch {
    challenge = getFallbackChallengeBySlug(params.slug);
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
  return <ChallengeArena challenge={challenge} />;
}
