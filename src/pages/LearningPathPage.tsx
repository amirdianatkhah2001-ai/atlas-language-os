import { GlassCard } from '../components/GlassCard'
import { grammarRules } from '../data/content'
import { useAppStore } from '../stores/useAppStore'
import type { CEFRLevel } from '../types'

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export function LearningPathPage() {
  const { activeCEFR, setActiveCEFR, completeLesson, completedLessons } = useAppStore()

  return (
    <div className="space-y-4">
      <GlassCard title="CEFR Learning Tree">
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setActiveCEFR(level)}
              className={`rounded-full px-3 py-1 text-sm ${activeCEFR === level ? 'bg-cyan-300 text-slate-900' : 'bg-white/10'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard title={`${activeCEFR} Unlockable Lessons`}>
        <div className="grid gap-2 md:grid-cols-2">
          {grammarRules
            .filter((rule) => rule.level === activeCEFR)
            .map((rule) => {
              const unlocked = completedLessons.includes(rule.id)
              return (
                <button
                  key={rule.id}
                  type="button"
                  onClick={() => completeLesson(rule.id)}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-left"
                >
                  <p className="font-semibold">{rule.title}</p>
                  <p className="text-xs text-slate-300">{rule.summary}</p>
                  <p className="mt-1 text-xs">{unlocked ? 'Completed ✅' : 'Tap to complete +35 XP'}</p>
                </button>
              )
            })}
        </div>
      </GlassCard>
    </div>
  )
}
