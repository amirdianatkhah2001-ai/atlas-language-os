import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../stores/useAppStore'

const scopeLabel: Record<string, string> = {
  daily: '5-10 min',
  weekly: '30-60 min',
  monthly: 'Long challenge',
}

export function QuestsPage() {
  const { quests, completeQuest } = useAppStore()

  return (
    <GlassCard title="Quest System">
      <ul className="space-y-2">
        {quests.map((quest) => (
          <li key={quest.id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{quest.title}</p>
                <p className="text-xs text-slate-300">{quest.scope} • {scopeLabel[quest.scope]} • {quest.durationMinutes} min</p>
              </div>
              <button
                type="button"
                onClick={() => completeQuest(quest.id)}
                disabled={quest.done}
                className="rounded bg-cyan-300 px-2 py-1 text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {quest.done ? 'Done' : `Claim +${quest.xp} XP`}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  )
}
