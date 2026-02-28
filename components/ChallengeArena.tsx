'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import HintAccordion from './HintAccordion';
import ChallengeSession from './ChallengeSession';
import { Badge } from './ui/badge';

type ChallengeArenaProps = {
  dataSource: 'cloud' | 'local';
  challenge: {
    id: number;
    chapter_id: number;
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
  };
  chapterChallenges: Array<{ id: number; slug: string; chapter_id: number; order_index: number }>;
};

export default function ChallengeArena({ challenge, dataSource, chapterChallenges }: ChallengeArenaProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const router = useRouter();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlug = useMemo(() => {
    const list = chapterChallenges
      .filter((item) => item.chapter_id === challenge.chapter_id)
      .sort((a, b) => a.order_index - b.order_index)
      .map((item) => item.slug);
    const idx = list.indexOf(challenge.slug);
    return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  }, [chapterChallenges, challenge.chapter_id, challenge.slug]);

  const handleSolved = () => {
    setSolved(true);
    if (nextSlug) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        router.push(`/challenges/${nextSlug}`);
      }, 900);
    }
  };

  // Clear timer when unmounting to avoid pushing after leave.
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);
  const chapterChallengeSlugs = chapterChallenges
    .filter((item) => item.chapter_id === challenge.chapter_id)
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => item.slug);

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-6">
          <div className="glow-panel rounded-xl p-6">
            <div className="mb-3">
              <Badge variant={dataSource === 'cloud' ? 'secondary' : 'default'}>
                {dataSource === 'cloud' ? 'Cloud' : 'Local Fallback'}
              </Badge>
            </div>
            <div className="system-title">Dungeon Briefing</div>
            <h1 className="font-display text-3xl">{challenge.title}</h1>
            <p className="text-gray-400">{challenge.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
              {(challenge.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full border border-gray-700 px-3 py-1">
                  {tag}
                </span>
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
            <p className="text-xs text-gray-500">Each hint costs 10% XP. Revealed: {revealedHints.length}</p>
            <div className="mt-4">
              <HintAccordion
                hints={challenge.hints ?? []}
                disabled={solved}
                onReveal={(index) => {
                  setRevealedHints((prev) => (prev.includes(index) ? prev : [...prev, index]));
                }}
              />
            </div>
          </div>
        </section>

        <ChallengeSession
          challengeId={challenge.id}
          slug={challenge.slug}
          chapterId={challenge.chapter_id}
          chapterChallengeSlugs={chapterChallengeSlugs}
          setupScript={challenge.setup_script}
          validatorScript={challenge.validator_script}
          xpReward={challenge.xp_reward}
          timeLimitSeconds={challenge.time_limit_seconds}
          hintsUsed={revealedHints.length}
          tags={challenge.tags ?? []}
          onSolved={handleSolved}
        />
        {solved && (
          <div className="mt-2 text-sm text-emerald-300">
            Cleared! {nextSlug ? `Loading next challenge...` : `Chapter complete.`}
          </div>
        )}
      </div>
    </main>
  );
}
