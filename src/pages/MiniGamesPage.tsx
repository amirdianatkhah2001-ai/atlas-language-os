import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { commonSentences, commonWords } from '../data/content'
import { useAppStore } from '../stores/useAppStore'

const gameModes = [
  'Word matching pairs',
  'Fill in the blanks',
  'Sentence builder',
  'Listening challenge',
  'Typing race challenge',
]

export function MiniGamesPage() {
  const [mode, setMode] = useState(gameModes[0])
  const [input, setInput] = useState('')
  const { addXP } = useAppStore()

  const challenge = useMemo(() => {
    if (mode === 'Fill in the blanks') {
      return 'I ____ practicing English every day.'
    }
    if (mode === 'Sentence builder') {
      return 'rearrange: every / learn / I / new / day / words'
    }
    if (mode === 'Listening challenge') {
      return commonSentences[3].text
    }
    if (mode === 'Typing race challenge') {
      return commonSentences[0].text
    }
    return `${commonWords[1].word} ↔ ${commonWords[1].meaning}`
  }, [mode])

  return (
    <GlassCard title="Mini Games">
      <div className="mb-3 flex flex-wrap gap-2">
        {gameModes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-3 py-1 text-sm ${mode === item ? 'bg-cyan-300 text-slate-900' : 'bg-white/10'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="rounded-lg bg-white/5 p-3 text-sm">{challenge}</p>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Your answer"
          className="w-full rounded border border-white/15 bg-slate-900 p-2"
        />
        <button
          type="button"
          className="rounded bg-cyan-300 px-3 py-2 text-slate-900"
          onClick={() => {
            if (input.trim().length > 0) {
              addXP(12)
              setInput('')
            }
          }}
        >
          Submit
        </button>
      </div>
    </GlassCard>
  )
}
