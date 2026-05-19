/**
 * API Client Configuration
 * Routes all frontend API calls through Next.js API routes
 */

const API_BASE_URL = '/api'

/**
 * Fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed: ${url}`, error)
    throw error
  }
}

// ==================== Medical/AI Endpoints ====================

export async function generateReport(
  transcription: string,
  patientContext?: string
) {
  return apiCall('/generate-report', {
    method: 'POST',
    body: JSON.stringify({
      transcription,
      patientContext,
    }),
  })
}

export async function suggestMedicines(
  diagnoses?: string[],
  symptoms?: string[],
  patientAllergies?: string[],
  currentMedications?: string[]
) {
  return apiCall('/suggest-medicines', {
    method: 'POST',
    body: JSON.stringify({
      diagnoses,
      symptoms,
      patientAllergies,
      currentMedications,
    }),
  })
}

export async function transcribeAudio(
  audioBlob: Blob,
  patientContext?: string,
  visitId?: string
) {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  if (patientContext) formData.append('patientContext', patientContext)
  if (visitId) formData.append('visitId', visitId)

  const url = `${API_BASE_URL}/transcribe`
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status}`)
  }

  return response
}

export async function getReport(reportId: string) {
  return apiCall(`/medical/report/${reportId}`)
}

export async function saveReport(visitId: string, reportData: any) {
  return apiCall(`/medical/save-report?visit_id=${visitId}`, {
    method: 'POST',
    body: JSON.stringify(reportData),
  })
}

export async function getTranscription(transcriptionId: string) {
  return apiCall(`/medical/transcription/${transcriptionId}`)
}

// ==================== Patient Endpoints ====================

export async function createPatient(patientData: any) {
  return apiCall('/patients/', {
    method: 'POST',
    body: JSON.stringify(patientData),
  })
}

export async function getPatient(patientId: string) {
  return apiCall(`/patients/${patientId}`)
}

export async function listPatients(skip: number = 0, limit: number = 100) {
  return apiCall(`/patients/?skip=${skip}&limit=${limit}`)
}

export async function updatePatient(patientId: string, patientData: any) {
  return apiCall(`/patients/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(patientData),
  })
}

export async function deletePatient(patientId: string) {
  return apiCall(`/patients/${patientId}`, {
    method: 'DELETE',
  })
}

// ==================== Visit Endpoints ====================

export async function createVisit(visitData: any) {
  return apiCall('/visits/', {
    method: 'POST',
    body: JSON.stringify(visitData),
  })
}

export async function getVisit(visitId: string) {
  return apiCall(`/visits/${visitId}`)
}

export async function listVisits(skip: number = 0, limit: number = 100) {
  return apiCall(`/visits/?skip=${skip}&limit=${limit}`)
}

export async function getPatientVisits(patientId: string, skip: number = 0, limit: number = 100) {
  return apiCall(`/visits/patient/${patientId}?skip=${skip}&limit=${limit}`)
}

export async function updateVisit(visitId: string, visitData: any) {
  return apiCall(`/visits/${visitId}`, {
    method: 'PUT',
    body: JSON.stringify(visitData),
  })
}

export async function deleteVisit(visitId: string) {
  return apiCall(`/visits/${visitId}`, {
    method: 'DELETE',
  })
}

// ==================== User Endpoints ====================

export async function createUser(userData: any) {
  return apiCall('/users/', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function getUser(userId: string) {
  return apiCall(`/users/${userId}`)
}

export async function listUsers(role?: string, skip: number = 0, limit: number = 100) {
  let query = `?skip=${skip}&limit=${limit}`
  if (role) query += `&role=${role}`
  return apiCall(`/users/${query}`)
}

export async function updateUser(userId: string, userData: any) {
  return apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(userId: string) {
  return apiCall(`/users/${userId}`, {
    method: 'DELETE',
  })
}

// ==================== Prescription Endpoints ====================

export async function createPrescription(prescriptionData: any) {
  return apiCall('/prescriptions/', {
    method: 'POST',
    body: JSON.stringify(prescriptionData),
  })
}

export async function getPrescription(prescriptionId: string) {
  return apiCall(`/prescriptions/${prescriptionId}`)
}

export async function listPrescriptions(skip: number = 0, limit: number = 100) {
  return apiCall(`/prescriptions/?skip=${skip}&limit=${limit}`)
}

export async function getPatientPrescriptions(patientId: string, skip: number = 0, limit: number = 100) {
  return apiCall(`/prescriptions/patient/${patientId}?skip=${skip}&limit=${limit}`)
}

export async function getVisitPrescriptions(visitId: string) {
  return apiCall(`/prescriptions/visit/${visitId}`)
}

export async function updatePrescription(prescriptionId: string, prescriptionData: any) {
  return apiCall(`/prescriptions/${prescriptionId}`, {
    method: 'PUT',
    body: JSON.stringify(prescriptionData),
  })
}

export async function deletePrescription(prescriptionId: string) {
  return apiCall(`/prescriptions/${prescriptionId}`, {
    method: 'DELETE',
  })
}

// ==================== Health Check ====================

export async function healthCheck() {
  try {
    return await apiCall('/health')
  } catch (error) {
    console.error('Backend health check failed:', error)
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
