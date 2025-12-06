from flask import Blueprint, request, jsonify
import json
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from nlp.symptom_analyzer import SymptomAnalyzer
from nlp.summarizer import MedicalRecordSummarizer
from nlp.safety_checker import SafetyChecker
from utils.response_formatter import ResponseFormatter

api_bp = Blueprint('api', __name__)

# Initialize components
symptom_analyzer = SymptomAnalyzer()
summarizer = MedicalRecordSummarizer()
safety_checker = SafetyChecker()
formatter = ResponseFormatter()

# Store conversations (in memory - replace with DB in production)
conversations = {}

@api_bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.json
        message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Check for emergency
        emergencies = safety_checker.check_emergency(message)
        
        # Check for diagnosis request
        if safety_checker.is_diagnosis_request(message):
            response = "I cannot provide medical diagnoses. For diagnosis and treatment, please consult with a healthcare professional. I can only provide general information about symptoms."
            response = safety_checker.add_disclaimer(response)
            return jsonify({
                "response": response,
                "is_emergency": False,
                "diagnosis_request": True
            })
        
        # Analyze symptoms
        symptoms = symptom_analyzer.extract_symptoms(message)
        analysis = symptom_analyzer.analyze_symptoms(symptoms)
        
        # Format response
        if emergencies:
            response = f"🚨 EMERGENCY DETECTED: {', '.join(emergencies)}\n\n"
            response += "Please call emergency services immediately!\n"
            response += "Do not wait. This requires immediate medical attention."
        else:
            response = formatter.format_symptom_response(analysis)
        
        # Add disclaimer
        response = safety_checker.add_disclaimer(response)
        
        # Store conversation
        if session_id not in conversations:
            conversations[session_id] = []
        
        conversations[session_id].append({
            "user": message,
            "assistant": response,
            "timestamp": "now",
            "emergency": bool(emergencies)
        })
        
        return jsonify({
            "response": response,
            "symptoms_found": symptoms,
            "is_emergency": bool(emergencies),
            "emergencies": emergencies,
            "session_id": session_id
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/summarize-record', methods=['POST'])
def summarize_record():
    """Summarize medical records"""
    try:
        data = request.json
        medical_text = data.get('medical_text', '').strip()
        
        if not medical_text:
            return jsonify({"error": "Medical text is required"}), 400
        
        # Summarize medical record
        summary = summarizer.summarize(medical_text)
        response = formatter.format_summary_response(summary)
        
        # Add disclaimer
        response = safety_checker.add_disclaimer(response)
        
        return jsonify({
            "summary": response,
            "extracted_data": summary
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/check-symptoms', methods=['POST'])
def check_symptoms():
    """Check list of symptoms"""
    try:
        data = request.json
        symptoms_list = data.get('symptoms', [])
        severity = data.get('severity', 'mild')
        
        if not symptoms_list:
            return jsonify({"error": "Symptoms list is required"}), 400
        
        # Analyze symptoms
        analysis = symptom_analyzer.analyze_symptoms(symptoms_list)
        
        # Format response
        response = formatter.format_symptom_response(analysis)
        
        # Add severity-based recommendation
        if severity in ['severe', 'moderate']:
            response += f"\n\nGiven the {severity} severity, consider consulting a doctor soon."
        
        # Add disclaimer
        response = safety_checker.add_disclaimer(response)
        
        return jsonify({
            "analysis": analysis,
            "response": response,
            "recommendation": "See doctor" if severity in ['severe', 'moderate'] else "Monitor"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/drug-info/<drug_name>', methods=['GET'])
def drug_info(drug_name):
    """Get medication information"""
    try:
        # Load medication database
        try:
            with open('knowledge_base/medications.json', 'r') as f:
                medications = json.load(f)
        except:
            medications = {}
        
        drug_name_lower = drug_name.lower()
        
        if drug_name_lower in medications:
            drug_info = medications[drug_name_lower]
            response = f"**{drug_name.title()} ({drug_info.get('generic_name', '')})**\n\n"
            response += f"**Uses:** {', '.join(drug_info.get('uses', []))}\n"
            response += f"**Side Effects:** {', '.join(drug_info.get('side_effects', []))}\n"
            response += f"**Warnings:** {drug_info.get('warnings', 'Consult doctor')}\n"
        else:
            response = f"Information for {drug_name} not found in database. Please consult a pharmacist or doctor for medication information."
        
        # Add disclaimer
        response = safety_checker.add_disclaimer(response)
        
        return jsonify({
            "drug_name": drug_name,
            "information": response,
            "found_in_db": drug_name_lower in medications
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/emergency-check', methods=['POST'])
def emergency_check():
    """Check if text contains emergency symptoms"""
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        emergencies = safety_checker.check_emergency(text)
        
        return jsonify({
            "is_emergency": bool(emergencies),
            "emergencies_found": emergencies,
            "action": "Call emergency services" if emergencies else "Continue monitoring"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500