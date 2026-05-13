'use client'

import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Users,
  FileText,
  CheckCircle2,
  Sparkles,
  Mic,
  ArrowRight,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import {
  demoDashboardStats,
  demoPatients,
  getTodaysVisits,
  demoTranscriptions,
  demoReports,
} from '@/lib/demo-data'
import { cn } from '@/lib/utils'

const stats = [
  {
    label: "Today's Patients",
    value: demoDashboardStats.todayPatients,
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    trend: '+3 from yesterday',
    trendUp: true,
  },
  {
    label: 'Pending Reports',
    value: demoDashboardStats.pendingReports,
    icon: FileText,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    trend: '2 need review',
    trendUp: false,
  },
  {
    label: 'Completed Visits',
    value: demoDashboardStats.completedVisits,
    icon: CheckCircle2,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    trend: '+12% this week',
    trendUp: true,
  },
  {
    label: 'AI Usage Today',
    value: demoDashboardStats.aiUsageToday,
    icon: Sparkles,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    trend: 'Transcriptions',
    trendUp: true,
  },
]

export default function DashboardPage() {
  const todaysVisits = getTodaysVisits()

  return (
    <DashboardShell title="Dashboard" subtitle="Welcome back, Dr. Sarah Johnson">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-5" hover>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-semibold text-foreground mt-1 tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className={cn('h-3 w-3', stat.trendUp ? 'text-accent' : 'text-muted-foreground')} />
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </div>
              <div className={cn('rounded-xl p-2.5', stat.bgColor)}>
                <stat.icon className={cn('h-5 w-5', stat.color)} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            <Link href="/voice-recording">
              <Button className="w-full justify-between rounded-xl bg-primary hover:bg-primary/90 h-12 shadow-lg shadow-primary/20">
                <span className="flex items-center gap-3">
                  <Mic className="h-4 w-4" />
                  Start Voice Recording
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/reports/new">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl h-12 border-border/60 bg-white/50 hover:bg-white text-foreground"
              >
                <span className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Generate AI Report
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
            <Link href="/patients">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl h-12 border-border/60 bg-white/50 hover:bg-white text-foreground"
              >
                <span className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  View All Patients
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </GlassCard>

        {/* Today's Schedule */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Today&apos;s Schedule</h2>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-medium">
              {todaysVisits.length} Visits
            </Badge>
          </div>
          <div className="space-y-3">
            {todaysVisits.map((visit) => {
              const patient = demoPatients.find((p) => p.id === visit.patientId)
              if (!patient) return null
              return (
                <div
                  key={visit.id}
                  className="flex items-center justify-between rounded-xl bg-muted/30 p-4 border border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/10">
                      <span className="text-sm font-semibold text-primary">
                        {patient.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{visit.chiefComplaint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        'rounded-md text-xs font-medium border-0',
                        visit.status === 'in-progress'
                          ? 'bg-warning/10 text-warning'
                          : visit.status === 'scheduled'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent'
                      )}
                    >
                      {visit.status === 'in-progress' && <Clock className="h-3 w-3 mr-1" />}
                      {visit.status === 'scheduled' && <Calendar className="h-3 w-3 mr-1" />}
                      {visit.status === 'completed' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {visit.status.replace('-', ' ')}
                    </Badge>
                    <Link href={`/patients/${patient.id}`}>
                      <Button size="sm" variant="ghost" className="rounded-lg h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
            {todaysVisits.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No scheduled visits for today</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recent Transcriptions */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Recent Transcriptions</h2>
            <Link href="/voice-recording">
              <Button variant="ghost" size="sm" className="text-primary h-8 text-xs">
                View All
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {demoTranscriptions.slice(0, 3).map((transcription) => {
              const patient = demoPatients.find((p) => p.id === transcription.patientId)
              return (
                <div
                  key={transcription.id}
                  className="rounded-xl bg-muted/30 p-4 border border-border/40"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <Mic className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{patient?.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(transcription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{transcription.text}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs font-normal border-border/60">
                      {Math.floor(transcription.duration / 60)}:{(transcription.duration % 60).toString().padStart(2, '0')} min
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal border-0 bg-accent/10 text-accent"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {transcription.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>

        {/* Pending Actions */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Pending Actions</h2>
            <AlertCircle className="h-4 w-4 text-warning" />
          </div>
          <div className="space-y-3">
            {demoReports
              .filter((r) => r.status === 'pending-review')
              .slice(0, 3)
              .map((report) => {
                const patient = demoPatients.find((p) => p.id === report.patientId)
                return (
                  <div
                    key={report.id}
                    className="flex items-center gap-3 rounded-xl bg-warning/5 p-3 border border-warning/20"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                      <AlertCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {patient?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Report needs review</p>
                    </div>
                    <Link href={`/reports/${report.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 text-warning hover:text-warning hover:bg-warning/10">
                        Review
                      </Button>
                    </Link>
                  </div>
                )
              })}
            {demoReports.filter((r) => r.status === 'pending-review').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-accent opacity-60" />
                <p className="text-sm">All caught up!</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
