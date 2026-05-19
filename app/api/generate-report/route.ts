import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { transcription, patientContext } = await req.json()

  if (!transcription) {
    return new Response(JSON.stringify({ error: 'No transcription provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Proxy request to FastAPI backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    console.log(`[Generate Report] Sending request to ${backendUrl}/medical/generate-report`)
    
    const response = await fetch(`${backendUrl}/medical/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcription,
        patient_context: patientContext,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Generate Report] Backend error: ${response.status} - ${errorText}`)
      throw new Error(`Backend error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[Generate Report] Received data:`, data)
    
    // Transform snake_case from backend to camelCase for frontend
    const report = {
      soapNotes: {
        subjective: data.soap_notes?.subjective || '',
        objective: data.soap_notes?.objective || '',
        assessment: data.soap_notes?.assessment || '',
        plan: data.soap_notes?.plan || '',
      },
      symptoms: data.symptoms || [],
      diagnoses: (data.diagnoses || []).map((d: any) => ({
        name: d.name || '',
        confidence: d.confidence || 0,
        icdCode: d.icd_code || null,
      })),
      icdCodes: (data.icd_codes || []).map((ic: any) => ({
        code: ic.code || '',
        description: ic.description || '',
        category: ic.category || '',
      })),
      medications: (data.medications || []).map((m: any) => ({
        name: m.name || '',
        dosage: m.dosage || '',
        frequency: m.frequency || '',
        duration: m.duration || '',
      })),
      recommendations: data.recommendations || [],
    }
    
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[Generate Report] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate report', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
