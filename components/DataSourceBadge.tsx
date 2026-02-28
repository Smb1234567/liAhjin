'use client';

type DataSourceBadgeProps = {
  source: 'cloud' | 'local';
  note?: string;
};

export default function DataSourceBadge({ source, note }: DataSourceBadgeProps) {
  const isCloud = source === 'cloud';
  const label = isCloud ? 'Cloud' : 'Local Fallback';
  const className = isCloud
    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
    : 'border-amber-500/40 bg-amber-500/10 text-amber-200';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${className}`}>
      <span className="uppercase tracking-wide">{label}</span>
      {note && <span className="text-[10px] opacity-75">{note}</span>}
    </span>
  );
}
