type Quest = {
  title: string;
  description: string;
  progress: number;
  goal: number;
};

export default function QuestPanel({ title, quests }: { title: string; quests: Quest[] }) {
  return (
    <div className="glow-panel rounded-xl p-5">
      <h3 className="font-display text-2xl mb-4">{title}</h3>
      <div className="space-y-4">
        {quests.map((quest) => {
          const percent = Math.min(100, Math.floor((quest.progress / quest.goal) * 100));
          return (
            <div key={quest.title}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-200">{quest.title}</span>
                <span className="text-gray-500">{quest.progress}/{quest.goal}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">{quest.description}</p>
              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-[600ms] ease-out" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
