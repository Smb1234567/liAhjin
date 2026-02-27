import Link from 'next/link';
import RankBadge from '../components/RankBadge';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827,_#030712_60%)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-start gap-8">
          <div className="system-panel rounded-xl px-5 py-3 text-xs uppercase tracking-widest text-amber-300">
            The System is Online
          </div>
          <h1 className="font-display text-6xl leading-tight">
            LinuxHunter
            <span className="block text-2xl text-gray-400">LeetCode for the terminal. Rise from E-rank to SSS.</span>
          </h1>
          <p className="max-w-2xl text-gray-300">
            Train with real Linux commands in a live browser terminal. Earn XP, unlock ranks, and dominate the
            command line through RPG-style progression.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard" className="rounded-full bg-amber-400 px-6 py-3 font-display text-xl text-gray-950">
              Enter the Dungeon
            </Link>
            <Link href="/learn" className="rounded-full border border-gray-700 px-6 py-3 text-gray-300">
              View Chapter Map
            </Link>
          </div>
          <div className="mt-8 flex gap-3">
            {(['E', 'D', 'C', 'B', 'A', 'S'] as const).map((rank) => (
              <RankBadge key={rank} rank={rank} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
