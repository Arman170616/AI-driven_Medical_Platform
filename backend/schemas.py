from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: str  # admin, doctor, nurse, receptionist
    specialty: Optional[str] = None
    license_number: Optional[str] = None
    avatar: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Patient schemas
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    date_of_birth: str
    blood_type: str
    phone: str
    email: str
    address: str
    allergies: List[str]
    chronic_conditions: List[str]
    emergency_contact_name: str
    emergency_contact_phone: str
    emergency_contact_relationship: str
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    blood_type: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_id: Optional[str] = None


class PatientResponse(PatientBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Vitals schemas
class Vitals(BaseModel):
    systolic_bp: Optional[int] = None
    diastolic_bp: Optional[int] = None
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    temperature: Optional[float] = None
    oxygen_saturation: Optional[float] = None
    weight: Optional[float] = None
    height: Optional[float] = None


# Visit schemas
class VisitBase(BaseModel):
    patient_id: str
    doctor_id: str
    date: datetime
    chief_complaint: str
    status: str = "scheduled"
    notes: Optional[str] = None


class VisitCreate(VisitBase):
    vitals: Optional[Vitals] = None


class VisitUpdate(BaseModel):
    chief_complaint: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    vitals: Optional[Vitals] = None


class VisitResponse(VisitBase):
    id: str
    created_at: datetime
    updated_at: datetime
    transcription_id: Optional[str] = None
    report_id: Optional[str] = None

    class Config:
        from_attributes = True


# Transcription schemas
class TranscriptionCreate(BaseModel):
    visit_id: Optional[str] = None
    text: str
    duration: Optional[float] = None


class TranscriptionResponse(BaseModel):
    id: str
    visit_id: Optional[str] = None
    text: str
    duration: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Report schemas
class SoapNotes(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str


class Diagnosis(BaseModel):
    name: str
    confidence: float
    icd_code: Optional[str] = None


class IcdCode(BaseModel):
    code: str
    description: str
    category: str


class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str


class ReportCreate(BaseModel):
    visit_id: str
    soap_notes: SoapNotes
    symptoms: List[str]
    diagnoses: List[Diagnosis]
    icd_codes: List[IcdCode]
    medications: List[Medication]
    recommendations: List[str]


class ReportResponse(BaseModel):
    id: str
    visit_id: str
    soap_notes: SoapNotes
    symptoms: List[str]
    diagnoses: List[Diagnosis]
    icd_codes: List[IcdCode]
    medications: List[Medication]
    recommendations: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Prescription schemas
class PrescriptionBase(BaseModel):
    medicine_name: str
    generic_name: Optional[str] = None
    dosage: str
    frequency: str
    duration: str
    reason: str
    warnings: List[str] = []


class PrescriptionCreate(PrescriptionBase):
    patient_id: str
    visit_id: Optional[str] = None


class PrescriptionUpdate(BaseModel):
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None
    reason: Optional[str] = None
    warnings: Optional[List[str]] = None
    is_active: Optional[bool] = None


class PrescriptionResponse(PrescriptionBase):
    id: str
    patient_id: str
    visit_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Medicine suggestion schemas
class MedicineSuggestion(BaseModel):
    medicine: str
    generic_name: str
    dosage: str
    frequency: str
    duration: str
    reason: str
    warnings: List[str]


class DrugInteractionInfo(BaseModel):
    drug1: str
    drug2: str
    severity: str
    description: str


class AllergyAlert(BaseModel):
    medicine: str
    allergen: str
    severity: str
    description: str


class MedicineSuggestionResponse(BaseModel):
    suggestions: List[MedicineSuggestion]
    interactions: List[DrugInteractionInfo]
    allergyAlerts: List[AllergyAlert]


# Generate report request
class GenerateReportRequest(BaseModel):
    transcription: str
    patient_context: Optional[str] = None


class GenerateReportResponse(BaseModel):
    soap_notes: SoapNotes
    symptoms: List[str]
    diagnoses: List[Diagnosis]
    icd_codes: List[IcdCode]
    medications: List[Medication]
    recommendations: List[str]


# Medicine suggestion request
class MedicineSuggestionRequest(BaseModel):
    diagnoses: Optional[List[str]] = None
    symptoms: Optional[List[str]] = None
    patient_allergies: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
