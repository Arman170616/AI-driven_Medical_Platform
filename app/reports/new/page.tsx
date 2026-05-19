'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { SOAPNotesDisplay } from '@/components/medical/soap-notes'
import { generateReport } from '@/lib/api-client'
import {
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Pill,
  Stethoscope,
  Loader2,
  Copy,
  Check,
  User,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoPatients, demoTranscriptions } from '@/lib/demo-data'
import type { Patient, SOAPNote } from '@/types/medical'

interface GeneratedReport {
  soapNotes: SOAPNote
  symptoms: string[]
  diagnoses: { name: string; confidence: number; icdCode: string | null }[]
  icdCodes: { code: string; description: string; category: string }[]
  medications: { name: string; dosage: string; frequency: string; duration: string }[]
  recommendations: string[]
}

export default function NewReportPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [transcription, setTranscription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [report, setReport] = useState<GeneratedReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleLoadSample = () => {
    const sampleTranscription = demoTranscriptions[0]
    const patient = demoPatients.find((p) => p.id === sampleTranscription.patientId)
    if (patient) {
      setSelectedPatient(patient)
      setTranscription(sampleTranscription.text)
    }
  }

  const handleGenerateReport = async () => {
    if (!transcription.trim()) return

    setIsGenerating(true)
    setReport(null)
    setError(null)

    try {
      const patientContext = selectedPatient
        ? `Name: ${selectedPatient.name}, Age: ${selectedPatient.age}, Gender: ${selectedPatient.gender}, Allergies: ${selectedPatient.allergies.join(', ')}, Chronic Conditions: ${selectedPatient.chronicConditions.join(', ')}`
        : undefined

      const data = await generateReport(transcription, patientContext)
      
      if (!data || !data.soapNotes) {
        throw new Error('Invalid report format received from server')
      }
      
      setReport(data)
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to generate report. Please try again.'
      console.error('[NewReportPage] Report generation error:', err)
      setError(errorMsg)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    if (!report) return
    const text = `SOAP Notes
=========

Subjective:
${report.soapNotes.subjective}

Objective:
${report.soapNotes.objective}

Assessment:
${report.soapNotes.assessment}

Plan:
${report.soapNotes.plan}

Diagnoses:
${report.diagnoses.map((d) => `- ${d.name} (${d.icdCode || 'No ICD code'})`).join('\n')}

Recommendations:
${report.recommendations.map((r) => `- ${r}`).join('\n')}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApproveSave = async () => {
    if (!report || !selectedPatient) return

    setIsSaving(true)
    try {
      // Save report to localStorage (demo implementation)
      const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]')
      const newReport = {
        id: Date.now().toString(),
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        createdAt: new Date().toISOString(),
        transcription,
        report,
      }
      savedReports.push(newReport)
      localStorage.setItem('savedReports', JSON.stringify(savedReports))

      // Show success message
      alert('Report saved successfully!')
      
      // Reset form
      setReport(null)
      setTranscription('')
      setSelectedPatient(null)
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Failed to save report')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePrescription = async () => {
    if (!report) return

    setIsSaving(true)
    try {
      // Store the prescription data in localStorage for the prescriptions page
      const prescriptionData = {
        patientId: selectedPatient?.id,
        patientName: selectedPatient?.name,
        diagnoses: report.diagnoses.map(d => d.name),
        medications: report.medications,
        recommendations: report.recommendations,
        icdCodes: report.icdCodes,
      }
      
      localStorage.setItem('generatedPrescription', JSON.stringify(prescriptionData))
      
      // Navigate to prescriptions page
      router.push('/prescriptions')
    } catch (error) {
      console.error('Error generating prescription:', error)
      alert('Failed to generate prescription')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardShell
      title="Generate AI Report"
      subtitle="Transform voice transcriptions into structured medical reports"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Patient Selection */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Patient Context (Optional)
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleLoadSample}
                className="text-primary text-xs"
              >
                Load Sample
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {demoPatients.slice(0, 4).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(selectedPatient?.id === patient.id ? null : patient)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all',
                    selectedPatient?.id === patient.id
                      ? 'bg-primary/20 border-2 border-primary/50 text-primary'
                      : 'glass-button border border-white/20 text-foreground/70'
                  )}
                >
                  <span className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  {patient.name}
                </button>
              ))}
            </div>
            {selectedPatient && (
              <div className="mt-4 p-3 rounded-lg bg-white/10 border border-white/20 text-sm">
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <span>Age: {selectedPatient.age}y</span>
                  <span>Blood Type: {selectedPatient.bloodType}</span>
                </div>
                {selectedPatient.allergies.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-destructive text-xs">
                      Allergies: {selectedPatient.allergies.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </GlassCard>

          {/* Transcription Input */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Transcription
            </h2>
            <Textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder="Paste or type the medical transcription here..."
              className="min-h-75 glass-input rounded-xl resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-muted-foreground">
                {transcription.split(/\s+/).filter(Boolean).length} words
              </span>
              <Button
                onClick={handleGenerateReport}
                disabled={!transcription.trim() || isGenerating}
                className="rounded-xl bg-primary hover:bg-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {error && (
            <GlassCard className="p-4 border-red-500/50 bg-red-500/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-600 text-sm">Error</h3>
                  <p className="text-red-600/90 text-sm mt-1">{error}</p>
                </div>
              </div>
            </GlassCard>
          )}
          
          {!report && !isGenerating && !error && (
            <GlassCard className="p-12 text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate</h3>
              <p className="text-sm text-muted-foreground">
                Enter a transcription and click Generate Report to create structured SOAP notes with
                AI-suggested diagnoses and ICD-10 codes.
              </p>
            </GlassCard>
          )}

          {isGenerating && (
            <GlassCard className="p-12 text-center">
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Transcription</h3>
              <p className="text-sm text-muted-foreground">
                AI is extracting symptoms, generating SOAP notes, and suggesting diagnoses...
              </p>
            </GlassCard>
          )}

          {report && (
            <>
              {/* SOAP Notes */}
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    SOAP Notes
                  </h2>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 mr-1 text-accent" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={cn('h-4 w-4 mr-1', isGenerating && 'animate-spin')} />
                      Regenerate
                    </Button>
                  </div>
                </div>
                <SOAPNotesDisplay soapNotes={report.soapNotes} />
              </GlassCard>

              {/* Diagnoses & ICD Codes */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Diagnoses & ICD-10 Codes
                </h2>
                <div className="space-y-3">
                  {report.diagnoses.map((diagnosis, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-white/10 p-3 border border-white/20"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-10 w-10 rounded-full flex items-center justify-center',
                            diagnosis.confidence > 0.8
                              ? 'bg-accent/20'
                              : diagnosis.confidence > 0.6
                                ? 'bg-amber-500/20'
                                : 'bg-muted/20'
                          )}
                        >
                          <CheckCircle2
                            className={cn(
                              'h-5 w-5',
                              diagnosis.confidence > 0.8
                                ? 'text-accent'
                                : diagnosis.confidence > 0.6
                                  ? 'text-amber-500'
                                  : 'text-muted-foreground'
                            )}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{diagnosis.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {Math.round(diagnosis.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                      {diagnosis.icdCode && (
                        <Badge variant="outline" className="font-mono text-xs">
                          {diagnosis.icdCode}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Medications */}
              {report.medications.length > 0 && (
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Medications
                  </h2>
                  <div className="space-y-2">
                    {report.medications.map((med, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-white/10 p-3 border border-white/20"
                      >
                        <div>
                          <p className="font-medium text-foreground">{med.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {med.dosage} - {med.frequency} - {med.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Recommendations */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleApproveSave}
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary/90 py-6"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Approve & Save'}
                </Button>
                <Button
                  onClick={handleGeneratePrescription}
                  disabled={isSaving}
                  variant="outline"
                  className="flex-1 rounded-xl glass-button border-white/30 text-foreground py-6"
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Pill className="h-5 w-5 mr-2" />
                  )}
                  {isSaving ? 'Generating...' : 'Generate Prescription'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
