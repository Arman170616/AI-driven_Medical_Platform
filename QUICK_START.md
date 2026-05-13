# 🚀 Quick Start Guide

## ✅ System Running

Both the backend and frontend are now running:

### 🌐 Frontend - Next.js Web Application
```
URL: http://localhost:3000
Status: ✅ RUNNING
Framework: Next.js 16.2.6
```

### ⚙️ Backend - FastAPI Server
```
URL: http://localhost:8000
Status: ✅ RUNNING
Framework: FastAPI with SQLAlchemy
Database: SQLite
```

---

## 📖 Access Points

| Page | URL | Purpose |
|------|-----|---------|
| **Web App** | http://localhost:3000 | Main application |
| **API Docs (Interactive)** | http://localhost:8000/docs | Swagger UI for testing |
| **API ReDoc** | http://localhost:8000/redoc | Alternative documentation |
| **Health Check** | http://localhost:8000/health | Backend status |

---

## 🧪 Quick Test the API

Open http://localhost:8000/docs and try these:

### 1. Create a Doctor User
```json
POST /users/
{
  "name": "Dr. Sarah Johnson",
  "email": "sarah@hospital.com",
  "role": "doctor",
  "specialty": "Internal Medicine"
}
```

### 2. Create a Patient
```json
POST /patients/
{
  "name": "John Smith",
  "age": 45,
  "gender": "male",
  "date_of_birth": "1979-05-13",
  "blood_type": "O+",
  "phone": "+1234567890",
  "email": "john@example.com",
  "address": "123 Main St",
  "allergies": ["Penicillin"],
  "chronic_conditions": ["Diabetes"],
  "emergency_contact_name": "Jane Smith",
  "emergency_contact_phone": "+1234567891",
  "emergency_contact_relationship": "Spouse"
}
```

### 3. Generate Medical Report
```json
POST /medical/generate-report
{
  "transcription": "Patient complains of chest pain and shortness of breath. Blood pressure is elevated. Heart rate is normal. Needs further cardiac evaluation.",
  "patient_context": "45-year-old male with diabetes history"
}
```

### 4. Get Medicine Suggestions
```json
POST /medical/suggest-medicines
{
  "diagnoses": ["Angina", "Hypertension"],
  "symptoms": ["Chest pain", "Shortness of breath"],
  "patient_allergies": ["Penicillin"],
  "current_medications": ["Metformin"]
}
```

---

## 💾 Backend Features Enabled

✅ User Management (Doctors, Nurses, Admins)
✅ Patient Records with Emergency Contacts
✅ Visit Scheduling with Vitals Tracking
✅ Medical Transcription Support
✅ AI-Powered Report Generation (Groq API)
✅ Intelligent Medicine Suggestions
✅ Drug Interaction Checking
✅ Prescription Management
✅ ICD-10 Code Support
✅ Complete REST API with Swagger Docs

---

## 🎨 Frontend Features

✅ Dashboard
✅ Patient Management
✅ Voice Recording
✅ Visit Scheduling
✅ Medical Report Viewer
✅ Prescription Management
✅ SOAP Notes Editor

---

## 🛑 Stopping the Servers

To stop the servers, press **Ctrl+C** in their respective terminal windows.

### To Restart Later:

**Backend:**
```bash
cd backend
python3 main.py
```

**Frontend:**
```bash
pnpm dev
```

---

## 📚 Documentation

- **Full Setup Guide**: See [SETUP_COMPLETE.md](SETUP_COMPLETE.md)
- **Backend README**: See [backend/README.md](backend/README.md)
- **API Docs**: http://localhost:8000/docs

---

## 🔐 Security Note

⚠️ The Groq API key is configured in `backend/.env` (not in version control)

---

## 🎯 Next Steps

1. ✅ Access http://localhost:3000
2. ✅ Test API at http://localhost:8000/docs
3. Create sample data (users, patients)
4. Test medical report generation
5. Test medicine suggestions
6. Create prescriptions

---

**Setup Complete!** 🎉

Your AI Medical Platform is ready for development.
