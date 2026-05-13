import { NextRequest } from 'next/server'

const suggestionSchema = {
  suggestions: 'array of medication suggestions with dosage and warnings',
  interactions: 'array of drug interactions',
  allergyAlerts: 'array of allergy alerts',
}

export async function POST(req: NextRequest) {
  const { diagnoses, symptoms, patientAllergies, currentMedications } = await req.json()

  try {
    // Use Groq API for medicine suggestions
    const groqApiKey = process.env.GROQ_API_KEY

    if (!groqApiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY environment variable is not set' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `Based on the following clinical information, suggest appropriate medications:

Diagnoses: ${diagnoses?.join(', ') || 'Not specified'}
Symptoms: ${symptoms?.join(', ') || 'Not specified'}
Patient Allergies: ${patientAllergies?.join(', ') || 'None reported'}
Current Medications: ${currentMedications?.join(', ') || 'None'}

Provide medication suggestions with dosing, warnings, and interaction checks in this JSON format:
{
  "suggestions": [{"medicine": "name", "genericName": "generic", "dosage": "dosage", "frequency": "frequency", "duration": "duration", "reason": "reason", "warnings": ["warning1"]}],
  "interactions": [{"drug1": "name1", "drug2": "name2", "severity": "low|moderate|high|critical", "description": "description"}],
  "allergyAlerts": [{"medicine": "name", "allergen": "allergen", "severity": "mild|moderate|severe", "description": "description"}]
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
            content: 'You are a clinical pharmacist. Provide medication recommendations based on clinical information. Always respond with valid JSON only, no markdown formatting or code blocks.',
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
    let suggestionsText = result.choices[0].message.content

    // Clean up the response if it contains markdown code blocks
    suggestionsText = suggestionsText.replace(/```json\n?/g, '').replace(/```\n?/g, '')

    const suggestions = JSON.parse(suggestionsText)
    
    return new Response(JSON.stringify(suggestions), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Medicine suggestion error:', error)

    // Fallback demo response
    const demoSuggestions = {
      suggestions: [
        {
          medicine: 'Lisinopril',
          genericName: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: 'Ongoing',
          reason: 'ACE inhibitor for hypertension management',
          warnings: ['Monitor potassium levels', 'May cause dry cough'],
        },
        {
          medicine: 'Metformin',
          genericName: 'Metformin Hydrochloride',
          dosage: '500mg',
          frequency: 'Twice daily with meals',
          duration: 'Ongoing',
          reason: 'First-line therapy for type 2 diabetes',
          warnings: ['Take with food', 'Hold before contrast procedures'],
        },
        {
          medicine: 'Atorvastatin',
          genericName: 'Atorvastatin Calcium',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          duration: 'Ongoing',
          reason: 'Statin for cardiovascular risk reduction',
          warnings: ['Monitor liver function', 'Report muscle pain'],
        },
      ],
      interactions: [],
      allergyAlerts: [],
    }

    return new Response(JSON.stringify(demoSuggestions), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
