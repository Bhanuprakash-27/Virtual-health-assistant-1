# Virtual Health Assistant

An AI-powered virtual health assistant that helps patients by answering symptom-related queries, summarizing medical records, and providing health information with safety guardrails.

## ⚠️ IMPORTANT SAFETY DISCLAIMER
This application is for **EDUCATIONAL PURPOSES ONLY**. It is **NOT** a substitute for professional medical advice, diagnosis, or treatment. Always consult with healthcare professionals for medical decisions.

## Features

### Core Features:
1. **Symptom Query Handler**
   - Accepts patient symptom descriptions
   - Extracts key symptoms using NLP
   - Provides general information about symptoms
   - Lists possible common causes (NOT diagnosis)
   - Suggests when to see a doctor
   - Detects emergency symptoms immediately

2. **Medical Record Summarizer**
   - Accepts patient medical history (text format)
   - Extracts key information: medications, allergies, conditions
   - Generates concise summary of medical records
   - Highlights important medical alerts

3. **Health Information Provider**
   - Answers general health questions
   - Provides information about medications
   - Explains medical terms in simple language

### Safety Features Implemented:
- ✅ **No Diagnosis**: System never provides medical diagnoses
- ✅ **Medical Disclaimer**: Included in all responses
- ✅ **Emergency Detection**: Detects emergency symptoms and advises immediate action
- ✅ **Doctor Referral**: Recommends consulting doctors for serious symptoms
- ✅ **Validated Sources**: Uses structured medical knowledge base

## Technology Stack

### Backend:
- Python 3.9+
- Flask (Web framework)
- NLTK (Natural Language Processing)
- Custom NLP modules for symptom analysis

### Frontend:
- HTML5, CSS3, JavaScript (Vanilla)
- Responsive design with mobile support
- Clean, professional medical theme

### Knowledge Base:
- JSON files with medical information
- Symptoms database (20+ common symptoms)
- Emergency conditions database
- Medications database

## Installation & Setup

### Prerequisites:
- Python 3.9 or higher
- pip (Python package manager)
- Web browser (Chrome, Firefox, Safari)

### Step 1: Clone/Download the Project

### Step 2: Set Up Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt