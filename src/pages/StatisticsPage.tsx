import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../stores/useAppStore'

const weeklyData = [
  { day: 'Mon', minutes: 20, xp: 60 },
  { day: 'Tue', minutes: 35, xp: 90 },
  { day: 'Wed', minutes: 25, xp: 70 },
  { day: 'Thu', minutes: 40, xp: 110 },
  { day: 'Fri', minutes: 30, xp: 85 },
  { day: 'Sat', minutes: 50, xp: 140 },
  { day: 'Sun', minutes: 45, xp: 130 },
]

export function StatisticsPage() {
  const { studyMinutes, xp, level, leaderboard } = useAppStore()

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard title="Daily / Weekly Progress Charts">
        <div className="h-56">
          <ResponsiveContainer>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#67e8f9" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="XP / Level Graph">
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="xp" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Heatmap + Completion" className="lg:col-span-2">
        <p className="mb-2 text-sm">GitHub-style activity heatmap (last 30 days)</p>
        <div className="grid grid-cols-10 gap-1 sm:grid-cols-15">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`heat-${i + 1}`}
              className="aspect-square rounded"
              style={{ background: `rgba(34, 211, 238, ${((i % 5) + 1) / 6})` }}
            />
          ))}
        </div>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded bg-white/5 p-2">Study time: {studyMinutes} min</div>
          <div className="rounded bg-white/5 p-2">XP total: {xp}</div>
          <div className="rounded bg-white/5 p-2">Current level: {level}</div>
        </div>
      </GlassCard>

      <GlassCard title="Local Leaderboard" className="lg:col-span-2">
        <ul className="space-y-2 text-sm">
          {leaderboard
            .slice()
            .sort((a, b) => b.xp - a.xp)
            .map((item, index) => (
              <li key={item.name} className="flex justify-between rounded bg-white/5 p-2">
                <span>
                  #{index + 1} {item.name}
                </span>
                <span>{item.xp} XP</span>
              </li>
            ))}
        </ul>
      </GlassCard>
    </div>
  )
}
