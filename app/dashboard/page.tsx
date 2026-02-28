import Link from 'next/link';
import AuthPanel from '../../components/AuthPanel';
import DashboardRankExamCard from '../../components/DashboardRankExamCard';
import DashboardQuestPanels from '../../components/DashboardQuestPanels';
import DashboardProgressCard from '../../components/DashboardProgressCard';
import { localChapters } from '../../lib/localChapterData';
import { fallbackChallenges } from '../../lib/localChallengeData';
import { supabaseServer } from '../../lib/supabaseServer';

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
    const supabase = supabaseServer();
    const { data: chapterData, error } = await supabase.from('chapters').select('*').order('order_index');
    if (error) throw error;
    chapters = chapterData ?? [];
    const { data: challengeData, error: challengeError } = await supabase
      .from('challenges')
      .select('id, slug, chapter_id, order_index')
      .order('order_index');
    if (challengeError) throw challengeError;
    challenges = challengeData ?? [];
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
          <DashboardRankExamCard chapters={chapters} challenges={challenges} />
          <DashboardQuestPanels />
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
