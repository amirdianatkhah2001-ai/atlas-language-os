import { useMemo, useState } from 'react'
import { GlassCard } from '../components/GlassCard'
import { conversationScenarios } from '../data/content'
import { useAppStore } from '../stores/useAppStore'

export function ConversationPage() {
  const [scenarioId, setScenarioId] = useState(conversationScenarios[0].id)
  const [nodeId, setNodeId] = useState('choice')
  const { completeScenario } = useAppStore()

  const scenario = useMemo(
    () => conversationScenarios.find((item) => item.id === scenarioId) ?? conversationScenarios[0],
    [scenarioId],
  )

  const node = scenario.nodes.find((item) => item.id === nodeId) ?? scenario.nodes[1]

  return (
    <div className="space-y-4">
      <GlassCard title="Offline Conversation Simulator">
        <div className="mb-3 flex flex-wrap gap-2">
          {conversationScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className="rounded-full bg-white/10 px-3 py-1 text-sm"
              onClick={() => {
                setScenarioId(item.id)
                setNodeId('choice')
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="rounded-xl bg-white/5 p-4">
          <p className="text-xs text-cyan-300">{scenario.title} • {scenario.level}</p>
          <p className="my-2">{node.text}</p>
          {node.choices ? (
            <div className="flex flex-wrap gap-2">
              {node.choices.map((choice) => (
                <button
                  key={choice.label}
                  type="button"
                  className="rounded-lg bg-cyan-300 px-3 py-2 text-slate-900"
                  onClick={() => {
                    setNodeId(choice.nextId)
                    completeScenario(scenario.id, choice.xp)
                  }}
                >
                  {choice.label} (+{choice.xp} XP)
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </GlassCard>
    </div>
  )
}
