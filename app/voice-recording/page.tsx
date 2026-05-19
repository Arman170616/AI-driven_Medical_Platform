'use client'

import { useState, useCallback } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AudioVisualizer } from '@/components/voice/audio-visualizer'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { transcribeAudio } from '@/lib/api-client'
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  FileText,
  Copy,
  Check,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoPatients } from '@/lib/demo-data'
import type { Patient } from '@/types/medical'

export default function VoiceRecordingPage() {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioData,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder()

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useDemoTranscription, setUseDemoTranscription] = useState(false)

  const demoTranscription = `Patient presents with chief complaint of fatigue and intermittent chest discomfort over the past two weeks. Reports the discomfort occurs primarily with exertion and resolves with rest. Denies shortness of breath at rest, orthopnea, or lower extremity edema. 

Current medications include metformin 500mg twice daily for diabetes and lisinopril 10mg daily for hypertension. Patient reports good medication compliance.

Physical examination reveals blood pressure 138 over 85, heart rate 78 and regular, respiratory rate 16, oxygen saturation 97% on room air. Cardiovascular exam shows regular rate and rhythm, no murmurs, rubs, or gallops. Lungs clear to auscultation bilaterally.

Assessment: Exertional chest discomfort, need to rule out cardiac etiology. Stable type 2 diabetes and hypertension.

Plan: Order stress test and lipid panel. Continue current medications. Follow up in one week or sooner if symptoms worsen. Advise patient to seek immediate care if chest pain becomes severe or persistent.`

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = async () => {
    setError(null)
    setTranscription('')
    try {
      await startRecording()
    } catch (err: any) {
      const errorMessage = err?.name === 'NotAllowedError' 
        ? 'Microphone access denied. Please allow microphone permissions in your browser settings.'
        : err?.name === 'NotFoundError'
        ? 'No microphone device found. Please connect a microphone or use demo transcription.'
        : 'Could not access microphone. Please check your device and browser permissions.'
      setError(errorMessage)
      console.error('Recording error:', err)
    }
  }

  const handleTranscribe = useCallback(async () => {
    if (!audioBlob) return

    setIsTranscribing(true)
    setError(null)
    setTranscription('')

    try {
      const patientContext = selectedPatient
        ? `Patient: ${selectedPatient.name}, Age: ${selectedPatient.age}, Allergies: ${selectedPatient.allergies.join(', ')}, Conditions: ${selectedPatient.chronicConditions.join(', ')}`
        : undefined

      console.log(`[Voice Recording] Starting transcription with audioBlob size: ${audioBlob.size}`)
      const response = await transcribeAudio(audioBlob, patientContext)

      if (!response.ok) {
        const errorData = await response.text()
        console.error(`[Voice Recording] API returned error: ${response.status} - ${errorData}`)
        throw new Error(`Transcription failed: ${response.status}`)
      }

      const data = await response.json()
      console.log(`[Voice Recording] Transcription successful:`, data)
      setTranscription(data.text || '')
    } catch (err: any) {
      console.error('[Voice Recording] Transcription error:', err)
      const errorMsg = err?.message || 'Failed to transcribe audio. Please try again.'
      setError(errorMsg)
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob, selectedPatient])

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    resetRecording()
    setTranscription('')
    setError(null)
    setUseDemoTranscription(false)
  }

  const handleDemoTranscription = async () => {
    setIsTranscribing(true)
    setError(null)
    setTranscription('')
    setUseDemoTranscription(true)

    try {
      // Simulate streaming response
      const words = demoTranscription.split(' ')
      let fullText = ''
      
      for (const word of words) {
        fullText += word + ' '
        setTranscription(fullText)
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
    } catch (err) {
      console.error('Demo transcription error:', err)
      setError('Failed to load demo transcription.')
    } finally {
      setIsTranscribing(false)
    }
  }

  return (
    <DashboardShell
      title="Voice Recording"
      subtitle="Record and transcribe medical consultations in real-time"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Select Patient</h2>
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-h-150 overflow-y-auto pr-1">
            {demoPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 border',
                  selectedPatient?.id === patient.id
                    ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20'
                    : 'bg-muted/30 border-border/40 hover:bg-muted/50'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full shrink-0',
                  selectedPatient?.id === patient.id ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <span className={cn(
                    'text-sm font-semibold',
                    selectedPatient?.id === patient.id ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.age}y, {patient.gender} | {patient.bloodType}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {selectedPatient && selectedPatient.allergies.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-1.5 text-destructive text-xs font-medium mb-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                Known Allergies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedPatient.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="outline"
                    className="text-xs bg-destructive/10 border-destructive/20 text-destructive"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Recording Interface */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-semibold text-foreground">Voice Recorder</h2>
            {isRecording && (
              <Badge
                variant="outline"
                className={cn(
                  'font-medium border-0',
                  isPaused
                    ? 'bg-warning/10 text-warning'
                    : 'bg-destructive/10 text-destructive animate-pulse'
                )}
              >
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                {isPaused ? 'Paused' : 'Recording'}
              </Badge>
            )}
          </div>

          {/* Visualizer */}
          <div className="rounded-xl bg-muted/30 p-6 mb-6 border border-border/40">
            <AudioVisualizer audioData={audioData} isRecording={isRecording} isPaused={isPaused} />
            <div className="text-center mt-4">
              <span className="text-4xl font-mono font-semibold text-foreground tracking-tight">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {!isRecording && !audioBlob && (
              <>
                <Button
                  size="lg"
                  onClick={handleStartRecording}
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  <Mic className="h-6 w-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDemoTranscription}
                  disabled={isTranscribing}
                  className="bg-muted hover:bg-muted/80"
                >
                  {isTranscribing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-5 w-5 mr-2" />
                  )}
                  Demo Transcription
                </Button>
              </>
            )}

            {isRecording && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="rounded-full h-14 w-14 border-border/60 bg-white/50 hover:bg-white"
                >
                  {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                </Button>
                <Button
                  size="lg"
                  onClick={stopRecording}
                  className="rounded-full h-16 w-16 bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/25"
                >
                  <Square className="h-6 w-6" />
                </Button>
              </>
            )}

            {!isRecording && audioBlob && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-full h-14 w-14 border-border/60 bg-white/50 hover:bg-white"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className="rounded-full h-14 px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  {isTranscribing ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-5 w-5 mr-2" />
                  )}
                  {isTranscribing ? 'Transcribing...' : 'Transcribe with AI'}
                </Button>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Transcription Result */}
          {(transcription || isTranscribing) && (
            <div className="rounded-xl bg-muted/30 border border-border/40 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Transcription
                </h3>
                {transcription && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 mr-1 text-accent" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 mr-1" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                )}
              </div>
              <div className="prose prose-sm max-w-none">
                {isTranscribing && !transcription && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Processing audio...</span>
                  </div>
                )}
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {transcription}
                  {isTranscribing && <span className="animate-pulse text-primary">|</span>}
                </p>
              </div>
              {transcription && !isTranscribing && (
                <div className="mt-5 pt-4 border-t border-border/40 flex gap-3">
                  <Button className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-sm shadow-lg shadow-primary/20">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Report
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-border/60 bg-white/50 hover:bg-white text-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Save to EMR
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!isRecording && !audioBlob && !transcription && (
            <div className="text-center py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mx-auto mb-4">
                <MicOff className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                Select a patient and click the microphone to start recording.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                AI will transcribe your voice and extract medical information.
              </p>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
