import Link from 'next/link';
import AuthPanel from '../../components/AuthPanel';
import DashboardRankExamCard from '../../components/DashboardRankExamCard';
import DashboardQuestPanels from '../../components/DashboardQuestPanels';
import DashboardProgressCard from '../../components/DashboardProgressCard';
import { localChapters } from '../../lib/localChapterData';
import { fallbackChallenges } from '../../lib/localChallengeData';
import { fetchChaptersAndChallenges } from '../../lib/dbQueries';

export default async function DashboardPage() {
  let chapters: Array<{
    id: number;
    order_index: number;
    title: string;
    rank_required: string;
  }> = [];
  let challenges: Array<{
    id: number;
    slug: string;
    chapter_id: number;
    order_index: number;
  }> = [];

  try {
    const { chapters: dbChapters, challenges: dbChallenges } = await fetchChaptersAndChallenges();
    chapters = dbChapters as any;
    challenges = dbChallenges.map((challenge) => ({
      id: challenge.id,
      slug: challenge.slug,
      chapter_id: challenge.chapter_id,
      order_index: challenge.order_index
    })) as any;
  } catch {
    chapters = localChapters;
    challenges = fallbackChallenges.map((challenge) => ({
      id: challenge.id,
      slug: challenge.slug,
      chapter_id: challenge.chapter_id,
      order_index: challenge.order_index
    }));
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl">Hunter Dashboard</h1>
            <p className="text-soft">Welcome back, your next dungeon awaits.</p>
          </div>
        </div>
        <DashboardProgressCard />

        <div className="grid gap-6 md:grid-cols-2">
          <AuthPanel />
          <DashboardRankExamCard chapters={chapters} challenges={challenges} />
          <DashboardQuestPanels />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glow-panel rounded-xl p-6">
            <h3 className="font-display text-2xl">Continue Learning</h3>
            <p className="text-sm text-soft">Chapter 1 - Awakening</p>
            <Link
              href="/learn"
              className="mt-4 inline-block rounded-full border border-[#f8b84e]/80 bg-[#f8b84e] px-5 py-2 text-[#120d05] shadow-[0_0_20px_rgba(248,184,78,0.22)] transition hover:shadow-[0_0_28px_rgba(248,184,78,0.36)]"
            >
              Resume Chapter
            </Link>
          </div>
          <div className="glow-panel rounded-xl p-6">
            <h3 className="font-display text-2xl">Today's Featured Challenge</h3>
            <p className="text-sm text-soft">Hello Terminal</p>
            <Link
              href="/challenges/echo-hello"
              className="mt-4 inline-block rounded-full border border-[#1e2a3a] bg-[#101722]/75 px-5 py-2 text-[#cfd9e8] transition hover:border-[#60e1ff]/55 hover:text-[#d6f6ff] hover:shadow-[0_0_20px_rgba(96,225,255,0.2)]"
            >
              Start Challenge
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
