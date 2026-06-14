import { useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { readingTexts } from '../data/content'
import { useAppStore } from '../stores/useAppStore'

const defaultText = readingTexts[0] ?? {
  id: 'reading-fallback',
  level: 'A1',
  title: 'Fallback Reading',
  text: 'Fallback offline reading text.',
  questions: ['What did you understand?'],
}

export function ReadingPage() {
  const [selected, setSelected] = useState(readingTexts[1] ?? defaultText)
  const [selectedWord, setSelectedWord] = useState('')
  const { addVocabularyWord } = useAppStore()

  const words = selected.text.split(' ')

  return (
    <div className="space-y-4">
      <GlassCard title="Level-based Reading Mode">
        <div className="mb-3 flex gap-2">
          {readingTexts.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-full bg-white/10 px-3 py-1 text-sm"
              onClick={() => setSelected(item)}
            >
              {item.level}
            </button>
          ))}
        </div>

        <article className="space-y-3 rounded-xl bg-white/5 p-4 leading-7">
          <h3 className="text-lg font-semibold">{selected.title}</h3>
          <p>
            {words.map((word, index) => (
              <button
                key={`${selected.id}-${word}-${index}`}
                type="button"
                onClick={() => setSelectedWord(word.replace(/[^a-zA-Z-]/g, '').toLowerCase())}
                className="rounded px-1 hover:bg-cyan-300/20"
              >
                {word}{' '}
              </button>
            ))}
          </p>
        </article>

        {selectedWord ? (
          <div className="mt-3 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm">
            <p>Selected word: {selectedWord}</p>
            <button
              type="button"
              className="mt-2 rounded bg-cyan-300 px-2 py-1 text-slate-900"
              onClick={() =>
                addVocabularyWord({
                  id: `custom-${selectedWord}`,
                  word: selectedWord,
                  meaning: `Offline definition for ${selectedWord}`,
                  level: selected.level,
                  tags: ['reading', selected.level],
                  reviewIntervalDays: 1,
                })
              }
            >
              Save to Vocabulary
            </button>
          </div>
        ) : null}
      </GlassCard>

      <GlassCard title="Comprehension Questions">
        <ul className="list-inside list-disc space-y-2 text-sm">
          {selected.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </GlassCard>
    </div>
  )
}
