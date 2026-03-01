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
                <span>{quest.title}</span>
                <span className="text-dim">{quest.progress}/{quest.goal}</span>
              </div>
              <p className="text-xs text-dim mb-2">{quest.description}</p>
              <div className="panel-inset h-2 overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#f8b84e] via-[#f5bc5d] to-[#d99a39] transition-[width] duration-[300ms] ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
