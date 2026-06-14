import type { PropsWithChildren } from 'react'

interface GlassCardProps {
  title?: string
  className?: string
}

export function GlassCard({ title, className = '', children }: PropsWithChildren<GlassCardProps>) {
  return (
    <section className={`rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur ${className}`}>
      {title ? <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2> : null}
      {children}
    </section>
  )
}
