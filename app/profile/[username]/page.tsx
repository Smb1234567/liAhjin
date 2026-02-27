import HunterCard from '../../../components/HunterCard';
import { supabaseServer } from '../../../lib/supabaseServer';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = supabaseServer();
  const { data: user } = await supabase.from('users').select('*').eq('username', params.username).maybeSingle();

  const stats = user?.stats ?? { STR: 6, INT: 8, AGI: 4, END: 5 };
  const max = 10;

  const points = [
    [50, 10 + (1 - stats.INT / max) * 40],
    [90 - (1 - stats.AGI / max) * 40, 50],
    [50, 90 - (1 - stats.END / max) * 40],
    [10 + (1 - stats.STR / max) * 40, 50]
  ]
    .map((p) => p.join(','))
    .join(' ');

  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <HunterCard
          username={user?.username ?? params.username}
          rank={user?.rank ?? 'B'}
          titles={user?.titles ?? ['The Awakened One', 'Pipe Dream']}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="glow-panel rounded-xl p-6">
            <h2 className="font-display text-2xl mb-4">Stats</h2>
            <svg viewBox="0 0 100 100" className="mx-auto h-48 w-48">
              <polygon points="50,10 90,50 50,90 10,50" fill="rgba(59,130,246,0.15)" stroke="#1f2937" />
              <polygon points={points} fill="rgba(245,158,11,0.35)" stroke="#f59e0b" />
              <text x="50" y="6" fontSize="6" textAnchor="middle" fill="#9ca3af">INT</text>
              <text x="95" y="52" fontSize="6" textAnchor="end" fill="#9ca3af">AGI</text>
              <text x="50" y="98" fontSize="6" textAnchor="middle" fill="#9ca3af">END</text>
              <text x="5" y="52" fontSize="6" textAnchor="start" fill="#9ca3af">STR</text>
            </svg>
          </div>
          <div className="glow-panel rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-display text-2xl">Chapter Progress</h3>
              <div className="mt-3 h-2 rounded-full bg-gray-800">
                <div className="h-full w-2/3 bg-green-500" />
              </div>
              <p className="mt-2 text-xs text-gray-400">8 / 14 chapters complete</p>
            </div>
            <div>
              <h3 className="font-display text-2xl">Recent Clears</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-400">
                <li>chmod-01 — 88s</li>
                <li>grep-03 — 62s</li>
                <li>find-02 — 95s</li>
              </ul>
            </div>
            <div className="streak-flame text-sm text-amber-300">🔥 6 day streak</div>
          </div>
        </div>
      </div>
    </main>
  );
}
