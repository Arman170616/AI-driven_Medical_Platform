'use client'

import { use } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SOAPNotesDisplay } from '@/components/medical/soap-notes'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Calendar,
  FileText,
  Mic,
  Pill,
  Activity,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getPatientById,
  getVisitsByPatientId,
  demoTranscriptions,
  demoReports,
  demoPrescriptions,
} from '@/lib/demo-data'

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const patient = getPatientById(id)

  if (!patient) {
    notFound()
  }

  const visits = getVisitsByPatientId(patient.id)
  const transcriptions = demoTranscriptions.filter((t) => t.patientId === patient.id)
  const reports = demoReports.filter((r) => r.patientId === patient.id)
  const prescriptions = demoPrescriptions.filter((p) => p.patientId === patient.id)

  return (
    <DashboardShell title="Patient EMR" subtitle={`Electronic Medical Record for ${patient.name}`}>
      {/* Back Button */}
      <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Profile Card */}
        <GlassCard className="p-6">
          <div className="text-center mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">
                {patient.name.split(' ').map((n) => n[0]).join('')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{patient.name}</h2>
            <p className="text-muted-foreground">
              {patient.age} years old | {patient.gender} | {patient.bloodType}
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-foreground">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-foreground">{patient.email}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span className="text-foreground">{patient.address}</span>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-3 rounded-xl bg-white/10 border border-white/20 mb-6">
            <p className="text-xs text-muted-foreground mb-1">Emergency Contact</p>
            <p className="font-medium text-foreground">{patient.emergencyContact.name}</p>
            <p className="text-sm text-muted-foreground">
              {patient.emergencyContact.relationship} | {patient.emergencyContact.phone}
            </p>
          </div>

          {/* Insurance */}
          {patient.insuranceProvider && (
            <div className="p-3 rounded-xl bg-white/10 border border-white/20">
              <p className="text-xs text-muted-foreground mb-1">Insurance</p>
              <p className="font-medium text-foreground">{patient.insuranceProvider}</p>
              <p className="text-sm text-muted-foreground font-mono">{patient.insuranceId}</p>
            </div>
          )}
        </GlassCard>

        {/* Medical Info */}
        <GlassCard className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Medical Information
          </h3>

          {/* Allergies */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-foreground">Allergies</span>
            </div>
            {patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map((allergy) => (
                  <Badge
                    key={allergy}
                    variant="destructive"
                    className="bg-destructive/20 text-destructive border-destructive/30"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No known allergies</p>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">Chronic Conditions</span>
            </div>
            {patient.chronicConditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient.chronicConditions.map((condition) => (
                  <Badge
                    key={condition}
                    variant="outline"
                    className="bg-primary/10 border-primary/30 text-primary"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No chronic conditions</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-2xl font-bold text-primary">{visits.length}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-2xl font-bold text-secondary">{reports.length}</p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/10 border border-white/20">
              <p className="text-2xl font-bold text-accent">{prescriptions.length}</p>
              <p className="text-xs text-muted-foreground">Prescriptions</p>
            </div>
          </div>
        </GlassCard>

        {/* Visit Timeline */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Visit History
            </h3>
            <Link href="/voice-recording">
              <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-1" />
                New Visit
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {visits.map((visit, index) => (
              <div
                key={visit.id}
                className="relative pl-6 pb-4 border-l-2 border-white/20 last:border-l-0 last:pb-0"
              >
                <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="rounded-xl bg-white/10 border border-white/20 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-foreground">{visit.chiefComplaint}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(visit.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        visit.status === 'completed'
                          ? 'border-accent/50 bg-accent/10 text-accent'
                          : visit.status === 'in-progress'
                            ? 'border-amber-500/50 bg-amber-500/10 text-amber-600'
                            : 'border-primary/50 bg-primary/10 text-primary'
                      )}
                    >
                      {visit.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {visit.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                      {visit.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  {visit.vitals && (
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3">
                      <span>BP: {visit.vitals.bloodPressure.systolic}/{visit.vitals.bloodPressure.diastolic}</span>
                      <span>HR: {visit.vitals.heartRate} bpm</span>
                      <span>Temp: {visit.vitals.temperature}°F</span>
                      <span>SpO2: {visit.vitals.oxygenSaturation}%</span>
                    </div>
                  )}
                  {visit.transcriptionId && (
                    <div className="flex items-center gap-2 mt-3">
                      <Mic className="h-3 w-3 text-primary" />
                      <span className="text-xs text-primary">Transcription available</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {visits.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No visits recorded</p>
            )}
          </div>
        </GlassCard>

        {/* Recent Reports */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Reports
          </h3>
          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div
                key={report.id}
                className="rounded-xl bg-white/10 border border-white/20 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      report.status === 'approved'
                        ? 'border-accent/50 bg-accent/10 text-accent'
                        : 'border-amber-500/50 bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {report.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 line-clamp-2">
                  {report.soapNotes.assessment}
                </p>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No reports yet</p>
            )}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
