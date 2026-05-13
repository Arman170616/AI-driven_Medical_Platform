'use client'

import { cn } from '@/lib/utils'

interface AudioVisualizerProps {
  audioData: number[]
  isRecording: boolean
  isPaused: boolean
}

export function AudioVisualizer({ audioData, isRecording, isPaused }: AudioVisualizerProps) {
  const bars = audioData.length > 0 ? audioData : Array(48).fill(0.05)

  return (
    <div className="flex items-center justify-center gap-[3px] h-28">
      {bars.map((value, index) => (
        <div
          key={index}
          className={cn(
            'w-1.5 rounded-full transition-all duration-100',
            isRecording && !isPaused
              ? 'bg-primary'
              : isPaused
                ? 'bg-warning/60'
                : 'bg-muted-foreground/20'
          )}
          style={{
            height: `${Math.max(6, value * 112)}px`,
            opacity: isRecording && !isPaused ? 0.6 + value * 0.4 : 0.4,
          }}
        />
      ))}
    </div>
  )
}
