import Link from 'next/link';
import RankBadge from '../components/RankBadge';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="glow-panel rounded-3xl p-10 space-y-8">
          <div className="system-title">THE SYSTEM IS ONLINE</div>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h1 className="font-display text-6xl leading-tight">
                LinuxHunter
                <span className="block text-2xl text-soft">
                  LeetCode for the terminal. Rise from E-rank to SSS.
                </span>
              </h1>
              <p className="max-w-2xl text-soft">
                Train with real Linux commands in a live browser terminal. Earn XP, unlock ranks, and dominate the
                command line through RPG-style progression.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button className="px-6 py-3 font-display text-xl">Enter the Dungeon</Button>
                </Link>
                <Link href="/learn">
                  <Button variant="outline" className="px-6 py-3">View Chapter Map</Button>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <div className="system-title">Current Ranks</div>
              <div className="grid grid-cols-3 gap-3">
                {(['E', 'D', 'C', 'B', 'A', 'S'] as const).map((rank) => (
                  <div key={rank} className="glow-panel rounded-2xl p-4 flex items-center justify-center">
                    <RankBadge rank={rank} />
                  </div>
                ))}
              </div>
              <div className="text-xs text-soft">
                Unlock each tier by clearing every chapter in sequence.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
