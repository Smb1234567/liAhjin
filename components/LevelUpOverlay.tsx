'use client';

export default function LevelUpOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="text-center animate-levelUp">
        <p className="font-display text-4xl text-amber-300">LEVEL UP — The System acknowledges your growth.</p>
      </div>
    </div>
  );
}
