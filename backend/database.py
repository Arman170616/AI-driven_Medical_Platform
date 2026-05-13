from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json

Base = declarative_base()


class User(Base):
    """User model for doctors, nurses, admins, receptionists"""
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)  # admin, doctor, nurse, receptionist
    avatar = Column(String, nullable=True)
    specialty = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    visits = relationship("Visit", back_populates="doctor")


class Patient(Base):
    """Patient model"""
    __tablename__ = "patients"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)  # male, female, other
    date_of_birth = Column(String)
    blood_type = Column(String)
    phone = Column(String)
    email = Column(String, unique=True, index=True)
    address = Column(String)
    allergies = Column(Text)  # JSON string
    chronic_conditions = Column(Text)  # JSON string
    emergency_contact_name = Column(String)
    emergency_contact_phone = Column(String)
    emergency_contact_relationship = Column(String)
    insurance_provider = Column(String, nullable=True)
    insurance_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    visits = relationship("Visit", back_populates="patient")
    prescriptions = relationship("Prescription", back_populates="patient")

    @property
    def allergies_list(self):
        return json.loads(self.allergies) if self.allergies else []

    @allergies_list.setter
    def allergies_list(self, value):
        self.allergies = json.dumps(value)

    @property
    def chronic_conditions_list(self):
        return json.loads(self.chronic_conditions) if self.chronic_conditions else []

    @chronic_conditions_list.setter
    def chronic_conditions_list(self, value):
        self.chronic_conditions = json.dumps(value)


class Visit(Base):
    """Visit/Appointment model"""
    __tablename__ = "visits"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    doctor_id = Column(String, ForeignKey("users.id"))
    date = Column(DateTime, index=True)
    chief_complaint = Column(String)
    status = Column(String)  # scheduled, in-progress, completed, cancelled
    notes = Column(Text, nullable=True)
    systolic_bp = Column(Integer, nullable=True)
    diastolic_bp = Column(Integer, nullable=True)
    heart_rate = Column(Integer, nullable=True)
    respiratory_rate = Column(Integer, nullable=True)
    temperature = Column(Float, nullable=True)
    oxygen_saturation = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    transcription_id = Column(String, ForeignKey("transcriptions.id"), nullable=True)
    report_id = Column(String, ForeignKey("reports.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    patient = relationship("Patient", back_populates="visits")
    doctor = relationship("User", back_populates="visits")
    transcription = relationship("Transcription", back_populates="visit", uselist=False)
    report = relationship("Report", back_populates="visit", uselist=False)
    prescriptions = relationship("Prescription", back_populates="visit")


class Transcription(Base):
    """Audio transcription model"""
    __tablename__ = "transcriptions"

    id = Column(String, primary_key=True, index=True)
    visit_id = Column(String, ForeignKey("visits.id"), nullable=True)
    text = Column(Text)
    duration = Column(Float, nullable=True)  # in seconds
    created_at = Column(DateTime, default=datetime.utcnow)
    
    visit = relationship("Visit", back_populates="transcription")


class Report(Base):
    """Medical report model"""
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    visit_id = Column(String, ForeignKey("visits.id"))
    subjective = Column(Text)
    objective = Column(Text)
    assessment = Column(Text)
    plan = Column(Text)
    symptoms = Column(Text)  # JSON string
    diagnoses = Column(Text)  # JSON string
    icd_codes = Column(Text)  # JSON string
    medications = Column(Text)  # JSON string
    recommendations = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    visit = relationship("Visit", back_populates="report")

    @property
    def symptoms_list(self):
        return json.loads(self.symptoms) if self.symptoms else []

    @property
    def diagnoses_list(self):
        return json.loads(self.diagnoses) if self.diagnoses else []

    @property
    def icd_codes_list(self):
        return json.loads(self.icd_codes) if self.icd_codes else []

    @property
    def medications_list(self):
        return json.loads(self.medications) if self.medications else []

    @property
    def recommendations_list(self):
        return json.loads(self.recommendations) if self.recommendations else []


class Prescription(Base):
    """Prescription model"""
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    visit_id = Column(String, ForeignKey("visits.id"), nullable=True)
    medicine_name = Column(String, index=True)
    generic_name = Column(String, nullable=True)
    dosage = Column(String)
    frequency = Column(String)
    duration = Column(String)
    reason = Column(String)
    warnings = Column(Text)  # JSON string
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    patient = relationship("Patient", back_populates="prescriptions")
    visit = relationship("Visit", back_populates="prescriptions")

    @property
    def warnings_list(self):
        return json.loads(self.warnings) if self.warnings else []


class MedicineDatabase(Base):
    """Database of medicines for suggestions"""
    __tablename__ = "medicine_database"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    generic_name = Column(String, index=True)
    category = Column(String, index=True)
    common_dosages = Column(Text)  # JSON string
    contraindications = Column(Text)  # JSON string
    side_effects = Column(Text)  # JSON string
    interactions = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)


class DrugInteraction(Base):
    """Drug interaction database"""
    __tablename__ = "drug_interactions"

    id = Column(String, primary_key=True, index=True)
    drug1 = Column(String, index=True)
    drug2 = Column(String, index=True)
    severity = Column(String)  # low, moderate, high, critical
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db_engine(database_url: str):
    """Create database engine"""
    return create_engine(
        database_url,
        connect_args={"check_same_thread": False} if "sqlite" in database_url else {}
    )


SessionLocal = None


def init_session_local(database_url: str):
    """Initialize session factory"""
    global SessionLocal
    engine = get_db_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal


def init_db(database_url: str):
    """Initialize database"""
    engine = get_db_engine(database_url)
    Base.metadata.create_all(bind=engine)
    return engine
