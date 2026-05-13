#!/bin/bash

# Setup script for AI Medical Platform Backend

echo "🏥 AI Medical Platform - Backend Setup"
echo "======================================="

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✅ Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your GROQ_API_KEY"
fi

# Initialize database
echo "🗄️  Initializing database..."
python -c "
from config import get_settings
from database import init_db
settings = get_settings()
init_db(settings.database_url)
print('✅ Database initialized successfully!')
"

echo ""
echo "✨ Setup complete!"
echo ""
echo "📖 To start the backend server, run:"
echo "   python main.py"
echo ""
echo "🌐 API Documentation will be available at:"
echo "   http://localhost:8000/docs"
echo ""
