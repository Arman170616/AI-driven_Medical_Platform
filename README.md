# AI-driven Medical Platform

A comprehensive AI-powered medical platform with modern web frontend and robust FastAPI backend. Features voice transcription, medical report generation, and intelligent medicine suggestions powered by Groq AI.

## 🏗️ Project Structure

```
ai-medical-platform/
├── app/                          # Next.js frontend application
│   ├── api/                      # API routes (to be replaced by backend)
│   ├── dashboard/                # Dashboard pages
│   ├── patients/                 # Patient management
│   ├── prescriptions/            # Prescription pages
│   ├── reports/                  # Report management
│   ├── voice-recording/          # Voice recording interface
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # UI component library
│   ├── layout/                   # Layout components
│   ├── medical/                  # Medical-specific components
│   └── glass/                    # Glass morphism components
├── backend/                      # FastAPI backend application
│   ├── main.py                   # FastAPI application entry
│   ├── config.py                 # Configuration management
│   ├── database.py               # SQLAlchemy models
│   ├── schemas.py                # Pydantic validation schemas
│   ├── ai_service.py             # AI service using Groq
│   ├── routes/                   # API route handlers
│   │   ├── users.py              # User management
│   │   ├── patients.py           # Patient management
│   │   ├── visits.py             # Visit/appointment management
│   │   ├── prescriptions.py      # Prescription management
│   │   └── medical.py            # Medical AI operations
│   ├── requirements.txt          # Python dependencies
│   ├── README.md                 # Backend documentation
│   └── setup.sh                  # Setup script
├── hooks/                        # React custom hooks
├── lib/                          # Utility functions
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── styles/                       # Global styles
└── package.json                  # Frontend dependencies
```

## ✨ Features

### Frontend (Next.js + React)
- 🎨 Modern, responsive UI with glass morphism design
- 🎤 Voice recording and transcription interface
- 📋 Patient management dashboard
- 💊 Prescription management
- 📊 Medical reports visualization
- 🔐 User authentication and role-based access
- 📱 Mobile-friendly interface

### Backend (FastAPI + SQLite)
- ✅ RESTful API with comprehensive documentation
- 🤖 AI-powered medical report generation
- 💊 Intelligent medicine suggestion engine
- 🎙️ Audio transcription support
- 👥 User and patient management
- 📅 Visit/appointment scheduling
- 💼 Prescription management
- 🗄️ SQLite database with ORM
- 🔄 Easy database schema management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- npm or yarn (for frontend)
- pip (for backend)

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
# or
yarn install
```

2. **Run development server:**
```bash
npm run dev
# or
yarn dev
```

3. **Access the frontend:**
   - Open http://localhost:3000 in your browser

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Run setup script (Unix/Linux/Mac):**
```bash
bash setup.sh
```

Or **manual setup (Windows or if script fails):**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

3. **Run the backend:**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## 📖 API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔌 Connecting Frontend to Backend

Update the frontend API calls to point to the backend:

In `app/api/` routes, replace calls to external services with calls to:
```
http://localhost:8000/medical/generate-report
http://localhost:8000/medical/suggest-medicines
http://localhost:8000/medical/transcribe
```

## 📚 API Endpoints

### Users
- `POST /users/` - Create user
- `GET /users/` - List users
- `GET /users/{user_id}` - Get user details
- `PUT /users/{user_id}` - Update user
- `DELETE /users/{user_id}` - Delete user

### Patients
- `POST /patients/` - Create patient
- `GET /patients/` - List patients
- `GET /patients/{patient_id}` - Get patient details
- `PUT /patients/{patient_id}` - Update patient
- `DELETE /patients/{patient_id}` - Delete patient

### Visits
- `POST /visits/` - Create visit
- `GET /visits/` - List visits
- `GET /visits/{visit_id}` - Get visit details
- `GET /visits/patient/{patient_id}` - Get patient's visits
- `PUT /visits/{visit_id}` - Update visit
- `DELETE /visits/{visit_id}` - Delete visit

### Medical/AI
- `POST /medical/transcribe` - Transcribe audio
- `POST /medical/generate-report` - Generate medical report
- `POST /medical/save-report` - Save report to database
- `POST /medical/suggest-medicines` - Get medicine suggestions
- `GET /medical/report/{report_id}` - Get report
- `GET /medical/transcription/{transcription_id}` - Get transcription

### Prescriptions
- `POST /prescriptions/` - Create prescription
- `GET /prescriptions/` - List prescriptions
- `GET /prescriptions/{prescription_id}` - Get prescription
- `GET /prescriptions/patient/{patient_id}` - Get patient's prescriptions
- `PUT /prescriptions/{prescription_id}` - Update prescription
- `DELETE /prescriptions/{prescription_id}` - Deactivate prescription

## 🗄️ Database Schema

### Models
- **User**: Doctors, nurses, admins, receptionists
- **Patient**: Patient profiles with allergies, conditions, emergency contacts
- **Visit**: Patient visits with vitals and notes
- **Transcription**: Audio transcription records
- **Report**: Medical reports with SOAP notes, diagnoses, medications
- **Prescription**: Medication prescriptions with dosage and warnings
- **Medicine Database**: Drug information and interactions
- **Drug Interaction**: Known drug-drug interactions

## 🔐 Environment Variables

### Frontend
```
NEXT_PUBLIC_API_URL=http://localhost:8000
GROQ_API_KEY=your_groq_api_key
```

### Backend
```
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=sqlite:///./medical_platform.db
DEBUG=True
API_TITLE=AI Medical Platform API
API_VERSION=1.0.0
```

## 📦 Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Shadcn/ui components

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Groq AI API
- Uvicorn

## 🔄 Future Enhancements

- [ ] User authentication (JWT)
- [ ] PostgreSQL migration for production
- [ ] Redis caching
- [ ] Docker containerization
- [ ] PDF report generation
- [ ] Email notifications
- [ ] Real-time updates with WebSockets
- [ ] Advanced search and filtering
- [ ] Audit logging
- [ ] Data backup and recovery
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and dashboards

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📧 Contact & Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for healthcare professionals**
