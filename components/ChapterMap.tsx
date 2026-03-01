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
      <div className="timeline-connector absolute left-4 top-2 h-full w-px" />
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="relative pl-12">
          <div
            className={`chapter-index absolute left-0 top-6 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              chapter.completed
                ? 'chapter-index--completed'
                : chapter.locked
                  ? 'chapter-index--locked'
                  : 'chapter-index--current'
            }`}
          >
            {index + 1}
          </div>
          <Link
            href={`/learn/${chapter.slug}`}
            className={`chapter-node block rounded-2xl p-5 glow-panel ${
              chapter.locked ? 'chapter-node--locked pointer-events-none' : 'chapter-node--unlocked'
            } ${chapter.current ? 'chapter-node--current' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">{chapter.title}</h3>
              <span className="text-xs uppercase tracking-widest text-soft">Rank {chapter.rank}</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-soft">
              {chapter.completed ? (
                <span className="text-gold">Completed</span>
              ) : chapter.locked ? (
                <span className="text-dim">Locked</span>
              ) : (
                <span className="text-gold">In Progress</span>
              )}
              <span className="text-dim">Chapter {index + 1}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
