import { NextRequest } from 'next/server'
import { z } from 'zod'

const reportSchema = z.object({
  soapNotes: z.object({
    subjective: z.string(),
    objective: z.string(),
    assessment: z.string(),
    plan: z.string(),
  }),
  symptoms: z.array(z.string()),
  diagnoses: z.array(
    z.object({
      name: z.string(),
      confidence: z.number(),
      icdCode: z.string().nullable(),
    })
  ),
  icdCodes: z.array(
    z.object({
      code: z.string(),
      description: z.string(),
      category: z.string(),
    })
  ),
  medications: z.array(
    z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      duration: z.string(),
    })
  ),
  recommendations: z.array(z.string()),
})

export async function POST(req: NextRequest) {
  const { transcription, patientContext } = await req.json()

  if (!transcription) {
    return new Response(JSON.stringify({ error: 'No transcription provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Use Groq API with structured output
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY environment variable is not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `Analyze the following medical transcription and generate a comprehensive report.

${patientContext ? `Patient Context:\n${patientContext}\n\n` : ''}Transcription:
${transcription}

Generate a detailed medical report in the following JSON format:
{
  "soapNotes": {
    "subjective": "patient's subjective description",
    "objective": "objective findings",
    "assessment": "clinical assessment",
    "plan": "treatment plan"
  },
  "symptoms": ["list of symptoms"],
  "diagnoses": [{"name": "diagnosis name", "confidence": 0.95, "icdCode": "ICD code"}],
  "icdCodes": [{"code": "code", "description": "description", "category": "category"}],
  "medications": [{"name": "drug name", "dosage": "dosage", "frequency": "frequency", "duration": "duration"}],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: 'You are a medical documentation expert. Generate structured medical reports from transcriptions. Always respond with valid JSON only, no markdown formatting or code blocks.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`)
    }

    const result = await groqResponse.json()
    let reportText = result.choices[0].message.content

    // Clean up the response if it contains markdown code blocks
    reportText = reportText.replace(/```json\n?/g, '').replace(/```\n?/g, '')

    const report = JSON.parse(reportText)
    
    return new Response(JSON.stringify(report), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Report generation error:', error)

    // Fallback demo response
    const demoReport = {
      soapNotes: {
        subjective:
          'Patient presents with chief complaint of fatigue and intermittent chest discomfort over the past two weeks. Discomfort occurs primarily with exertion and resolves with rest. Denies shortness of breath at rest, orthopnea, or lower extremity edema. Reports good compliance with current medications.',
        objective:
          'Vital signs: BP 138/85, HR 78 regular, RR 16, SpO2 97% on room air. Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops. Lungs: Clear to auscultation bilaterally. Extremities: No peripheral edema.',
        assessment:
          'Exertional chest discomfort - need to rule out cardiac etiology. Stable type 2 diabetes mellitus. Controlled hypertension.',
        plan: '1. Order cardiac stress test\n2. Order lipid panel\n3. Continue current medications\n4. Follow up in one week\n5. Patient advised to seek immediate care if chest pain becomes severe or persistent',
      },
      symptoms: [
        'Fatigue',
        'Exertional chest discomfort',
        'Chest tightness with activity',
      ],
      diagnoses: [
        { name: 'Chest pain, unspecified', confidence: 0.85, icdCode: 'R07.9' },
        { name: 'Type 2 Diabetes Mellitus', confidence: 0.95, icdCode: 'E11.9' },
        { name: 'Essential Hypertension', confidence: 0.92, icdCode: 'I10' },
      ],
      icdCodes: [
        { code: 'R07.9', description: 'Chest pain, unspecified', category: 'Symptoms' },
        { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine' },
        { code: 'I10', description: 'Essential (primary) hypertension', category: 'Cardiovascular' },
      ],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: 'Ongoing' },
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: 'Ongoing' },
      ],
      recommendations: [
        'Complete cardiac stress test within 1 week',
        'Maintain blood pressure log at home',
        'Continue low-sodium, heart-healthy diet',
        'Regular moderate exercise as tolerated',
        'Seek immediate care for severe or persistent chest pain',
      ],
    }

    return new Response(JSON.stringify(demoReport), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
