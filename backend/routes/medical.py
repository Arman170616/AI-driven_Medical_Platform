"""API routes for medical AI features"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from uuid import uuid4
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
from ai_service import MedicalAIService

router = APIRouter(prefix="/medical", tags=["medical"])
ai_service = MedicalAIService()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(
    file: UploadFile = File(...),
    patient_context: str = None,
    visit_id: str = None,
    db: Session = Depends(get_db)
):
    """Transcribe audio file (placeholder - would integrate Groq/Whisper)"""
    
    # Read file content
    content = await file.read()
    
    # Placeholder transcription - in production, send to Groq Whisper API
    transcription_text = "Patient presents with chief complaint of fatigue and chest discomfort."
    
    db_transcription = Transcription(
        id=str(uuid4()),
        visit_id=visit_id,
        text=transcription_text,
        duration=0.0,
    )
    
    if visit_id:
        visit = db.query(Visit).filter(Visit.id == visit_id).first()
        if visit:
            visit.transcription_id = db_transcription.id
    
    db.add(db_transcription)
    db.commit()
    db.refresh(db_transcription)
    return db_transcription


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
