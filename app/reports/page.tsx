'use client'

import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoReports, demoPatients } from '@/lib/demo-data'

const statusConfig = {
  draft: { icon: FileText, color: 'border-muted/50 bg-muted/10 text-muted-foreground', label: 'Draft' },
  'pending-review': { icon: Clock, color: 'border-amber-500/50 bg-amber-500/10 text-amber-600', label: 'Pending Review' },
  approved: { icon: CheckCircle2, color: 'border-accent/50 bg-accent/10 text-accent', label: 'Approved' },
  rejected: { icon: XCircle, color: 'border-destructive/50 bg-destructive/10 text-destructive', label: 'Rejected' },
}

export default function ReportsPage() {
  return (
    <DashboardShell title="AI Reports" subtitle="View and manage AI-generated medical reports">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white/10">All Reports ({demoReports.length})</Badge>
          <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-600">
            Pending ({demoReports.filter((r) => r.status === 'pending-review').length})
          </Badge>
        </div>
        <Link href="/reports/new">
          <Button className="rounded-xl bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </Link>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {demoReports.map((report) => {
          const patient = demoPatients.find((p) => p.id === report.patientId)
          const status = statusConfig[report.status]
          const StatusIcon = status.icon

          return (
            <GlassCard key={report.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{patient?.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {report.soapNotes.assessment.slice(0, 100)}...
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.diagnoses.length} diagnoses
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {report.icdCodes.length} ICD codes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn('rounded-lg', status.color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                  <Link href={`/reports/${report.id}`}>
                    <Button size="sm" variant="ghost" className="rounded-lg">
                      View
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Diagnoses Preview */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap gap-2">
                  {report.diagnoses.slice(0, 3).map((diagnosis, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/10 border-white/30 text-foreground/80"
                    >
                      {diagnosis.name}
                      {diagnosis.icdCode && (
                        <span className="ml-1 font-mono text-xs opacity-70">
                          ({diagnosis.icdCode})
                        </span>
                      )}
                    </Badge>
                  ))}
                  {report.diagnoses.length > 3 && (
                    <Badge variant="outline" className="bg-white/5 text-muted-foreground">
                      +{report.diagnoses.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </GlassCard>
          )
        })}

        {demoReports.length === 0 && (
          <GlassCard className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Reports Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate your first AI medical report from a voice transcription.
            </p>
            <Link href="/reports/new">
              <Button className="rounded-xl bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </Link>
          </GlassCard>
        )}
      </div>
    </DashboardShell>
  )
}
