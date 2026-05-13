import type {
  User,
  Patient,
  Visit,
  Transcription,
  MedicalReport,
  Prescription,
  Medicine,
  DashboardStats,
} from '@/types/medical'

export const demoUsers: User[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medclinic.com',
    role: 'doctor',
    avatar: '/avatars/doctor-1.jpg',
    specialty: 'Internal Medicine',
    licenseNumber: 'MD-12345',
  },
  {
    id: 'doc-2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medclinic.com',
    role: 'doctor',
    avatar: '/avatars/doctor-2.jpg',
    specialty: 'Cardiology',
    licenseNumber: 'MD-67890',
  },
  {
    id: 'admin-1',
    name: 'Emily Davis',
    email: 'emily.davis@medclinic.com',
    role: 'admin',
    avatar: '/avatars/admin-1.jpg',
  },
  {
    id: 'nurse-1',
    name: 'Robert Williams',
    email: 'robert.williams@medclinic.com',
    role: 'nurse',
    avatar: '/avatars/nurse-1.jpg',
  },
]

export const demoPatients: Patient[] = [
  {
    id: 'pat-1',
    name: 'John Smith',
    age: 45,
    gender: 'male',
    dateOfBirth: '1979-03-15',
    bloodType: 'O+',
    phone: '+1 (555) 123-4567',
    email: 'john.smith@email.com',
    address: '123 Main Street, New York, NY 10001',
    allergies: ['Penicillin', 'Sulfa drugs'],
    chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse',
    },
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS-123456789',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 'pat-2',
    name: 'Maria Garcia',
    age: 32,
    gender: 'female',
    dateOfBirth: '1992-07-22',
    bloodType: 'A+',
    phone: '+1 (555) 234-5678',
    email: 'maria.garcia@email.com',
    address: '456 Oak Avenue, Los Angeles, CA 90001',
    allergies: ['Latex'],
    chronicConditions: ['Asthma'],
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+1 (555) 876-5432',
      relationship: 'Brother',
    },
    insuranceProvider: 'Aetna',
    insuranceId: 'AET-987654321',
    createdAt: '2023-03-20T14:15:00Z',
  },
  {
    id: 'pat-3',
    name: 'David Lee',
    age: 58,
    gender: 'male',
    dateOfBirth: '1966-11-08',
    bloodType: 'B-',
    phone: '+1 (555) 345-6789',
    email: 'david.lee@email.com',
    address: '789 Pine Road, Chicago, IL 60601',
    allergies: [],
    chronicConditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
    emergencyContact: {
      name: 'Susan Lee',
      phone: '+1 (555) 765-4321',
      relationship: 'Spouse',
    },
    insuranceProvider: 'UnitedHealthcare',
    insuranceId: 'UHC-456789123',
    createdAt: '2022-11-05T09:00:00Z',
  },
  {
    id: 'pat-4',
    name: 'Emma Wilson',
    age: 28,
    gender: 'female',
    dateOfBirth: '1996-04-30',
    bloodType: 'AB+',
    phone: '+1 (555) 456-7890',
    email: 'emma.wilson@email.com',
    address: '321 Elm Street, Houston, TX 77001',
    allergies: ['Aspirin', 'NSAIDs'],
    chronicConditions: [],
    emergencyContact: {
      name: 'Michael Wilson',
      phone: '+1 (555) 654-3210',
      relationship: 'Father',
    },
    insuranceProvider: 'Cigna',
    insuranceId: 'CIG-321654987',
    createdAt: '2024-01-10T11:45:00Z',
  },
  {
    id: 'pat-5',
    name: 'Robert Brown',
    age: 67,
    gender: 'male',
    dateOfBirth: '1957-09-12',
    bloodType: 'O-',
    phone: '+1 (555) 567-8901',
    email: 'robert.brown@email.com',
    address: '654 Maple Drive, Phoenix, AZ 85001',
    allergies: ['Codeine', 'Morphine'],
    chronicConditions: ['COPD', 'Osteoarthritis', 'Benign Prostatic Hyperplasia'],
    emergencyContact: {
      name: 'Patricia Brown',
      phone: '+1 (555) 543-2109',
      relationship: 'Spouse',
    },
    insuranceProvider: 'Medicare',
    insuranceId: 'MED-789123456',
    createdAt: '2021-06-18T08:30:00Z',
  },
]

export const demoVisits: Visit[] = [
  {
    id: 'visit-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    date: new Date().toISOString(),
    chiefComplaint: 'Chest discomfort and shortness of breath',
    status: 'in-progress',
    vitals: {
      bloodPressure: { systolic: 145, diastolic: 92 },
      heartRate: 88,
      temperature: 98.6,
      respiratoryRate: 18,
      oxygenSaturation: 96,
      weight: 185,
      height: 70,
    },
  },
  {
    id: 'visit-2',
    patientId: 'pat-2',
    doctorId: 'doc-1',
    date: new Date().toISOString(),
    chiefComplaint: 'Persistent cough and wheezing',
    status: 'scheduled',
    vitals: {
      bloodPressure: { systolic: 118, diastolic: 76 },
      heartRate: 72,
      temperature: 99.1,
      respiratoryRate: 20,
      oxygenSaturation: 94,
      weight: 135,
      height: 64,
    },
  },
  {
    id: 'visit-3',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    chiefComplaint: 'Follow-up for cardiac evaluation',
    status: 'completed',
    transcriptionId: 'trans-1',
    reportId: 'report-1',
    vitals: {
      bloodPressure: { systolic: 138, diastolic: 84 },
      heartRate: 68,
      temperature: 98.2,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: 195,
      height: 72,
    },
  },
  {
    id: 'visit-4',
    patientId: 'pat-4',
    doctorId: 'doc-1',
    date: new Date().toISOString(),
    chiefComplaint: 'Migraine headaches',
    status: 'scheduled',
  },
  {
    id: 'visit-5',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    date: new Date(Date.now() - 172800000).toISOString(),
    chiefComplaint: 'Joint pain and mobility issues',
    status: 'completed',
    transcriptionId: 'trans-2',
    reportId: 'report-2',
    prescriptionIds: ['presc-1'],
  },
]

export const demoTranscriptions: Transcription[] = [
  {
    id: 'trans-1',
    visitId: 'visit-3',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    text: `Patient presents for follow-up cardiac evaluation. He reports occasional mild chest tightness, especially with exertion. No acute chest pain at rest. He has been compliant with his medications including atorvastatin 40mg daily and aspirin 81mg daily. Blood pressure today is 138 over 84, heart rate 68, oxygen saturation 98%. On examination, heart sounds are regular with no murmurs. Lungs are clear bilaterally. No peripheral edema noted. Recent lipid panel shows LDL at 95, which is at goal. Echocardiogram from last month shows preserved ejection fraction at 55%. Plan is to continue current medications, recommend cardiac stress test in 3 months, and follow up in 6 weeks. Patient advised to maintain heart-healthy diet and regular moderate exercise.`,
    duration: 180,
    language: 'en',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'trans-2',
    visitId: 'visit-5',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    text: `Patient is a 67-year-old male presenting with worsening joint pain, primarily affecting both knees and lower back. Pain is described as 6 out of 10, worse in the morning and after prolonged sitting. He reports difficulty with stairs and getting up from seated position. Current medications include acetaminophen 650mg as needed, which provides minimal relief. Physical examination reveals decreased range of motion in both knees, crepitus present. Lumbar spine shows limited flexion and tenderness at L4-L5. X-rays of knees show moderate degenerative changes. Assessment: Osteoarthritis of bilateral knees and lumbar spine. Plan: Start celecoxib 200mg daily, refer to physical therapy, consider knee injections if no improvement in 4 weeks. Patient educated on weight management and low-impact exercises.`,
    duration: 210,
    language: 'en',
    status: 'completed',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export const demoReports: MedicalReport[] = [
  {
    id: 'report-1',
    visitId: 'visit-3',
    patientId: 'pat-3',
    doctorId: 'doc-2',
    transcriptionId: 'trans-1',
    soapNotes: {
      subjective:
        'Patient reports occasional mild chest tightness with exertion. No acute chest pain at rest. Compliant with current medication regimen.',
      objective:
        'BP 138/84, HR 68, SpO2 98%. Heart sounds regular, no murmurs. Lungs clear bilaterally. No peripheral edema. Recent LDL 95 mg/dL (at goal). Echo shows EF 55%.',
      assessment:
        'Stable coronary artery disease with well-controlled hyperlipidemia. Current management is effective.',
      plan: '1. Continue atorvastatin 40mg daily and aspirin 81mg daily\n2. Schedule cardiac stress test in 3 months\n3. Follow up in 6 weeks\n4. Continue heart-healthy diet and moderate exercise',
    },
    symptoms: ['Chest tightness with exertion'],
    diagnoses: [
      { name: 'Coronary Artery Disease', confidence: 0.95, icdCode: 'I25.10' },
      { name: 'Hyperlipidemia', confidence: 0.9, icdCode: 'E78.5' },
    ],
    icdCodes: [
      {
        code: 'I25.10',
        description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris',
        category: 'Cardiovascular',
      },
      {
        code: 'E78.5',
        description: 'Hyperlipidemia, unspecified',
        category: 'Metabolic',
      },
    ],
    recommendations: [
      'Continue current statin therapy',
      'Schedule stress test for risk stratification',
      'Maintain low-sodium, heart-healthy diet',
      'Regular moderate aerobic exercise 30 minutes, 5 days/week',
    ],
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    approvedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'report-2',
    visitId: 'visit-5',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    transcriptionId: 'trans-2',
    soapNotes: {
      subjective:
        'Patient reports worsening joint pain in both knees and lower back, rated 6/10. Pain worse in morning and after prolonged sitting. Difficulty with stairs and rising from seated position. Acetaminophen provides minimal relief.',
      objective:
        'Physical exam: Decreased ROM bilateral knees, crepitus present. Lumbar spine limited flexion, tenderness at L4-L5. Knee X-rays show moderate degenerative changes.',
      assessment:
        'Osteoarthritis of bilateral knees and lumbar spine with progressive symptoms affecting daily activities.',
      plan: '1. Start celecoxib 200mg daily\n2. Refer to physical therapy\n3. Consider corticosteroid knee injections if no improvement in 4 weeks\n4. Patient education on weight management and low-impact exercises',
    },
    symptoms: [
      'Bilateral knee pain',
      'Lower back pain',
      'Morning stiffness',
      'Difficulty with mobility',
    ],
    diagnoses: [
      { name: 'Primary osteoarthritis, bilateral knees', confidence: 0.92, icdCode: 'M17.0' },
      { name: 'Lumbar spondylosis', confidence: 0.88, icdCode: 'M47.816' },
    ],
    icdCodes: [
      {
        code: 'M17.0',
        description: 'Primary osteoarthritis, bilateral knee',
        category: 'Musculoskeletal',
      },
      {
        code: 'M47.816',
        description: 'Spondylosis without myelopathy or radiculopathy, lumbar region',
        category: 'Musculoskeletal',
      },
    ],
    recommendations: [
      'NSAID therapy with GI protection',
      'Physical therapy for strengthening and flexibility',
      'Weight loss counseling',
      'Low-impact exercises (swimming, cycling)',
    ],
    status: 'approved',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    approvedAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export const demoMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosageForm: 'Tablet',
    strength: '500mg',
    category: 'Antidiabetic',
  },
  {
    id: 'med-2',
    name: 'Lisinopril',
    genericName: 'Lisinopril',
    dosageForm: 'Tablet',
    strength: '10mg',
    category: 'ACE Inhibitor',
  },
  {
    id: 'med-3',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    dosageForm: 'Tablet',
    strength: '40mg',
    category: 'Statin',
  },
  {
    id: 'med-4',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    dosageForm: 'Capsule',
    strength: '20mg',
    category: 'Proton Pump Inhibitor',
  },
  {
    id: 'med-5',
    name: 'Celecoxib',
    genericName: 'Celecoxib',
    dosageForm: 'Capsule',
    strength: '200mg',
    category: 'NSAID',
    interactions: ['Warfarin', 'Lithium', 'ACE Inhibitors'],
  },
  {
    id: 'med-6',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    dosageForm: 'Tablet',
    strength: '5mg',
    category: 'Calcium Channel Blocker',
  },
  {
    id: 'med-7',
    name: 'Albuterol',
    genericName: 'Albuterol Sulfate',
    dosageForm: 'Inhaler',
    strength: '90mcg',
    category: 'Bronchodilator',
  },
  {
    id: 'med-8',
    name: 'Prednisone',
    genericName: 'Prednisone',
    dosageForm: 'Tablet',
    strength: '10mg',
    category: 'Corticosteroid',
  },
]

export const demoPrescriptions: Prescription[] = [
  {
    id: 'presc-1',
    visitId: 'visit-5',
    patientId: 'pat-5',
    doctorId: 'doc-1',
    items: [
      {
        medicineId: 'med-5',
        medicineName: 'Celecoxib 200mg',
        dosage: '200mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food to minimize stomach upset',
        quantity: 30,
      },
    ],
    notes: 'Patient advised to report any signs of GI bleeding or cardiovascular symptoms.',
    status: 'issued',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    issuedAt: new Date(Date.now() - 172800000).toISOString(),
    validUntil: new Date(Date.now() + 2592000000).toISOString(),
  },
]

export const demoDashboardStats: DashboardStats = {
  todayPatients: 12,
  pendingReports: 3,
  completedVisits: 8,
  aiUsageToday: 24,
}

// Helper functions
export function getPatientById(id: string): Patient | undefined {
  return demoPatients.find((p) => p.id === id)
}

export function getVisitsByPatientId(patientId: string): Visit[] {
  return demoVisits.filter((v) => v.patientId === patientId)
}

export function getTranscriptionById(id: string): Transcription | undefined {
  return demoTranscriptions.find((t) => t.id === id)
}

export function getReportById(id: string): MedicalReport | undefined {
  return demoReports.find((r) => r.id === id)
}

export function getReportByVisitId(visitId: string): MedicalReport | undefined {
  return demoReports.find((r) => r.visitId === visitId)
}

export function getTodaysVisits(): Visit[] {
  const today = new Date().toDateString()
  return demoVisits.filter((v) => new Date(v.date).toDateString() === today)
}
