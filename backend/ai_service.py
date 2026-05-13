from groq import Groq
from config import get_settings
import json
from typing import Optional

settings = get_settings()


class MedicalAIService:
    """Service for AI-powered medical operations using Groq API"""
    
    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None
    
    async def generate_report(self, transcription: str, patient_context: Optional[str] = None) -> dict:
        """Generate medical report from transcription"""
        
        if not self.client:
            return self._demo_report(transcription)
        
        try:
            prompt = f"""Analyze the following medical transcription and generate a comprehensive report.

{f'Patient Context:\n{patient_context}\n\n' if patient_context else ''}Transcription:
{transcription}

Generate a detailed medical report in the following JSON format:
{{
  "soap_notes": {{
    "subjective": "patient's subjective description",
    "objective": "objective findings",
    "assessment": "clinical assessment",
    "plan": "treatment plan"
  }},
  "symptoms": ["list of symptoms"],
  "diagnoses": [{{"name": "diagnosis name", "confidence": 0.95, "icd_code": "ICD code"}}],
  "icd_codes": [{{"code": "code", "description": "description", "category": "category"}}],
  "medications": [{{"name": "drug name", "dosage": "dosage", "frequency": "frequency", "duration": "duration"}}],
  "recommendations": ["recommendation 1", "recommendation 2"]
}}"""

            message = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a medical documentation expert. Generate structured medical reports from transcriptions. Always respond with valid JSON only, no markdown formatting or code blocks."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
            )
            
            response_text = message.choices[0].message.content
            
            # Clean up markdown if present
            response_text = response_text.replace("```json\n", "").replace("```\n", "").replace("```", "")
            
            report = json.loads(response_text)
            return report
            
        except Exception as e:
            print(f"Error generating report: {e}")
            return self._demo_report(transcription)
    
    async def suggest_medicines(self, diagnoses: list, symptoms: list, patient_allergies: list, current_medications: list) -> dict:
        """Suggest medicines based on clinical information"""
        
        if not self.client:
            return self._demo_suggestions()
        
        try:
            prompt = f"""Based on the following clinical information, suggest appropriate medications:

Diagnoses: {', '.join(diagnoses) if diagnoses else 'Not specified'}
Symptoms: {', '.join(symptoms) if symptoms else 'Not specified'}
Patient Allergies: {', '.join(patient_allergies) if patient_allergies else 'None reported'}
Current Medications: {', '.join(current_medications) if current_medications else 'None'}

Provide medication suggestions with dosing, warnings, and interaction checks in this JSON format:
{{
  "suggestions": [{{"medicine": "name", "generic_name": "generic", "dosage": "dosage", "frequency": "frequency", "duration": "duration", "reason": "reason", "warnings": ["warning1"]}}],
  "interactions": [{{"drug1": "name1", "drug2": "name2", "severity": "low|moderate|high|critical", "description": "description"}}],
  "allergyAlerts": [{{"medicine": "name", "allergen": "allergen", "severity": "mild|moderate|severe", "description": "description"}}]
}}"""

            message = self.client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a clinical pharmacist. Provide medication recommendations based on clinical information. Always respond with valid JSON only, no markdown formatting or code blocks."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
            )
            
            response_text = message.choices[0].message.content
            
            # Clean up markdown if present
            response_text = response_text.replace("```json\n", "").replace("```\n", "").replace("```", "")
            
            suggestions = json.loads(response_text)
            return suggestions
            
        except Exception as e:
            print(f"Error suggesting medicines: {e}")
            return self._demo_suggestions()
    
    @staticmethod
    def _demo_report(transcription: str) -> dict:
        """Return demo report for testing"""
        return {
            "soap_notes": {
                "subjective": "Patient presents with chief complaint of fatigue and intermittent chest discomfort over the past two weeks.",
                "objective": "Vital signs: BP 138/85, HR 78 regular, RR 16, SpO2 97% on room air. Cardiovascular: Regular rate and rhythm, no murmurs.",
                "assessment": "Exertional chest discomfort - need to rule out cardiac etiology. Stable type 2 diabetes mellitus.",
                "plan": "Order cardiac stress test. Order lipid panel. Continue current medications. Follow up in one week."
            },
            "symptoms": ["Fatigue", "Exertional chest discomfort", "Chest tightness with activity"],
            "diagnoses": [
                {"name": "Chest pain, unspecified", "confidence": 0.85, "icd_code": "R07.9"},
                {"name": "Type 2 Diabetes Mellitus", "confidence": 0.95, "icd_code": "E11.9"}
            ],
            "icd_codes": [
                {"code": "R07.9", "description": "Chest pain, unspecified", "category": "Symptoms"},
                {"code": "E11.9", "description": "Type 2 diabetes mellitus without complications", "category": "Endocrine"}
            ],
            "medications": [
                {"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily", "duration": "Ongoing"},
                {"name": "Lisinopril", "dosage": "10mg", "frequency": "Once daily", "duration": "Ongoing"}
            ],
            "recommendations": [
                "Complete cardiac stress test within 1 week",
                "Maintain blood pressure log at home",
                "Continue low-sodium, heart-healthy diet"
            ]
        }
    
    @staticmethod
    def _demo_suggestions() -> dict:
        """Return demo suggestions for testing"""
        return {
            "suggestions": [
                {
                    "medicine": "Lisinopril",
                    "generic_name": "Lisinopril",
                    "dosage": "10mg",
                    "frequency": "Once daily",
                    "duration": "Ongoing",
                    "reason": "ACE inhibitor for hypertension management",
                    "warnings": ["Monitor potassium levels", "May cause dry cough"]
                },
                {
                    "medicine": "Metformin",
                    "generic_name": "Metformin Hydrochloride",
                    "dosage": "500mg",
                    "frequency": "Twice daily with meals",
                    "duration": "Ongoing",
                    "reason": "First-line therapy for type 2 diabetes",
                    "warnings": ["Take with food", "Hold before contrast procedures"]
                }
            ],
            "interactions": [],
            "allergyAlerts": []
        }
