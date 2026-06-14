import { dailyMissions } from '../data/content'
import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../stores/useAppStore'

export function DashboardPage() {
  const { xp, level, streakDays, quests, completedLessons } = useAppStore()
  const missionsDone = Math.min(completedLessons.length, dailyMissions.length)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GlassCard title="Daily Dashboard">
        <div className="space-y-2 text-sm">
          <p>🔥 Streak: {streakDays} days</p>
          <p>XP: {xp}</p>
          <p>Level: {level}/100</p>
          <div>
            <p className="mb-1">Today progress</p>
            <div className="h-2 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-cyan-300"
                style={{ width: `${(missionsDone / dailyMissions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </GlassCard>
      <GlassCard title="Today's Mission Queue">
        <ul className="space-y-2 text-sm">
          {dailyMissions.map((mission, idx) => (
            <li key={mission} className="flex justify-between rounded-lg bg-white/5 px-3 py-2">
              <span>{mission}</span>
              <span>{idx < missionsDone ? '✅' : '⏳'}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
      <GlassCard title="Quick Stats" className="md:col-span-2">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-white/5 p-3 text-sm">Lessons: {completedLessons.length}</div>
          <div className="rounded-lg bg-white/5 p-3 text-sm">Active Quests: {quests.filter((q) => !q.done).length}</div>
          <div className="rounded-lg bg-white/5 p-3 text-sm">Completed Quests: {quests.filter((q) => q.done).length}</div>
        </div>
      </GlassCard>
    </div>
  )
}
