export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export interface WordItem {
  id: string
  word: string
  meaning: string
  level: CEFRLevel
  tags: string[]
  nextReviewAt?: number
  reviewIntervalDays?: number
}

export interface GrammarRule {
  id: string
  level: CEFRLevel
  title: string
  summary: string
}

export interface ReadingText {
  id: string
  level: CEFRLevel
  title: string
  text: string
  questions: string[]
}

export interface DialogueNode {
  id: string
  speaker: 'tutor' | 'learner'
  text: string
  choices?: { label: string; nextId: string; xp: number }[]
}

export interface ConversationScenario {
  id: string
  title: string
  level: CEFRLevel
  nodes: DialogueNode[]
}

export interface Quest {
  id: string
  title: string
  scope: 'daily' | 'weekly' | 'monthly'
  durationMinutes: number
  xp: number
  done: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlocked: boolean
}

export interface UserProgress {
  xp: number
  level: number
  streakDays: number
  studyMinutes: number
  learnedWordIds: string[]
  completedLessons: string[]
  achievements: string[]
  scenarioProgress: Record<string, number>
}
