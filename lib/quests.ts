export type QuestType = 'daily' | 'weekly' | 'hidden';

export type Quest = {
  id: number;
  type: QuestType;
  title: string;
  description: string;
  xp_reward: number;
  condition: Record<string, unknown>;
};

export function shouldResetDaily(lastActive?: string | null) {
  if (!lastActive) return true;
  const last = new Date(lastActive);
  const now = new Date();
  return now.toDateString() !== last.toDateString();
}

export function buildDailyQuestSamples(): Quest[] {
  return [
    {
      id: 1,
      type: 'daily',
      title: 'Three Strikes',
      description: 'Complete 3 challenges today.',
      xp_reward: 120,
      condition: { challenges: 3 }
    },
    {
      id: 2,
      type: 'daily',
      title: 'No Hints',
      description: 'Solve one challenge without hints.',
      xp_reward: 80,
      condition: { noHints: true }
    }
  ];
}

export function buildWeeklyQuestSamples(): Quest[] {
  return [
    {
      id: 101,
      type: 'weekly',
      title: 'Chapter Conqueror',
      description: 'Complete an entire chapter.',
      xp_reward: 350,
      condition: { chapterComplete: true }
    },
    {
      id: 102,
      type: 'weekly',
      title: 'Permission Patrol',
      description: 'Solve 5 permissions challenges.',
      xp_reward: 220,
      condition: { tag: 'permissions', count: 5 }
    }
  ];
}
