import { useRef } from 'react'
import { GlassCard } from '../components/GlassCard'
import { useAppStore } from '../stores/useAppStore'

export function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme, toggleTheme, exportBackup, importBackup, resetAllData } = useAppStore()

  return (
    <div className="space-y-4">
      <GlassCard title="Preferences">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded bg-cyan-300 px-3 py-2 text-slate-900"
            onClick={toggleTheme}
          >
            Theme: {theme} (toggle)
          </button>
          <button
            type="button"
            className="rounded bg-rose-300 px-3 py-2 text-slate-900"
            onClick={() => void resetAllData()}
          >
            Reset all data
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Backup (JSON)">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded bg-white/20 px-3 py-2"
            onClick={() => {
              const blob = new Blob([exportBackup()], { type: 'application/json' })
              const href = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = href
              link.download = 'atlas-language-os-backup.json'
              link.click()
              URL.revokeObjectURL(href)
            }}
          >
            Export backup
          </button>
          <button
            type="button"
            className="rounded bg-white/20 px-3 py-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const raw = await file.text()
              importBackup(raw)
            }}
          />
        </div>
      </GlassCard>
    </div>
  )
}
