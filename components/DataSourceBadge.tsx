'use client';

type DataSourceBadgeProps = {
  source: 'cloud' | 'local';
  note?: string;
};

export default function DataSourceBadge({ source, note }: DataSourceBadgeProps) {
  const isCloud = source === 'cloud';
  const label = isCloud ? 'Cloud' : 'Local Fallback';
  const className = isCloud
    ? 'border-[#60e1ff]/45 bg-[#60e1ff]/10 text-[#a7f0ff]'
    : 'border-[#f8b84e]/45 bg-[#f8b84e]/10 text-[#ffd792]';

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${className}`}>
      <span className="uppercase tracking-wide">{label}</span>
      {note && <span className="text-[10px] opacity-75">{note}</span>}
    </span>
  );
}
