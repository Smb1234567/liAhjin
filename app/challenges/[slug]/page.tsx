import HintAccordion from '../../../components/HintAccordion';
import ChallengeSession from '../../../components/ChallengeSession';
import { supabaseServer } from '../../../lib/supabaseServer';

export default async function ChallengePage({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!challenge) {
    return (
      <main className="min-h-screen bg-gray-950">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="font-display text-3xl">Challenge not found</h1>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-6">
          <div className="glow-panel rounded-xl p-6">
            <h1 className="font-display text-3xl">{challenge.title}</h1>
            <p className="text-gray-400">{challenge.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
              {(challenge.tags ?? []).map((tag: string) => (
                <span key={tag} className="rounded-full border border-gray-700 px-3 py-1">{tag}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-300">
              <span>Difficulty: {challenge.difficulty}</span>
              <span>Par time: {challenge.time_limit_seconds}s</span>
              <span>XP: {challenge.xp_reward}</span>
            </div>
          </div>

          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl">Hints</h2>
            <p className="text-xs text-gray-500">Each hint costs 10% XP.</p>
            <div className="mt-4">
              <HintAccordion hints={challenge.hints ?? []} />
            </div>
          </div>
        </section>
        <ChallengeSession
          challengeId={challenge.id}
          setupScript={challenge.setup_script}
          validatorScript={challenge.validator_script}
        />
      </div>
    </main>
  );
}
