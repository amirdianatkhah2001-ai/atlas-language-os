import { motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

const links = [
  ['/', 'Dashboard'],
  ['/path', 'Learning Path'],
  ['/vocabulary', 'Vocabulary'],
  ['/shadowing', 'Shadowing'],
  ['/reading', 'Reading'],
  ['/conversation', 'Conversation'],
  ['/statistics', 'Statistics'],
  ['/achievements', 'Achievements'],
  ['/games', 'Mini Games'],
  ['/quests', 'Quests'],
  ['/settings', 'Settings'],
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { xp, level, streakDays, theme } = useAppStore()

  return (
    <div className={theme}>
      <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link to="/" className="text-lg font-bold text-cyan-300">
              Atlas Language OS
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <span>🔥 {streakDays}</span>
              <span>XP {xp}</span>
              <span>Lv {level}</span>
            </div>
          </div>
          <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 text-sm">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 whitespace-nowrap ${isActive ? 'bg-cyan-400 text-slate-950' : 'bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
