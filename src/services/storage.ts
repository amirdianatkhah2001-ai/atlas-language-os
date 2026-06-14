import { deleteDB, openDB } from 'idb'
import type { UserProgress, WordItem } from '../types'

const DB_NAME = 'atlas-language-os'
const DB_VERSION = 1

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('progress')) {
      db.createObjectStore('progress')
    }
    if (!db.objectStoreNames.contains('vocabulary')) {
      db.createObjectStore('vocabulary', { keyPath: 'id' })
    }
    if (!db.objectStoreNames.contains('quests')) {
      db.createObjectStore('quests')
    }
  },
})

export async function saveProgress(progress: UserProgress): Promise<void> {
  const db = await dbPromise
  await db.put('progress', progress, 'user')
}

export async function loadProgress(): Promise<UserProgress | null> {
  const db = await dbPromise
  return (await db.get('progress', 'user')) ?? null
}

export async function saveVocabulary(words: WordItem[]): Promise<void> {
  const db = await dbPromise
  const tx = db.transaction('vocabulary', 'readwrite')
  await tx.store.clear()
  for (const word of words) {
    await tx.store.put(word)
  }
  await tx.done
}

export async function loadVocabulary(): Promise<WordItem[]> {
  const db = await dbPromise
  return db.getAll('vocabulary')
}

export async function saveQuests(rawQuests: string): Promise<void> {
  const db = await dbPromise
  await db.put('quests', rawQuests, 'current')
}

export async function loadQuests(): Promise<string | null> {
  const db = await dbPromise
  return (await db.get('quests', 'current')) ?? null
}

export async function resetDatabase(): Promise<void> {
  await deleteDB(DB_NAME)
}
