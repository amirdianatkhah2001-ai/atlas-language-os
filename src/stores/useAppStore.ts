import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  commonWords,
  conversationScenarios,
  starterAchievements,
  starterQuests,
} from '../data/content'
import { scheduleNextReview } from '../services/spacedRepetition'
import {
  loadProgress,
  loadQuests,
  loadVocabulary,
  resetDatabase,
  saveProgress,
  saveQuests,
  saveVocabulary,
} from '../services/storage'
import type { Achievement, Quest, UserProgress, WordItem } from '../types'

interface AppState extends UserProgress {
  theme: 'dark' | 'light'
  vocabulary: WordItem[]
  quests: Quest[]
  achievementsMeta: Achievement[]
  inSessionMinutes: number
  leaderboard: { name: string; xp: number }[]
  activeCEFR: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
  addXP: (amount: number) => void
  completeLesson: (lessonId: string) => void
  addVocabularyWord: (word: WordItem) => void
  reviewVocabularyWord: (wordId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => void
  completeScenario: (scenarioId: string, xp: number) => void
  completeQuest: (questId: string) => void
  addStudyMinutes: (minutes: number) => void
  setActiveCEFR: (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1') => void
  toggleTheme: () => void
  hydrateFromIndexedDB: () => Promise<void>
  exportBackup: () => string
  importBackup: (raw: string) => void
  resetAllData: () => Promise<void>
}

const initialProgress: UserProgress = {
  xp: 0,
  level: 1,
  streakDays: 1,
  studyMinutes: 0,
  learnedWordIds: [],
  completedLessons: [],
  achievements: [],
  scenarioProgress: {},
}

const persistProgress = (state: AppState): void => {
  void saveProgress({
    xp: state.xp,
    level: state.level,
    streakDays: state.streakDays,
    studyMinutes: state.studyMinutes,
    learnedWordIds: state.learnedWordIds,
    completedLessons: state.completedLessons,
    achievements: state.achievements,
    scenarioProgress: state.scenarioProgress,
  })
  void saveVocabulary(state.vocabulary)
  void saveQuests(JSON.stringify(state.quests))
}

const recalculateAchievements = (state: AppState): Achievement[] => {
  const unlocked = new Set<string>(state.achievements)

  if (state.streakDays >= 7) unlocked.add('streak-7')
  if (state.streakDays >= 30) unlocked.add('streak-30')
  if (state.learnedWordIds.length >= 100) unlocked.add('words-100')
  if (state.completedLessons.length >= 100) unlocked.add('lessons-100')
  if (Object.values(state.scenarioProgress).some((count) => count > 0)) unlocked.add('first-conversation')
  if (state.studyMinutes >= 500 * 60) unlocked.add('study-500h')

  return starterAchievements.map((item) => ({ ...item, unlocked: unlocked.has(item.id) }))
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialProgress,
      theme: 'dark',
      vocabulary: commonWords.slice(0, 12),
      quests: starterQuests,
      achievementsMeta: starterAchievements,
      inSessionMinutes: 0,
      leaderboard: [
        { name: 'You', xp: 0 },
        { name: 'Ava', xp: 1240 },
        { name: 'Noah', xp: 980 },
      ],
      activeCEFR: 'A2',
      addXP: (amount) => {
        set((state) => {
          const xp = state.xp + amount
          const level = Math.min(100, Math.max(1, Math.floor(xp / 100) + 1))
          const updated = { ...state, xp, level }
          const achievementsMeta = recalculateAchievements(updated)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          const nextState = { ...updated, achievementsMeta, achievements }
          persistProgress(nextState)
          return nextState
        })
      },
      completeLesson: (lessonId) => {
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state
          const updated = {
            ...state,
            completedLessons: [...state.completedLessons, lessonId],
            streakDays: state.streakDays + 1,
            studyMinutes: state.studyMinutes + 10,
          }
          const achievementsMeta = recalculateAchievements(updated)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          const nextState = {
            ...updated,
            xp: updated.xp + 35,
            level: Math.min(100, Math.floor((updated.xp + 35) / 100) + 1),
            achievementsMeta,
            achievements,
          }
          persistProgress(nextState)
          return nextState
        })
      },
      addVocabularyWord: (word) => {
        set((state) => {
          if (state.vocabulary.some((item) => item.id === word.id)) return state
          const nextState = {
            ...state,
            vocabulary: [word, ...state.vocabulary],
            learnedWordIds: [...state.learnedWordIds, word.id],
            xp: state.xp + 5,
            level: Math.min(100, Math.floor((state.xp + 5) / 100) + 1),
          }
          const achievementsMeta = recalculateAchievements(nextState)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          const merged = { ...nextState, achievementsMeta, achievements }
          persistProgress(merged)
          return merged
        })
      },
      reviewVocabularyWord: (wordId, quality) => {
        set((state) => {
          const vocabulary = state.vocabulary.map((item) => {
            if (item.id !== wordId) return item
            const review = scheduleNextReview(quality, {
              intervalDays: item.reviewIntervalDays ?? 1,
              easeFactor: 2.5,
              repetitions: Math.max(0, Math.round((item.reviewIntervalDays ?? 1) / 2)),
            })
            return {
              ...item,
              reviewIntervalDays: review.intervalDays,
              nextReviewAt: Date.now() + review.intervalDays * 24 * 60 * 60 * 1000,
            }
          })
          const nextState = { ...state, vocabulary, xp: state.xp + 3 }
          persistProgress(nextState)
          return nextState
        })
      },
      completeScenario: (scenarioId, xp) => {
        set((state) => {
          const scenarioProgress = {
            ...state.scenarioProgress,
            [scenarioId]: (state.scenarioProgress[scenarioId] ?? 0) + 1,
          }
          const nextState = {
            ...state,
            scenarioProgress,
            xp: state.xp + xp,
            level: Math.min(100, Math.floor((state.xp + xp) / 100) + 1),
          }
          const achievementsMeta = recalculateAchievements(nextState)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          const merged = { ...nextState, achievementsMeta, achievements }
          persistProgress(merged)
          return merged
        })
      },
      completeQuest: (questId) => {
        set((state) => {
          const quest = state.quests.find((item) => item.id === questId)
          if (!quest || quest.done) return state
          const quests = state.quests.map((item) =>
            item.id === questId ? { ...item, done: true } : item,
          )
          const nextXP = state.xp + quest.xp
          const nextState = {
            ...state,
            quests,
            xp: nextXP,
            level: Math.min(100, Math.floor(nextXP / 100) + 1),
          }
          persistProgress(nextState)
          return nextState
        })
      },
      addStudyMinutes: (minutes) => {
        set((state) => {
          const nextState = {
            ...state,
            studyMinutes: state.studyMinutes + minutes,
            inSessionMinutes: state.inSessionMinutes + minutes,
          }
          const achievementsMeta = recalculateAchievements(nextState)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          const merged = { ...nextState, achievementsMeta, achievements }
          persistProgress(merged)
          return merged
        })
      },
      setActiveCEFR: (level) => set({ activeCEFR: level }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      hydrateFromIndexedDB: async () => {
        const [savedProgress, savedVocabulary, savedQuests] = await Promise.all([
          loadProgress(),
          loadVocabulary(),
          loadQuests(),
        ])

        set((state) => {
          const fromStorage = savedProgress ? { ...state, ...savedProgress } : state
          const vocabulary = savedVocabulary.length > 0 ? savedVocabulary : fromStorage.vocabulary
          const quests = savedQuests ? (JSON.parse(savedQuests) as Quest[]) : fromStorage.quests
          const merged = { ...fromStorage, vocabulary, quests }
          const achievementsMeta = recalculateAchievements(merged)
          const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
          return { ...merged, achievementsMeta, achievements }
        })
      },
      exportBackup: () => {
        const state = get()
        return JSON.stringify(
          {
            progress: {
              xp: state.xp,
              level: state.level,
              streakDays: state.streakDays,
              studyMinutes: state.studyMinutes,
              learnedWordIds: state.learnedWordIds,
              completedLessons: state.completedLessons,
              achievements: state.achievements,
              scenarioProgress: state.scenarioProgress,
            },
            vocabulary: state.vocabulary,
            quests: state.quests,
          },
          null,
          2,
        )
      },
      importBackup: (raw) => {
        try {
          const parsed = JSON.parse(raw) as {
            progress: UserProgress
            vocabulary: WordItem[]
            quests: Quest[]
          }
          set((state) => {
            const merged = {
              ...state,
              ...parsed.progress,
              vocabulary: parsed.vocabulary,
              quests: parsed.quests,
            }
            const achievementsMeta = recalculateAchievements(merged)
            const achievements = achievementsMeta.filter((a) => a.unlocked).map((a) => a.id)
            const nextState = { ...merged, achievementsMeta, achievements }
            persistProgress(nextState)
            return nextState
          })
        } catch {
          return
        }
      },
      resetAllData: async () => {
        await resetDatabase()
        set({
          ...initialProgress,
          theme: 'dark',
          vocabulary: commonWords.slice(0, 12),
          quests: starterQuests,
          achievementsMeta: starterAchievements,
          inSessionMinutes: 0,
          leaderboard: [
            { name: 'You', xp: 0 },
            { name: 'Ava', xp: 1240 },
            { name: 'Noah', xp: 980 },
          ],
          activeCEFR: 'A2',
        })
      },
    }),
    {
      name: 'atlas-language-os-local',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        streakDays: state.streakDays,
        studyMinutes: state.studyMinutes,
        learnedWordIds: state.learnedWordIds,
        completedLessons: state.completedLessons,
        achievements: state.achievements,
        scenarioProgress: state.scenarioProgress,
        theme: state.theme,
        activeCEFR: state.activeCEFR,
      }),
    },
  ),
)

export const scenarioCount = conversationScenarios.length
