"""API routes for patients"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import uuid4
import json
from database import Patient
from schemas import PatientCreate, PatientResponse, PatientUpdate
from dependencies import get_db

router = APIRouter(prefix="/patients", tags=["patients"])


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    db_patient = Patient(
        id=str(uuid4()),
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        date_of_birth=patient.date_of_birth,
        blood_type=patient.blood_type,
        phone=patient.phone,
        email=patient.email,
        address=patient.address,
        allergies=json.dumps(patient.allergies),
        chronic_conditions=json.dumps(patient.chronic_conditions),
        emergency_contact_name=patient.emergency_contact_name,
        emergency_contact_phone=patient.emergency_contact_phone,
        emergency_contact_relationship=patient.emergency_contact_relationship,
        insurance_provider=patient.insurance_provider,
        insurance_id=patient.insurance_id,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get patient by ID"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/", response_model=list[PatientResponse])
def list_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all patients"""
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, patient_update: PatientUpdate, db: Session = Depends(get_db)):
    """Update patient information"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = patient_update.dict(exclude_unset=True)
    
    if "allergies" in update_data:
        update_data["allergies"] = json.dumps(update_data["allergies"])
    if "chronic_conditions" in update_data:
        update_data["chronic_conditions"] = json.dumps(update_data["chronic_conditions"])
    
    for field, value in update_data.items():
        setattr(patient, field, value)
    
    db.commit()
    db.refresh(patient)
    return patient


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: str, db: Session = Depends(get_db)):
    """Delete a patient"""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    db.delete(patient)
    db.commit()
    return None
