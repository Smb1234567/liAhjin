export default function XPBar({ current, next }: { current: number; next: number }) {
  const percent = Math.min(100, Math.max(10, Math.floor((current / next) * 100)));
  return (
    <div className="relative h-3 overflow-hidden rounded-full panel-inset">
      <div
        className="h-full bg-gradient-to-r from-[#f8b84e] via-[#f7c063] to-[#d99a39] shadow-[0_0_20px_rgba(248,184,78,0.35)] transition-[width] duration-[300ms] ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
