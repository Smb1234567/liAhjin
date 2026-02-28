'use client';

import { useMemo } from 'react';
import QuestPanel from './QuestPanel';
import { buildDailyQuestSamples, buildWeeklyQuestSamples } from '../lib/quests';
import { getLocalProgress } from '../lib/localProgress';

export default function DashboardQuestPanels() {
  const progress = useMemo(() => getLocalProgress(), []);
  const daily = buildDailyQuestSamples();
  const weekly = buildWeeklyQuestSamples();

  const dailyQuests = daily.map((quest) => {
    if (quest.id === 1) {
      return { ...quest, progress: progress.dailyChallengeCount, goal: 3 };
    }
    if (quest.id === 2) {
      return { ...quest, progress: progress.dailyNoHintCount, goal: 1 };
    }
    return { ...quest, progress: 0, goal: 1 };
  });

  const weeklyQuests = weekly.map((quest) => {
    if (quest.id === 101) {
      return { ...quest, progress: progress.weeklyChapterCompleteCount, goal: 1 };
    }
    if (quest.id === 102) {
      return { ...quest, progress: progress.weeklyPermissionCount, goal: 5 };
    }
    return { ...quest, progress: 0, goal: 1 };
  });

  return (
    <>
      <QuestPanel title="Daily Quests" quests={dailyQuests} />
      <QuestPanel title="Weekly Quests" quests={weeklyQuests} />
    </>
  );
}
