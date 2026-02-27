export default function XPBar({ current, next }: { current: number; next: number }) {
  const percent = Math.min(100, Math.max(10, Math.floor((current / next) * 100)));
  return (
    <div className="relative h-3 rounded-full bg-gray-800 overflow-hidden xp-bar">
      <div
        className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
