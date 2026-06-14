import { useMemo, useRef, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { commonSentences } from '../data/content'
import { useAppStore } from '../stores/useAppStore'

export function ShadowingPage() {
  const [index, setIndex] = useState(0)
  const [rate, setRate] = useState(1)
  const [loops, setLoops] = useState(1)
  const [repeatCount, setRepeatCount] = useState(0)
  const { addStudyMinutes, addXP } = useAppStore()
  const playing = useRef(false)

  const sentence = useMemo(() => commonSentences[index]?.text ?? 'Practice sentence', [index])

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    playing.current = true

    const audioContext = new AudioContext()
    const oscillator = audioContext.createOscillator()
    oscillator.connect(audioContext.destination)
    oscillator.frequency.value = 520
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.05)

    let done = 0

    const loopSpeak = () => {
      if (!playing.current) return
      const utterance = new SpeechSynthesisUtterance(sentence)
      utterance.rate = rate
      utterance.onend = () => {
        done += 1
        setRepeatCount(done)
        if (done < loops) {
          loopSpeak()
        } else {
          addStudyMinutes(1)
          addXP(6)
        }
      }
      window.speechSynthesis.speak(utterance)
    }

    setRepeatCount(0)
    loopSpeak()
  }

  return (
    <div className="space-y-4">
      <GlassCard title="Shadowing Studio">
        <p className="mb-3 rounded-lg bg-white/5 p-3 text-lg">{sentence}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            Speed
            <select
              className="mt-1 w-full rounded border border-white/15 bg-slate-900 p-2"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
            </select>
          </label>
          <label className="text-sm">
            Loop count
            <input
              className="mt-1 w-full rounded border border-white/15 bg-slate-900 p-2"
              type="number"
              min={1}
              max={10}
              value={loops}
              onChange={(event) => setLoops(Math.max(1, Number(event.target.value)))}
            />
          </label>
          <label className="text-sm">
            Sentence
            <input
              className="mt-1 w-full rounded border border-white/15 bg-slate-900 p-2"
              type="number"
              min={1}
              max={commonSentences.length}
              value={index + 1}
              onChange={(event) => setIndex(Math.max(0, Number(event.target.value) - 1))}
            />
          </label>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" className="rounded bg-cyan-300 px-3 py-2 text-slate-900" onClick={speak}>
            Play
          </button>
          <button
            type="button"
            className="rounded bg-white/20 px-3 py-2"
            onClick={() => {
              playing.current = false
              window.speechSynthesis.cancel()
            }}
          >
            Pause/Stop
          </button>
          <span className="self-center text-sm">Repeats: {repeatCount}/{loops}</span>
        </div>
      </GlassCard>
    </div>
  )
}
