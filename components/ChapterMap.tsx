'use client';

import Link from 'next/link';

export type ChapterNode = {
  id: number;
  slug: string;
  title: string;
  rank: string;
  locked: boolean;
  completed: boolean;
  current: boolean;
};

export default function ChapterMap({ chapters }: { chapters: ChapterNode[] }) {
  return (
    <div className="relative mx-auto max-w-4xl space-y-6">
      <div className="absolute left-4 top-2 h-full w-px bg-gradient-to-b from-amber-400/40 via-gray-700/40 to-transparent" />
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="relative pl-12">
          <div
            className={`absolute left-0 top-6 h-8 w-8 rounded-full border text-xs font-semibold flex items-center justify-center ${
              chapter.completed
                ? 'border-emerald-400/70 bg-emerald-500/10 text-emerald-200'
                : chapter.locked
                  ? 'border-gray-700 bg-gray-900 text-gray-500'
                  : 'border-amber-400/70 bg-amber-500/10 text-amber-200'
            }`}
          >
            {index + 1}
          </div>
          <Link
            href={`/learn/${chapter.slug}`}
            className={`chapter-node block rounded-2xl p-5 glow-panel ${
              chapter.locked ? 'opacity-40 pointer-events-none' : 'chapter-node--unlocked'
            } ${chapter.current ? 'chapter-node--current border border-yellow-500' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">{chapter.title}</h3>
              <span className="text-xs uppercase tracking-widest text-gray-400">Rank {chapter.rank}</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-gray-300">
              {chapter.completed ? (
                <span className="text-green-400">Completed</span>
              ) : chapter.locked ? (
                <span className="text-gray-500">Locked</span>
              ) : (
                <span className="text-yellow-400">In Progress</span>
              )}
              <span className="text-gray-500">Chapter {index + 1}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
