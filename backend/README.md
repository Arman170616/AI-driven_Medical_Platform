# AI Medical Platform Backend

Complete FastAPI backend for AI-driven medical platform with SQLite database.

## Features

- ✅ User management (doctors, nurses, admins, receptionists)
- ✅ Patient records management
- ✅ Visit/appointment scheduling and tracking
- ✅ Medical transcription support
- ✅ AI-powered report generation (using Groq API)
- ✅ Medicine suggestion engine
- ✅ Prescription management
- ✅ Vitals tracking
- ✅ SQLite database with ORM (SQLAlchemy)

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py              # Configuration and settings
├── database.py            # SQLAlchemy models and database setup
├── schemas.py             # Pydantic schemas for validation
├── dependencies.py        # Dependency injection
├── ai_service.py          # AI operations using Groq API
├── routes/
│   ├── __init__.py
│   ├── users.py           # User CRUD endpoints
│   ├── patients.py        # Patient CRUD endpoints
│   ├── visits.py          # Visit/appointment endpoints
│   ├── prescriptions.py   # Prescription endpoints
│   └── medical.py         # AI/medical endpoints
├── requirements.txt       # Python dependencies
├── .env.example           # Environment variables template
└── README.md             # This file
```

## Installation

### Prerequisites
- Python 3.8+
- pip or poetry

### Setup

1. **Clone repository and navigate to backend:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env and add your Groq API key
```

5. **Run the server:**
```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Users
- `POST /users/` - Create user
- `GET /users/` - List users
- `GET /users/{user_id}` - Get user
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### Patients
- `POST /patients/` - Create patient
- `GET /patients/` - List patients
- `GET /patients/{patient_id}` - Get patient
- `PUT /patients/{patient_id}` - Update patient
- `DELETE /patients/{patient_id}` - Delete patient

### Visits
- `POST /visits/` - Create visit
- `GET /visits/` - List visits
- `GET /visits/{visit_id}` - Get visit
- `GET /visits/patient/{patient_id}` - Get patient's visits
- `PUT /visits/{visit_id}` - Update visit
- `DELETE /visits/{visit_id}` - Delete visit

### Medical/AI
- `POST /medical/transcribe` - Transcribe audio
- `POST /medical/generate-report` - Generate medical report from transcription
- `POST /medical/save-report` - Save report to database
- `GET /medical/report/{report_id}` - Get report
- `POST /medical/suggest-medicines` - Get medicine suggestions
- `GET /medical/transcription/{transcription_id}` - Get transcription

### Prescriptions
- `POST /prescriptions/` - Create prescription
- `GET /prescriptions/` - List prescriptions
- `GET /prescriptions/{prescription_id}` - Get prescription
- `GET /prescriptions/patient/{patient_id}` - Get patient's prescriptions
- `GET /prescriptions/visit/{visit_id}` - Get visit prescriptions
- `PUT /prescriptions/{prescription_id}` - Update prescription
- `DELETE /prescriptions/{prescription_id}` - Deactivate prescription

## Database Models

### User
- id, name, email, role, specialty, license_number, avatar, created_at

### Patient
- id, name, age, gender, date_of_birth, blood_type, phone, email, address
- allergies, chronic_conditions, emergency_contact, insurance info

### Visit
- id, patient_id, doctor_id, date, chief_complaint, status
- vitals (BP, HR, RR, temp, SpO2, weight, height)
- transcription_id, report_id

### Transcription
- id, visit_id, text, duration, created_at

### Report (SOAP Notes)
- id, visit_id, subjective, objective, assessment, plan
- symptoms, diagnoses, icd_codes, medications, recommendations

### Prescription
- id, patient_id, visit_id, medicine_name, dosage, frequency
- duration, reason, warnings, is_active

## Future Enhancements

- [ ] Redis caching for frequently accessed data
- [ ] Docker containerization
- [ ] PostgreSQL support for production
- [ ] JWT authentication and authorization
- [ ] Advanced search and filtering
- [ ] Report generation (PDF export)
- [ ] Email notifications
- [ ] Audit logging
- [ ] Data backup and recovery
- [ ] API rate limiting

## Environment Variables

```
GROQ_API_KEY=your_api_key           # Groq API key for AI features
DATABASE_URL=sqlite:///./medical_platform.db
DEBUG=True                          # Debug mode
API_TITLE=AI Medical Platform API
API_VERSION=1.0.0
```

## Notes

- SQLite is used for development/small deployments
- For production, consider migrating to PostgreSQL
- All timestamps use UTC
- JSON fields are used for arrays and complex objects in SQLite
- CORS is enabled for all origins in development
- Groq API is used for AI-powered features (report generation, medicine suggestions)

## Support

For issues or questions, please open an issue on GitHub.
