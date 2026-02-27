import XPBar from '../../components/XPBar';
import RankBadge from '../../components/RankBadge';
import QuestPanel from '../../components/QuestPanel';
import Link from 'next/link';
import AuthPanel from '../../components/AuthPanel';
import { supabaseServer } from '../../lib/supabaseServer';
import RankExamPanel from '../../components/RankExamPanel';
import { examCooldownRemaining, isRankExamUnlocked } from '../../lib/rankExams';

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data: featuredChallenge } = await supabase
    .from('challenges')
    .select('slug,title')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();
  const { data: chapter } = await supabase
    .from('chapters')
    .select('title')
    .order('order_index', { ascending: true })
    .limit(1)
    .maybeSingle();

  const completedChapterIds = [1, 2];
  const currentRank = 'D' as const;
  const examUnlocked = isRankExamUnlocked(currentRank, completedChapterIds);
  const cooldownMs = examCooldownRemaining(null);

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl">Hunter Dashboard</h1>
            <p className="text-gray-400">Welcome back, your next dungeon awaits.</p>
          </div>
          <RankBadge rank="C" />
        </div>

        <div className="glow-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Level 12</h2>
            <span className="text-sm text-gray-400">XP 420 / 680</span>
          </div>
          <XPBar current={420} next={680} />
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="streak-flame">🔥 6 day streak</span>
            <span className="text-amber-300">System message: Keep your momentum.</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AuthPanel />
          <RankExamPanel currentRank={currentRank} unlocked={examUnlocked} cooldownMs={cooldownMs} />
          <QuestPanel
            title="Daily Quests"
            quests={[
              { title: 'Three Strikes', description: 'Complete 3 challenges today.', progress: 1, goal: 3 },
              { title: 'No Hints', description: 'Solve one challenge without hints.', progress: 0, goal: 1 }
            ]}
          />
          <QuestPanel
            title="Weekly Quests"
            quests={[
              { title: 'Chapter Conqueror', description: 'Complete an entire chapter.', progress: 2, goal: 6 },
              { title: 'Permission Patrol', description: 'Solve 5 permission challenges.', progress: 3, goal: 5 }
            ]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glow-panel rounded-xl p-6">
            <h3 className="font-display text-2xl">Continue Learning</h3>
            <p className="text-sm text-gray-400">{chapter?.title ?? 'Chapter 1 — Awakening'}</p>
            <Link href="/learn" className="mt-4 inline-block rounded-full bg-amber-400 px-5 py-2 text-gray-950">
              Resume Chapter
            </Link>
          </div>
          <div className="glow-panel rounded-xl p-6">
            <h3 className="font-display text-2xl">Today's Featured Challenge</h3>
            <p className="text-sm text-gray-400">{featuredChallenge?.title ?? 'Lock it down'}</p>
            <Link
              href={`/challenges/${featuredChallenge?.slug ?? 'chmod-01'}`}
              className="mt-4 inline-block rounded-full border border-gray-700 px-5 py-2 text-gray-200"
            >
              Start Challenge
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
