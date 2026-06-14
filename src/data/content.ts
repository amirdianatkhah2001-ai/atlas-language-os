import type {
  Achievement,
  CEFRLevel,
  ConversationScenario,
  GrammarRule,
  Quest,
  ReadingText,
  WordItem,
} from '../types'

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

const seedWords = [
  ['ability', 'توانایی'],
  ['achieve', 'به دست آوردن'],
  ['airport', 'فرودگاه'],
  ['restaurant', 'رستوران'],
  ['interview', 'مصاحبه'],
  ['doctor', 'پزشک'],
  ['conversation', 'مکالمه'],
  ['highlight', 'هایلایت'],
]

export const commonWords: WordItem[] = Array.from({ length: 5000 }, (_, i) => {
  const level = levels[Math.floor(i / 1000)] ?? 'C1'
  const seed = seedWords[i % seedWords.length]
  return {
    id: `word-${i + 1}`,
    word: i < seedWords.length ? seed[0] : `word-${i + 1}`,
    meaning: i < seedWords.length ? seed[1] : `meaning for word ${i + 1}`,
    level,
    tags: ['core', level],
    reviewIntervalDays: 1,
  }
})

export const commonSentences = Array.from({ length: 2000 }, (_, i) => ({
  id: `sentence-${i + 1}`,
  text:
    i < 6
      ? [
          'Can you help me find the airport bus?',
          'I would like to reserve a table for two.',
          'Could you explain this grammar rule again?',
          'I am practicing English every day.',
          'Where is the nearest train station?',
          'I need a doctor as soon as possible.',
        ][i]
      : `Practice sentence ${i + 1}`,
  level: levels[Math.floor(i / 400)] ?? 'C1',
}))

export const phrasalVerbs = Array.from({ length: 1000 }, (_, i) => ({
  id: `phrasal-${i + 1}`,
  verb: i < 5 ? ['look up', 'turn on', 'pick up', 'work out', 'find out'][i] : `verb-${i + 1}`,
  meaning: `Phrasal verb meaning ${i + 1}`,
}))

export const idioms = Array.from({ length: 500 }, (_, i) => ({
  id: `idiom-${i + 1}`,
  phrase:
    i < 5
      ? ['Break the ice', 'Hit the books', 'Piece of cake', 'On cloud nine', 'Spill the beans'][i]
      : `idiom-${i + 1}`,
  meaning: `Idiom meaning ${i + 1}`,
}))

export const grammarRules: GrammarRule[] = levels.flatMap((level) =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `${level}-grammar-${i + 1}`,
    level,
    title: `${level} grammar topic ${i + 1}`,
    summary: `Core ${level} grammar explanation and practical examples ${i + 1}.`,
  })),
)

export const readingTexts: ReadingText[] = levels.map((level, index) => ({
  id: `reading-${level}`,
  level,
  title: `${level} Reading Journey`,
  text: `This is a ${level} text about daily life, travel, and communication. Click any word to save it. Section ${index + 1}.`,
  questions: [
    'What is the main idea of the text?',
    'Find one useful new expression.',
    'How can you use this in a conversation?',
  ],
}))

const scenarioTemplate = (id: string, title: string, level: CEFRLevel): ConversationScenario => ({
  id,
  title,
  level,
  nodes: [
    { id: 'start', speaker: 'tutor', text: `Welcome to ${title}. How can I help you?` },
    {
      id: 'choice',
      speaker: 'learner',
      text: 'Choose your response:',
      choices: [
        { label: 'Ask politely', nextId: 'good', xp: 15 },
        { label: 'Ask directly', nextId: 'ok', xp: 10 },
      ],
    },
    { id: 'good', speaker: 'tutor', text: 'Great response! You sound natural.' },
    { id: 'ok', speaker: 'tutor', text: 'Good try. Let us improve tone and detail.' },
  ],
})

export const conversationScenarios: ConversationScenario[] = [
  scenarioTemplate('airport', 'Airport', 'A2'),
  scenarioTemplate('restaurant', 'Restaurant', 'A2'),
  scenarioTemplate('hotel', 'Hotel', 'A2'),
  scenarioTemplate('doctor', 'Doctor', 'B1'),
  scenarioTemplate('job-interview', 'Job Interview', 'B2'),
  scenarioTemplate('shopping', 'Shopping', 'A2'),
]

export const starterQuests: Quest[] = [
  { id: 'daily-1', title: 'Review 10 words', scope: 'daily', durationMinutes: 10, xp: 40, done: false },
  { id: 'daily-2', title: 'Shadow one sentence', scope: 'daily', durationMinutes: 5, xp: 30, done: false },
  {
    id: 'weekly-1',
    title: 'Complete 5 lessons',
    scope: 'weekly',
    durationMinutes: 45,
    xp: 250,
    done: false,
  },
  {
    id: 'monthly-1',
    title: 'Finish all conversation scenarios',
    scope: 'monthly',
    durationMinutes: 120,
    xp: 750,
    done: false,
  },
]

export const starterAchievements: Achievement[] = [
  { id: 'streak-7', title: '7-Day Streak', description: 'Study 7 days in a row', unlocked: false },
  { id: 'streak-30', title: '30-Day Streak', description: 'Study 30 days in a row', unlocked: false },
  { id: 'words-100', title: '100 Words Learned', description: 'Save 100 words', unlocked: false },
  {
    id: 'lessons-100',
    title: '100 Lessons Completed',
    description: 'Complete 100 lessons',
    unlocked: false,
  },
  {
    id: 'first-conversation',
    title: 'First Conversation',
    description: 'Finish one conversation scenario',
    unlocked: false,
  },
  {
    id: 'study-500h',
    title: '500 Hours',
    description: 'Study for 500 total hours',
    unlocked: false,
  },
]

export const dailyMissions = [
  'Complete one reading text',
  'Practice shadowing for 5 minutes',
  'Review 15 vocabulary cards',
  'Play one mini game',
]
