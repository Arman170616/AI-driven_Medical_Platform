'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { GlassCard } from '@/components/glass/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { suggestMedicines } from '@/lib/api-client'
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
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [items, setItems] = useState<PrescriptionItem[]>([])
  const [notes, setNotes] = useState('')
  const [suggestions, setSuggestions] = useState<MedicineSuggestion[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isIssuing, setIsIssuing] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleIssuePrescription = async () => {
    if (!selectedPatient || items.length === 0) return

    setIsIssuing(true)
    setError(null)

    try {
      const prescriptionData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientAge: selectedPatient.age,
        medicines: items,
        notes,
        issuedDate: new Date().toISOString(),
        status: 'issued',
      }

      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('lastIssuedPrescription', JSON.stringify(prescriptionData))

      // Show success message
      alert(`Prescription issued successfully for ${selectedPatient.name}!`)

      // Reset form
      setItems([])
      setNotes('')
      setSelectedPatient(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to issue prescription'
      console.error('[IssuePrescription]', err)
      setError(errorMsg)
    } finally {
      setIsIssuing(false)
    }
  }

  const handlePrintPreview = () => {
    if (!selectedPatient || items.length === 0) return

    try {
      const printContent = generatePrintableContent()
      
      // Open print preview in a new window
      const printWindow = window.open('', '', 'height=800,width=1000')
      if (!printWindow) {
        throw new Error('Could not open print window')
      }

      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to open print preview'
      console.error('[PrintPreview]', err)
      setError(errorMsg)
    }
  }

  const generatePrintableContent = () => {
    const today = new Date().toLocaleDateString()
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prescription - ${selectedPatient?.name}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
          }
          .header {
            border-bottom: 3px solid #0066cc;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #0066cc;
            font-size: 32px;
            margin-bottom: 5px;
          }
          .header p {
            color: #666;
            font-size: 14px;
          }
          .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
          }
          .info-group label {
            font-weight: bold;
            color: #0066cc;
            font-size: 12px;
            display: block;
            margin-bottom: 5px;
          }
          .info-group p {
            color: #333;
            font-size: 14px;
          }
          .medicines-section {
            margin-bottom: 30px;
          }
          .medicines-section h2 {
            color: #0066cc;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #0066cc;
          }
          .medicine-item {
            background: #f9f9f9;
            border-left: 4px solid #0066cc;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 4px;
          }
          .medicine-name {
            font-weight: bold;
            color: #0066cc;
            font-size: 16px;
            margin-bottom: 8px;
          }
          .medicine-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 14px;
            color: #555;
          }
          .medicine-details div {
            margin-bottom: 5px;
          }
          .label {
            font-weight: bold;
            color: #333;
          }
          .notes-section {
            background: #fff9e6;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin-bottom: 30px;
            border-radius: 4px;
          }
          .notes-section h3 {
            color: #ff9800;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .notes-section p {
            color: #555;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-wrap;
          }
          .footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #ddd;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            width: 100%;
            border-top: 1px solid #333;
            margin-top: 50px;
            padding-top: 5px;
            font-size: 12px;
            color: #666;
          }
          .date-issued {
            color: #666;
            font-size: 12px;
            margin-top: 20px;
          }
          @media print {
            body { background: white; }
            .container { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 PRESCRIPTION</h1>
            <p>Medical Prescription Document</p>
          </div>

          <div class="patient-info">
            <div class="info-group">
              <label>Patient Name</label>
              <p>${selectedPatient?.name || 'N/A'}</p>
            </div>
            <div class="info-group">
              <label>Age / Gender</label>
              <p>${selectedPatient?.age} years | ${selectedPatient?.gender || 'N/A'}</p>
            </div>
            <div class="info-group">
              <label>Blood Type</label>
              <p>${selectedPatient?.bloodType || 'N/A'}</p>
            </div>
            <div class="info-group">
              <label>Date Issued</label>
              <p>${today}</p>
            </div>
          </div>

          <div class="medicines-section">
            <h2>Prescribed Medicines</h2>
            ${items.map((item, index) => `
              <div class="medicine-item">
                <div class="medicine-name">${index + 1}. ${item.medicineName}</div>
                <div class="medicine-details">
                  <div><span class="label">Dosage:</span> ${item.dosage}</div>
                  <div><span class="label">Frequency:</span> ${item.frequency}</div>
                  <div><span class="label">Duration:</span> ${item.duration}</div>
                  <div><span class="label">Quantity:</span> ${item.quantity} tablets</div>
                </div>
                ${item.instructions ? `
                  <div style="margin-top: 8px; color: #666; font-size: 13px;">
                    <span class="label">Instructions:</span> ${item.instructions}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          ${notes ? `
            <div class="notes-section">
              <h3>Additional Notes</h3>
              <p>${notes}</p>
            </div>
          ` : ''}

          ${selectedPatient?.allergies && selectedPatient.allergies.length > 0 ? `
            <div style="background: #fee; border-left: 4px solid #f44336; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
              <h3 style="color: #f44336; margin-bottom: 10px; font-size: 14px;">⚠️ ALLERGIES</h3>
              <p style="color: #c62828; font-size: 14px; font-weight: bold;">${selectedPatient.allergies.join(', ')}</p>
            </div>
          ` : ''}

          <div class="footer">
            <div class="signature">
              <div class="signature-line">Doctor's Signature</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">Authorized Medical Practitioner</div>
            </div>
            <div class="signature">
              <div class="signature-line">Patient's Signature</div>
              <div style="color: #666; font-size: 12px; margin-top: 5px;">Patient / Guardian</div>
            </div>
          </div>

          <div class="date-issued">
            <p>Prescription issued: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  return (
    <DashboardShell
      title="Prescriptions"
      subtitle="Generate AI-assisted prescriptions with drug interaction checks"
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-red-600 text-sm">Error</h3>
              <p className="text-red-600/90 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

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
              onClick={handleIssuePrescription}
              disabled={!selectedPatient || items.length === 0 || isIssuing}
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 py-6"
            >
              {isIssuing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Issuing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Issue Prescription
                </>
              )}
            </Button>
            <Button
              onClick={handlePrintPreview}
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
