import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AchievementsPage } from './pages/AchievementsPage'
import { ConversationPage } from './pages/ConversationPage'
import { DashboardPage } from './pages/DashboardPage'
import { LearningPathPage } from './pages/LearningPathPage'
import { MiniGamesPage } from './pages/MiniGamesPage'
import { QuestsPage } from './pages/QuestsPage'
import { ReadingPage } from './pages/ReadingPage'
import { SettingsPage } from './pages/SettingsPage'
import { ShadowingPage } from './pages/ShadowingPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { VocabularyPage } from './pages/VocabularyPage'
import { useAppStore } from './stores/useAppStore'

function App() {
  const hydrateFromIndexedDB = useAppStore((state) => state.hydrateFromIndexedDB)

  useEffect(() => {
    void hydrateFromIndexedDB()

    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js')
    }
  }, [hydrateFromIndexedDB])

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/path" element={<LearningPathPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/shadowing" element={<ShadowingPage />} />
        <Route path="/reading" element={<ReadingPage />} />
        <Route path="/conversation" element={<ConversationPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/games" element={<MiniGamesPage />} />
        <Route path="/quests" element={<QuestsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
