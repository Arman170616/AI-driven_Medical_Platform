"""API routes for medical AI features"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
import json
from database import Transcription, Report, Visit
from schemas import (
    GenerateReportRequest, 
    GenerateReportResponse,
    MedicineSuggestionRequest,
    MedicineSuggestionResponse,
    TranscriptionResponse,
    ReportResponse,
)
from dependencies import get_db

try:
    from ai_service import MedicalAIService
except Exception as e:
    print(f"Warning: Failed to import AI service: {e}")
    class MedicalAIService:
        def __init__(self):
            self.client = None

router = APIRouter(prefix="/medical", tags=["medical"])

# Initialize AI service with error handling
try:
    ai_service = MedicalAIService()
except Exception as e:
    print(f"Warning: Failed to initialize AI service: {e}")
    ai_service = None


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    patient_context: str = None,
    visit_id: str = None,
):
    """Transcribe audio file using Google Speech-to-Text API"""
    
    try:
        # Read file content
        content = await file.read()
        
        from config import get_settings
        
        settings = get_settings()
        
        if not settings.google_gemini_api_key:
            raise HTTPException(status_code=500, detail="GOOGLE_GEMINI_API_KEY not configured")
        
        # Use requests for transcription
        import requests
        import base64
        
        try:
            # Encode audio to base64
            audio_base64 = base64.b64encode(content).decode('utf-8')
            
            # Determine audio MIME type
            mime_type = file.content_type or 'audio/webm'
            if 'mp3' in mime_type or 'mpeg' in mime_type:
                mime_type = 'audio/mpeg'
            elif 'wav' in mime_type:
                mime_type = 'audio/wav'
            elif 'webm' in mime_type:
                mime_type = 'audio/webm'
            else:
                mime_type = 'audio/webm'
            
            # Google Cloud Speech-to-Text API endpoint
            url = 'https://speech.googleapis.com/v1/speech:recognize'
            
            payload = {
                'config': {
                    'encoding': 'LINEAR16' if 'wav' in mime_type else 'WEBM_OPUS',
                    'sampleRateHertz': 16000,
                    'languageCode': 'en-US',
                    'model': 'latest_long',
                },
                'audio': {
                    'content': audio_base64
                }
            }
            
            headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': settings.google_gemini_api_key
            }
            
            response = requests.post(
                url,
                json=payload,
                headers=headers,
                timeout=60
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"Google Speech-to-Text API error: {response.text}")
            
            result = response.json()
            # Extract transcription from Google API response
            transcription_text = ''
            if 'results' in result and result['results']:
                for result_item in result['results']:
                    if 'alternatives' in result_item:
                        transcription_text += result_item['alternatives'][0].get('transcript', '')
            
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"Transcription service error: {str(e)}")
        
        # Return transcription
        return TranscriptionResponse(
            id=str(uuid4()),
            visit_id=visit_id,
            text=transcription_text,
            duration=0.0,
            created_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")


@router.post("/generate-report", response_model=GenerateReportResponse)
async def generate_report(
    request: GenerateReportRequest,
    db: Session = Depends(get_db)
):
    """Generate medical report from transcription using AI"""
    
    if not request.transcription:
        raise HTTPException(status_code=400, detail="Transcription is required")
    
    try:
        # Use AI service to generate report
        report_data = await ai_service.generate_report(
            request.transcription,
            request.patient_context
        )
        
        return report_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")


@router.post("/save-report", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def save_report(
    visit_id: str,
    report_data: GenerateReportResponse,
    db: Session = Depends(get_db)
):
    """Save generated report to database"""
    
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    db_report = Report(
        id=str(uuid4()),
        visit_id=visit_id,
        subjective=report_data.soap_notes.subjective,
        objective=report_data.soap_notes.objective,
        assessment=report_data.soap_notes.assessment,
        plan=report_data.soap_notes.plan,
        symptoms=json.dumps([s for s in report_data.symptoms]),
        diagnoses=json.dumps([d.dict() for d in report_data.diagnoses]),
        icd_codes=json.dumps([icd.dict() for icd in report_data.icd_codes]),
        medications=json.dumps([m.dict() for m in report_data.medications]),
        recommendations=json.dumps([r for r in report_data.recommendations]),
    )
    
    visit.report_id = db_report.id
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@router.get("/report/{report_id}", response_model=ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    """Get report by ID"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/suggest-medicines", response_model=MedicineSuggestionResponse)
async def suggest_medicines(request: MedicineSuggestionRequest):
    """Suggest medicines based on clinical information"""
    
    try:
        suggestions = await ai_service.suggest_medicines(
            request.diagnoses or [],
            request.symptoms or [],
            request.patient_allergies or [],
            request.current_medications or []
        )
        
        return suggestions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error suggesting medicines: {str(e)}")


@router.get("/transcription/{transcription_id}", response_model=TranscriptionResponse)
def get_transcription(transcription_id: str, db: Session = Depends(get_db)):
    """Get transcription by ID"""
    transcription = db.query(Transcription).filter(Transcription.id == transcription_id).first()
    if not transcription:
        raise HTTPException(status_code=404, detail="Transcription not found")
    return transcription
