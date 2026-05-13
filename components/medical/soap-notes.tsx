'use client'

import { cn } from '@/lib/utils'
import type { SOAPNote } from '@/types/medical'

interface SOAPNotesDisplayProps {
  soapNotes: SOAPNote
  className?: string
}

const sections = [
  { key: 'subjective', label: 'Subjective', color: 'bg-blue-500/20 border-blue-500/40 text-blue-700' },
  { key: 'objective', label: 'Objective', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700' },
  { key: 'assessment', label: 'Assessment', color: 'bg-amber-500/20 border-amber-500/40 text-amber-700' },
  { key: 'plan', label: 'Plan', color: 'bg-purple-500/20 border-purple-500/40 text-purple-700' },
] as const

export function SOAPNotesDisplay({ soapNotes, className }: SOAPNotesDisplayProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {sections.map((section) => (
        <div key={section.key} className="rounded-xl bg-white/10 border border-white/20 overflow-hidden">
          <div className={cn('px-4 py-2 border-b', section.color)}>
            <span className="font-semibold text-sm">{section.label}</span>
          </div>
          <div className="p-4">
            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {soapNotes[section.key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
