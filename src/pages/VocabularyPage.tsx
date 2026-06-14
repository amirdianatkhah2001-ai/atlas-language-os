import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { commonWords } from '../data/content'
import { useAppStore } from '../stores/useAppStore'

export function VocabularyPage() {
  const { vocabulary, addVocabularyWord, reviewVocabularyWord } = useAppStore()
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () =>
      vocabulary.filter(
        (word) =>
          word.word.toLowerCase().includes(query.toLowerCase()) ||
          word.tags.join(' ').toLowerCase().includes(query.toLowerCase()),
      ),
    [query, vocabulary],
  )

  return (
    <div className="space-y-4">
      <GlassCard title="Vocabulary Database">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            aria-label="Search words"
            className="w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2"
            placeholder="Search by word or tag"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button
            type="button"
            className="rounded-lg bg-cyan-300 px-3 py-2 text-slate-900"
            onClick={() => addVocabularyWord(commonWords[Math.floor(Math.random() * commonWords.length)])}
          >
            Add Random Word
          </button>
        </div>
      </GlassCard>

      <GlassCard title="Flashcards + Spaced Repetition">
        <div className="grid gap-2 md:grid-cols-2">
          {filtered.slice(0, 20).map((word) => (
            <div key={word.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="font-semibold">{word.word}</p>
              <p className="text-sm text-slate-300">{word.meaning}</p>
              <p className="text-xs text-cyan-300">Tags: {word.tags.join(', ')}</p>
              <p className="text-xs">Next review: {word.nextReviewAt ? new Date(word.nextReviewAt).toLocaleString() : 'Today'}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className="rounded bg-emerald-300 px-2 py-1 text-xs text-slate-900"
                  onClick={() => reviewVocabularyWord(word.id, 5)}
                >
                  Easy
                </button>
                <button
                  type="button"
                  className="rounded bg-amber-300 px-2 py-1 text-xs text-slate-900"
                  onClick={() => reviewVocabularyWord(word.id, 3)}
                >
                  Hard
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
