'use client';

import { useEffect, useState } from 'react';
import ChapterMap, { type ChapterNode } from './ChapterMap';
import { getLocalProgress } from '../lib/localProgress';
import { buildChapterNodes, type ChapterInput, type ChallengeInput } from '../lib/unlockRules';

export default function LearnMapClient({
  chapters,
  challenges
}: {
  chapters: ChapterInput[];
  challenges: ChallengeInput[];
}) {
  const [nodes, setNodes] = useState<ChapterNode[]>([]);

  useEffect(() => {
    const update = () => {
      const progress = getLocalProgress();
      const { nodes: nextNodes } = buildChapterNodes(chapters, challenges, progress.completedChallenges);
      setNodes(nextNodes);
    };
    update();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'linuxhunter_progress_v1') update();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('linuxhunter-progress', update as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('linuxhunter-progress', update as EventListener);
    };
  }, [chapters, challenges]);

  if (nodes.length === 0) {
    return <div className="text-sm text-gray-500">No chapters available.</div>;
  }

  return <ChapterMap chapters={nodes} />;
}
