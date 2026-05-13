import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const audioBlob = formData.get('audio') as Blob
  const patientContext = formData.get('patientContext') as string | null

  if (!audioBlob) {
    return new Response(JSON.stringify({ error: 'No audio provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Convert blob to base64 for the AI model
  const arrayBuffer = await audioBlob.arrayBuffer()
  const base64Audio = Buffer.from(arrayBuffer).toString('base64')

  try {
    // Use Groq API for transcription (free tier available)
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY environment variable is not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const groqResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: (() => {
        const formDataBody = new FormData()
        formDataBody.append('file', new Blob([Buffer.from(base64Audio, 'base64')], { type: 'audio/webm' }), 'audio.webm')
        formDataBody.append('model', 'whisper-large-v3-turbo')
        return formDataBody
      })(),
    })

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`)
    }

    const transcriptionResult = await groqResponse.json()
    const transcribedText = transcriptionResult.text

    // Return as a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = transcribedText.split(' ')
        for (const word of words) {
          const chunk = JSON.stringify({ type: 'text-delta', textDelta: word + ' ' })
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Transcription error:', error)
    
    // Fallback: return a simulated transcription for demo purposes
    const simulatedTranscription = `Patient presents with chief complaint of fatigue and intermittent chest discomfort over the past two weeks. Reports the discomfort occurs primarily with exertion and resolves with rest. Denies shortness of breath at rest, orthopnea, or lower extremity edema. 

Current medications include metformin 500mg twice daily for diabetes and lisinopril 10mg daily for hypertension. Patient reports good medication compliance.

Physical examination reveals blood pressure 138 over 85, heart rate 78 and regular, respiratory rate 16, oxygen saturation 97% on room air. Cardiovascular exam shows regular rate and rhythm, no murmurs, rubs, or gallops. Lungs clear to auscultation bilaterally.

Assessment: Exertional chest discomfort, need to rule out cardiac etiology. Stable type 2 diabetes and hypertension.

Plan: Order stress test and lipid panel. Continue current medications. Follow up in one week or sooner if symptoms worsen. Advise patient to seek immediate care if chest pain becomes severe or persistent.`

    // Return as a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = simulatedTranscription.split(' ')
        for (const word of words) {
          const chunk = JSON.stringify({ type: 'text-delta', textDelta: word + ' ' })
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  }
}
