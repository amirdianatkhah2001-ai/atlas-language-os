import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../stores/useAppStore'

export function AchievementsPage() {
  const { achievementsMeta } = useAppStore()

  return (
    <GlassCard title="Achievement Badges">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievementsMeta.map((achievement) => (
          <article
            key={achievement.id}
            className={`rounded-xl border p-3 ${achievement.unlocked ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/10 bg-white/5'}`}
          >
            <p className="font-semibold">{achievement.title}</p>
            <p className="text-xs text-slate-300">{achievement.description}</p>
            <p className="mt-2 text-xs">{achievement.unlocked ? 'Unlocked ✅' : 'Locked 🔒'}</p>
          </article>
        ))}
      </div>
    </GlassCard>
  )
}
