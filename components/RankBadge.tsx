import { type Rank } from '../lib/xp';

export default function RankBadge({ rank }: { rank: Rank }) {
  const rankClass: Record<Rank, string> = {
    E: 'rank-e',
    D: 'rank-d',
    C: 'rank-c',
    B: 'rank-b',
    A: 'rank-a',
    S: 'rank-s',
    SS: 'rank-ss',
    SSS: 'rank-sss'
  };

  return (
    <div className={`rank-emblem ${rankClass[rank]}`}>
      {rank}
    </div>
  );
}
