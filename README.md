
🏥Virtual Health Assistant AI Assessment

-->Project Overview

This is a Virtual Health Assistant system built for an AI and Full Stack Developer assessment. The application provides AI powered health information assistance while maintaining strict safety protocols. The system never provides medical diagnoses and always recommends consulting healthcare professionals.

-->Key Features

-->AI Chatbot Backend

Symptom query handler with NLP processing
Medical record summarization
Health information provider
Emergency symptom detection
Safety checks and disclaimers
REST API

Complete API endpoints for all features
Input validation and error handling
Rate limiting and logging
CORS enabled for frontend integration
Frontend Interface

Interactive chat interface
Symptom checker with severity selection
Medical record summarizer tool
Medication information lookup
Responsive and accessible design
Safety Features

No medical diagnosis provided
Emergency detection system
Mandatory medical disclaimers
Doctor referral recommendations
Validated information sources
Requirements

-->Prerequisites

Python 3.8 or higher
pip package manager
Modern web browser
Code editor (VS Code recommended)
Python Dependencies

Flask web framework
NLTK for natural language processing
spaCy for advanced text processing
Flask CORS for cross origin requests
python dotenv for environment management
Setup Instructions

Step 1: Clone the Repository

Open terminal and run:
git clone https://github.com/Bhanuprakash-27/Virtual-health-assistant-1.git
cd Virtual-health-assistant-1

Step 2: Create Virtual Environment

For Mac or Linux:
python3 -m venv venv
source venv/bin/activate

For Windows:
python -m venv venv
venv\Scripts\activate

Step 3: Install Dependencies

pip install -r requirements.txt
python -m spacy download en_core_web_sm

Step 4: Configure Environment

Copy the example environment file:
cp .env.example .env

Step 5: Run the Application

python app.py

Step 6: Access the Application

Open your web browser and go to:
http://localhost:5000

Project Structure

Virtual health assistant 1
app.py - Main Flask application
requirements.txt - Python dependencies
.env.example - Environment variables template
.gitignore - Git ignore rules
README.md - Project documentation

knowledge base - Medical knowledge databases
symptoms.json - Symptom information database
emergencies.json - Emergency conditions database
medications.json - Medication information database

static - Frontend static files
css - CSS styling files
style.css - Main stylesheet
js - JavaScript files
main.js - Frontend logic

templates - HTML templates
index.html - Main application interface

utils - Core backend modules
ai_processor.py - AI and NLP processing
safety_checker.py - Safety validation system
response_generator.py - Response formatting

How to Use

Using the Chat Assistant

Type your health question in the chat box
Click send or press Enter
Receive AI generated response with safety disclaimer
Symptom Checker

Select symptoms from the checklist
Choose severity level
Click Analyze Symptoms
View recommendations and safety information
Medical Record Summarizer

Paste medical record text in the text area
Click Summarize Record
View structured summary of key information
Medication Lookup

Enter medication name in search box
Click Search
View medication information and warnings
Safety Information

What This System Does

Provides general health information
Explains symptoms in simple terms
Suggests when to see a doctor
Detects emergency situations
Summarizes medical records
What This System Does Not Do

Does not provide medical diagnoses
Does not recommend specific treatments
Does not guarantee health outcomes
Does not replace professional medical advice
Emergency Response

If the system detects emergency symptoms like chest pain or difficulty breathing, it will immediately show a red emergency alert banner with instructions to call 911.

Testing the Application

Test Cases

Normal symptom query: I have a mild headache
Emergency detection: Severe chest pain
Medical record summarization: Paste sample medical text
Diagnosis request: What disease do I have
Safety Checklist

System never provides diagnosis
Disclaimer appears in all responses
Emergency keywords trigger immediate action
Severe symptoms recommend doctor consultation
No harmful medical advice given
Troubleshooting

Common Issues

Module not found error
Run: pip install -r requirements.txt
Port already in use
Change port in .env file to 5001
spaCy model not found
Run: python -m spacy download en_core_web_sm
CORS errors
Ensure Flask CORS is installed and configured
Debug Mode

To enable debug mode, set DEBUG=True in .env file

Contact

For questions or issues with this project, please contact through the repository.

Important Disclaimer

This Virtual Health Assistant is for educational and informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this system.
