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
    <div className="relative mx-auto grid gap-6 md:grid-cols-2">
      {chapters.map((chapter, index) => (
        <div key={chapter.id} className="relative">
          <div className="absolute -left-4 top-1/2 hidden h-16 w-16 -translate-y-1/2 rounded-full border border-gray-700 md:block" />
          <Link
            href={`/learn/${chapter.slug}`}
            className={`block rounded-xl p-5 glow-panel transition ${
              chapter.locked ? 'opacity-40 pointer-events-none' : 'hover:scale-[1.02]'
            } ${chapter.current ? 'animate-pulseGlow border border-yellow-500' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl">{chapter.title}</h3>
              <span className="text-xs uppercase tracking-widest text-gray-400">{chapter.rank}</span>
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
