"""API routes for visits"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4
from datetime import datetime
from database import Visit
from schemas import VisitCreate, VisitUpdate, VisitResponse, Vitals as VitalsSchema
from dependencies import get_db

router = APIRouter(prefix="/visits", tags=["visits"])


@router.post("/", response_model=VisitResponse, status_code=status.HTTP_201_CREATED)
def create_visit(visit: VisitCreate, db: Session = Depends(get_db)):
    """Create a new visit/appointment"""
    db_visit = Visit(
        id=str(uuid4()),
        patient_id=visit.patient_id,
        doctor_id=visit.doctor_id,
        date=visit.date,
        chief_complaint=visit.chief_complaint,
        status=visit.status,
        notes=visit.notes,
    )
    
    if visit.vitals:
        db_visit.systolic_bp = visit.vitals.systolic_bp
        db_visit.diastolic_bp = visit.vitals.diastolic_bp
        db_visit.heart_rate = visit.vitals.heart_rate
        db_visit.respiratory_rate = visit.vitals.respiratory_rate
        db_visit.temperature = visit.vitals.temperature
        db_visit.oxygen_saturation = visit.vitals.oxygen_saturation
        db_visit.weight = visit.vitals.weight
        db_visit.height = visit.vitals.height
    
    db.add(db_visit)
    db.commit()
    db.refresh(db_visit)
    return db_visit


@router.get("/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: str, db: Session = Depends(get_db)):
    """Get visit by ID"""
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    return visit


@router.get("/patient/{patient_id}", response_model=list[VisitResponse])
def get_patient_visits(patient_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all visits for a patient"""
    visits = db.query(Visit).filter(Visit.patient_id == patient_id).offset(skip).limit(limit).all()
    return visits


@router.get("/", response_model=list[VisitResponse])
def list_visits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all visits"""
    visits = db.query(Visit).offset(skip).limit(limit).all()
    return visits


@router.put("/{visit_id}", response_model=VisitResponse)
def update_visit(visit_id: str, visit_update: VisitUpdate, db: Session = Depends(get_db)):
    """Update visit information"""
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    update_data = visit_update.dict(exclude_unset=True)
    
    if "vitals" in update_data and update_data["vitals"]:
        vitals = update_data.pop("vitals")
        visit.systolic_bp = vitals.get("systolic_bp")
        visit.diastolic_bp = vitals.get("diastolic_bp")
        visit.heart_rate = vitals.get("heart_rate")
        visit.respiratory_rate = vitals.get("respiratory_rate")
        visit.temperature = vitals.get("temperature")
        visit.oxygen_saturation = vitals.get("oxygen_saturation")
        visit.weight = vitals.get("weight")
        visit.height = vitals.get("height")
    
    for field, value in update_data.items():
        setattr(visit, field, value)
    
    visit.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(visit)
    return visit


@router.delete("/{visit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_visit(visit_id: str, db: Session = Depends(get_db)):
    """Delete a visit"""
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    db.delete(visit)
    db.commit()
    return None
