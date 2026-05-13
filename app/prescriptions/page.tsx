'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Loader2,
  FileText,
  User,
  CheckCircle2,
  Printer,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { demoPatients, demoMedicines } from '@/lib/demo-data'
import type { Patient, PrescriptionItem } from '@/types/medical'

interface MedicineSuggestion {
  medicine: string
  genericName: string
  dosage: string
  frequency: string
  duration: string
  reason: string
  warnings: string[]
}

export default function PrescriptionsPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [items, setItems] = useState<PrescriptionItem[]>([])
  const [notes, setNotes] = useState('')
  const [suggestions, setSuggestions] = useState<MedicineSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        medicineId: '',
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: 0,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleUpdateItem = (index: number, field: keyof PrescriptionItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleGetSuggestions = async () => {
    if (!selectedPatient) return

    setIsLoadingSuggestions(true)
    try {
      const response = await fetch('/api/suggest-medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnoses: selectedPatient.chronicConditions,
          symptoms: [],
          patientAllergies: selectedPatient.allergies,
          currentMedications: [],
        }),
      })

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error getting suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const handleAddSuggestion = (suggestion: MedicineSuggestion) => {
    setItems([
      ...items,
      {
        medicineId: '',
        medicineName: `${suggestion.medicine} (${suggestion.genericName})`,
        dosage: suggestion.dosage,
        frequency: suggestion.frequency,
        duration: suggestion.duration,
        instructions: suggestion.warnings.join('. '),
        quantity: 30,
      },
    ])
  }

  return (
    <DashboardShell
      title="Prescriptions"
      subtitle="Generate AI-assisted prescriptions with drug interaction checks"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection & AI Suggestions */}
        <div className="space-y-6">
          {/* Patient Selection */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Select Patient
            </h2>
            <div className="space-y-2 max-h-50 overflow-y-auto">
              {demoPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient)
                    setSuggestions([])
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all',
                    selectedPatient?.id === patient.id
                      ? 'bg-primary/20 border-2 border-primary/50'
                      : 'glass-button border border-white/20'
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <span className="text-xs font-bold text-primary">
                      {patient.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.age}y | {patient.bloodType}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Patient Allergies Warning */}
            {selectedPatient && selectedPatient.allergies.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm font-medium mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Drug Allergies
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.allergies.map((allergy) => (
                    <Badge
                      key={allergy}
                      variant="destructive"
                      className="text-xs bg-destructive/20"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {/* AI Suggestions */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Suggestions
              </h2>
            </div>
            
            <Button
              onClick={handleGetSuggestions}
              disabled={!selectedPatient || isLoadingSuggestions}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 mb-4"
            >
              {isLoadingSuggestions ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get AI Suggestions
                </>
              )}
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/10 border border-white/20 p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">{suggestion.medicine}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.genericName}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="h-7 text-xs text-primary"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{suggestion.reason}</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.dosage}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.frequency}
                      </Badge>
                    </div>
                    {suggestion.warnings.length > 0 && (
                      <div className="mt-2 text-xs text-amber-600">
                        {suggestion.warnings[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!selectedPatient && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Select a patient to get AI-powered medication suggestions
              </p>
            )}
          </GlassCard>
        </div>

        {/* Prescription Form */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Prescription
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="rounded-lg glass-button border-white/30 text-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Medicine
            </Button>
          </div>

          {/* Medicine Items */}
          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/10 border border-white/20 p-4"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Medicine {index + 1}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveItem(index)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Medicine Name</Label>
                    <Input
                      value={item.medicineName}
                      onChange={(e) => handleUpdateItem(index, 'medicineName', e.target.value)}
                      placeholder="e.g., Metformin 500mg"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Dosage</Label>
                    <Input
                      value={item.dosage}
                      onChange={(e) => handleUpdateItem(index, 'dosage', e.target.value)}
                      placeholder="e.g., 500mg"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Frequency</Label>
                    <Input
                      value={item.frequency}
                      onChange={(e) => handleUpdateItem(index, 'frequency', e.target.value)}
                      placeholder="e.g., Twice daily"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <Input
                      value={item.duration}
                      onChange={(e) => handleUpdateItem(index, 'duration', e.target.value)}
                      placeholder="e.g., 30 days"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="e.g., 30"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Instructions</Label>
                    <Input
                      value={item.instructions}
                      onChange={(e) => handleUpdateItem(index, 'instructions', e.target.value)}
                      placeholder="e.g., Take with food"
                      className="glass-input rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center py-12 rounded-xl bg-white/5 border border-white/10">
                <Pill className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  No medicines added yet. Click &quot;Add Medicine&quot; or use AI suggestions.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <Label className="text-sm text-foreground">Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special instructions, warnings, or follow-up notes..."
              className="glass-input rounded-xl mt-2 min-h-25"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 py-6"
              disabled={!selectedPatient || items.length === 0}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Issue Prescription
            </Button>
            <Button
              variant="outline"
              className="rounded-xl glass-button border-white/30 text-foreground py-6"
              disabled={!selectedPatient || items.length === 0}
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Preview
            </Button>
          </div>
        </GlassCard>
      </div>
    </DashboardShell>
  )
}
