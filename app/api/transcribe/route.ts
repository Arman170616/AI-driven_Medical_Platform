import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioBlob = formData.get('audio') as Blob
    const patientContext = formData.get('patientContext') as string | null
    const visitId = formData.get('visitId') as string | null

    if (!audioBlob) {
      return new Response(JSON.stringify({ error: 'No audio provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if blob has size
    if (audioBlob.size === 0) {
      return new Response(JSON.stringify({ error: 'Audio file is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Proxy request to FastAPI backend with file upload
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    
    const backendFormData = new FormData()
    backendFormData.append('file', audioBlob, 'audio.webm')
    if (patientContext) {
      backendFormData.append('patient_context', patientContext)
    }
    if (visitId) {
      backendFormData.append('visit_id', visitId)
    }

    console.log(`[Transcribe] Sending to backend: ${backendUrl}/medical/transcribe, blob size: ${audioBlob.size}`)

    const response = await fetch(`${backendUrl}/medical/transcribe`, {
      method: 'POST',
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[Transcribe] Backend error: ${response.status} - ${errorText}`)
      throw new Error(`Backend error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`[Transcribe] Success: ${data.id}`)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[Transcribe] Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to transcribe audio', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
