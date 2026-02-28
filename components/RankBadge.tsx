import { rankColor, type Rank } from '../lib/xp';

export default function RankBadge({ rank }: { rank: Rank }) {
  const color = rankColor(rank);
  return (
    <div className={`px-4 py-2 rounded-full border border-gray-700 font-display text-2xl ${color}`}>
      {rank}
    </div>
  );
}
