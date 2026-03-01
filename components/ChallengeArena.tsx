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
  nextChallengeSlug?: string | null;
};

const beginnerGuides: Record<string, { goal: string; steps: string[]; command?: string }> = {
  'echo-hello': {
    goal: 'Create `/tmp/hello.txt` with `hello world`.',
    steps: [
      'Start session.',
      'Run a command that writes the text into `/tmp/hello.txt`.',
      'Submit for validation.'
    ],
    command: 'echo "hello world" > /tmp/hello.txt'
  },
  'pwd-ls-cd': {
    goal: 'Move into `/tmp/room`, list files, and verify your location.',
    steps: [
      'Start session.',
      'Change directory to `/tmp/room`.',
      'Run `ls` and then `pwd`.',
      'Submit for validation.'
    ],
    command: 'cd /tmp/room && ls && pwd'
  },
  'paths-01': {
    goal: 'Read `/tmp/cave/rune.txt` using an absolute path.',
    steps: [
      'Start session.',
      'Use `cat` with the full path `/tmp/cave/rune.txt`.',
      'Submit for validation.'
    ],
    command: 'cat /tmp/cave/rune.txt'
  },
  'help-01': {
    goal: 'Open command docs with `man` or `--help`.',
    steps: [
      'Start session.',
      'Run `man ls` or `ls --help`.',
      'Exit `man` with `q` if needed.',
      'Submit for validation.'
    ],
    command: 'ls --help'
  }
};

function fallbackGuide(hints: string[] | null, description: string) {
  const list = (hints ?? []).filter(Boolean);
  const starter = list[list.length - 1] ?? list[0] ?? null;
  return {
    goal: description,
    steps: [
      'Start session.',
      starter ?? 'Try commands related to the mission text above.',
      'Submit for validation.'
    ],
    command: starter ?? undefined
  };
}

export default function ChallengeArena({
  challenge,
  dataSource,
  chapterChallenges,
  nextChallengeSlug
}: ChallengeArenaProps) {
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
  const autoAdvanceSlug = nextSlug ?? nextChallengeSlug ?? null;

  const handleSolved = () => {
    setSolved(true);
    if (autoAdvanceSlug) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        router.push(`/challenges/${autoAdvanceSlug}`);
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
  const guide = beginnerGuides[challenge.slug] ?? fallbackGuide(challenge.hints, challenge.description);

  return (
    <main className="min-h-screen">
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
            <p className="text-soft">{challenge.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-soft">
              {(challenge.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full border border-[#1e2a3a] bg-[#101722]/75 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-soft">
              <span>Difficulty: {challenge.difficulty}</span>
              <span>Par time: {challenge.time_limit_seconds}s</span>
              <span className="text-gold">XP: {challenge.xp_reward}</span>
            </div>
          </div>

          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl">Beginner Guide</h2>
            <p className="mt-2 text-sm text-soft">Goal: {guide.goal}</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-soft">
              {guide.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {guide.command && (
              <div className="panel-inset mt-4 rounded-lg p-3">
                <p className="text-xs text-soft">Try this first command:</p>
                <code className="mt-1 block text-sm text-cyan">{guide.command}</code>
              </div>
            )}
          </div>

          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl">Hints</h2>
            <p className="text-xs text-dim">Each hint costs 10% XP. Revealed: {revealedHints.length}</p>
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
          <div className="mt-2 text-sm text-gold">
            Cleared! {autoAdvanceSlug ? `Loading next challenge...` : `Chapter complete.`}
          </div>
        )}
      </div>
    </main>
  );
}
