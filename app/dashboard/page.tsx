import QuestPanel from '../../components/QuestPanel';
import Link from 'next/link';
import AuthPanel from '../../components/AuthPanel';
import RankExamPanel from '../../components/RankExamPanel';
import { examCooldownRemaining, isRankExamUnlocked } from '../../lib/rankExams';
import DashboardProgressCard from '../../components/DashboardProgressCard';

export default function DashboardPage() {
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
        </div>
        <DashboardProgressCard />

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
            <p className="text-sm text-gray-400">Chapter 1 — Awakening</p>
            <Link href="/learn" className="mt-4 inline-block rounded-full bg-amber-400 px-5 py-2 text-gray-950">
              Resume Chapter
            </Link>
          </div>
          <div className="glow-panel rounded-xl p-6">
            <h3 className="font-display text-2xl">Today's Featured Challenge</h3>
            <p className="text-sm text-gray-400">Hello Terminal</p>
            <Link
              href="/challenges/echo-hello"
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
