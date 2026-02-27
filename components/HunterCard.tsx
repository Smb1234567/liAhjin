import RankBadge from './RankBadge';

export default function HunterCard({
  username,
  rank,
  titles
}: {
  username: string;
  rank: any;
  titles: string[];
}) {
  return (
    <div className="glow-panel rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Hunter ID</p>
          <h2 className="font-display text-3xl">{username}</h2>
        </div>
        <RankBadge rank={rank} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {titles.map((title) => (
          <span key={title} className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
            {title}
          </span>
        ))}
      </div>
    </div>
  );
}
