"""API routes for prescriptions"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4
import json
from database import Prescription
from schemas import PrescriptionCreate, PrescriptionUpdate, PrescriptionResponse
from dependencies import get_db

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])


@router.post("/", response_model=PrescriptionResponse, status_code=status.HTTP_201_CREATED)
def create_prescription(prescription: PrescriptionCreate, db: Session = Depends(get_db)):
    """Create a new prescription"""
    db_prescription = Prescription(
        id=str(uuid4()),
        patient_id=prescription.patient_id,
        visit_id=prescription.visit_id,
        medicine_name=prescription.medicine_name,
        generic_name=prescription.generic_name,
        dosage=prescription.dosage,
        frequency=prescription.frequency,
        duration=prescription.duration,
        reason=prescription.reason,
        warnings=json.dumps(prescription.warnings),
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


@router.get("/{prescription_id}", response_model=PrescriptionResponse)
def get_prescription(prescription_id: str, db: Session = Depends(get_db)):
    """Get prescription by ID"""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return prescription


@router.get("/patient/{patient_id}", response_model=list[PrescriptionResponse])
def get_patient_prescriptions(patient_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all prescriptions for a patient"""
    prescriptions = db.query(Prescription).filter(
        Prescription.patient_id == patient_id,
        Prescription.is_active == True
    ).offset(skip).limit(limit).all()
    return prescriptions


@router.get("/visit/{visit_id}", response_model=list[PrescriptionResponse])
def get_visit_prescriptions(visit_id: str, db: Session = Depends(get_db)):
    """Get all prescriptions for a visit"""
    prescriptions = db.query(Prescription).filter(Prescription.visit_id == visit_id).all()
    return prescriptions


@router.get("/", response_model=list[PrescriptionResponse])
def list_prescriptions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all prescriptions"""
    prescriptions = db.query(Prescription).offset(skip).limit(limit).all()
    return prescriptions


@router.put("/{prescription_id}", response_model=PrescriptionResponse)
def update_prescription(prescription_id: str, prescription_update: PrescriptionUpdate, db: Session = Depends(get_db)):
    """Update prescription information"""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    update_data = prescription_update.dict(exclude_unset=True)
    
    if "warnings" in update_data:
        update_data["warnings"] = json.dumps(update_data["warnings"])
    
    for field, value in update_data.items():
        setattr(prescription, field, value)
    
    db.commit()
    db.refresh(prescription)
    return prescription


@router.delete("/{prescription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prescription(prescription_id: str, db: Session = Depends(get_db)):
    """Deactivate a prescription"""
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    prescription.is_active = False
    db.commit()
    return None
