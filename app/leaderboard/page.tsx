import RankBadge from '../../components/RankBadge';
import { supabaseServer } from '../../lib/supabaseServer';

export default async function LeaderboardPage() {
  const supabase = supabaseServer();
  const { data: users } = await supabase
    .from('users')
    .select('username,rank,xp,streak,titles')
    .order('xp', { ascending: false })
    .limit(25);

  const rows = (users ?? []).map((user, index) => ({
    position: index + 1,
    username: user.username,
    rank: user.rank,
    title: user.titles?.[0] ?? 'Rising Hunter',
    xp: user.xp,
    streak: user.streak
  }));
  return (
    <main className="min-h-screen bg-gray-950">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-4xl">Leaderboard</h1>
          <p className="text-gray-400">Top hunters ranked by total XP.</p>
        </div>
        <div className="glow-panel rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Hunter</th>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Top Title</th>
                <th className="px-4 py-3 text-left">XP</th>
                <th className="px-4 py-3 text-left">Streak</th>
              </tr>
            </thead>
            <tbody>
              {(rows.length ? rows : [{ position: 1, username: 'shadowfox', rank: 'A', title: 'Pipe Dream', xp: 8200, streak: 14 }]).map((row) => (
                <tr key={row.username} className="border-t border-gray-800">
                  <td className="px-4 py-3">{row.position}</td>
                  <td className="px-4 py-3">{row.username}</td>
                  <td className="px-4 py-3">
                    <RankBadge rank={row.rank as any} />
                  </td>
                  <td className="px-4 py-3 text-gray-300">{row.title}</td>
                  <td className="px-4 py-3 text-gray-300">{row.xp}</td>
                  <td className="px-4 py-3 text-amber-300">🔥 {row.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
