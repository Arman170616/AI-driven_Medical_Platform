'use client'

import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'
import {
  User,
  Search,
  Plus,
  Phone,
  Mail,
  Heart,
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoPatients, getVisitsByPatientId } from '@/lib/demo-data'

export default function PatientsPage() {
  const [search, setSearch] = useState('')

  const filteredPatients = demoPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell title="Patients" subtitle="Manage patient records and medical history">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              type="search"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border-border/60 bg-white/50 pl-10 text-sm focus:bg-white"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/60 bg-white/50 shrink-0">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-primary/90 h-10 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-border/40 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{demoPatients.length}</p>
            <p className="text-xs text-muted-foreground">Total Patients</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-border/40 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-border/40 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10">
            <Heart className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">8</p>
            <p className="text-xs text-muted-foreground">Chronic Care</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/60 border border-border/40 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">With Allergies</p>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => {
          const visits = getVisitsByPatientId(patient.id)
          const recentVisit = visits[0]

          return (
            <GlassCard key={patient.id} className="p-5" hover>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/10 flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {patient.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-foreground truncate">{patient.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {patient.age} years, {patient.gender} | {patient.bloodType}
                  </p>
                </div>
                <Link href={`/patients/${patient.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{patient.email}</span>
                </div>
              </div>

              {/* Allergies */}
              {patient.allergies.length > 0 && (
                <div className="mb-4 p-2.5 rounded-lg bg-destructive/5 border border-destructive/15">
                  <div className="flex items-center gap-1.5 text-destructive text-[10px] font-medium uppercase tracking-wider mb-1.5">
                    <AlertTriangle className="h-3 w-3" />
                    Allergies
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {patient.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="outline"
                        className="text-[10px] h-5 bg-destructive/10 border-0 text-destructive font-medium"
                      >
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions */}
              {patient.chronicConditions.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium uppercase tracking-wider mb-1.5">
                    <Heart className="h-3 w-3" />
                    Conditions
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {patient.chronicConditions.map((condition) => (
                      <Badge
                        key={condition}
                        variant="outline"
                        className="text-[10px] h-5 border-border/60 bg-white/50 font-normal"
                      >
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Visit */}
              {recentVisit && (
                <div className="pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(recentVisit.date).toLocaleDateString()}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] font-medium border-0',
                        recentVisit.status === 'completed'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-warning/10 text-warning'
                      )}
                    >
                      {recentVisit.status}
                    </Badge>
                  </div>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <GlassCard className="p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mx-auto mb-4">
            <User className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No Patients Found</h3>
          <p className="text-sm text-muted-foreground">
            {search ? 'Try a different search term.' : 'Add your first patient to get started.'}
          </p>
        </GlassCard>
      )}
    </DashboardShell>
  )
}
