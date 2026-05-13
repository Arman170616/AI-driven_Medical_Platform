export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  specialty?: string
  licenseNumber?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  bloodType: string
  phone: string
  email: string
  address: string
  allergies: string[]
  chronicConditions: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  insuranceProvider?: string
  insuranceId?: string
  createdAt: string
}

export interface Visit {
  id: string
  patientId: string
  doctorId: string
  date: string
  chiefComplaint: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  vitals?: Vitals
  transcriptionId?: string
  reportId?: string
  prescriptionIds?: string[]
  notes?: string
}

export interface Vitals {
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  temperature: number
  respiratoryRate: number
  oxygenSaturation: number
  weight: number
  height: number
}

export interface Transcription {
  id: string
  visitId: string
  patientId: string
  doctorId: string
  text: string
  audioUrl?: string
  duration: number
  language: string
  status: 'recording' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface SOAPNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface MedicalReport {
  id: string
  visitId: string
  patientId: string
  doctorId: string
  transcriptionId: string
  soapNotes: SOAPNote
  symptoms: string[]
  diagnoses: Diagnosis[]
  icdCodes: ICDCode[]
  recommendations: string[]
  status: 'draft' | 'pending-review' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  approvedAt?: string
}

export interface Diagnosis {
  name: string
  confidence: number
  icdCode?: string
}

export interface ICDCode {
  code: string
  description: string
  category: string
}

export interface Medicine {
  id: string
  name: string
  genericName: string
  dosageForm: string
  strength: string
  category: string
  interactions?: string[]
}

export interface PrescriptionItem {
  medicineId: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
  quantity: number
}

export interface Prescription {
  id: string
  visitId: string
  patientId: string
  doctorId: string
  items: PrescriptionItem[]
  notes?: string
  status: 'draft' | 'issued' | 'filled' | 'cancelled'
  createdAt: string
  issuedAt?: string
  validUntil?: string
}

export interface DrugInteractionWarning {
  drug1: string
  drug2: string
  severity: 'low' | 'moderate' | 'high' | 'critical'
  description: string
}

export interface AllergyAlert {
  medicine: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  description: string
}

export interface DashboardStats {
  todayPatients: number
  pendingReports: number
  completedVisits: number
  aiUsageToday: number
}
