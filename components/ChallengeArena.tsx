'use client';

import { useState } from 'react';
import HintAccordion from './HintAccordion';
import ChallengeSession from './ChallengeSession';

type ChallengeArenaProps = {
  challenge: {
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
  };
};

export default function ChallengeArena({ challenge }: ChallengeArenaProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-6">
          <div className="glow-panel rounded-xl p-6">
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
          setupScript={challenge.setup_script}
          validatorScript={challenge.validator_script}
          xpReward={challenge.xp_reward}
          timeLimitSeconds={challenge.time_limit_seconds}
          hintsUsed={revealedHints.length}
        />
      </div>
    </main>
  );
}
