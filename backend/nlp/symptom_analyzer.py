import json
import re
import nltk
import ssl

# Fix SSL certificate issue for NLTK downloads
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Try to download NLTK data, but continue even if it fails
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    from nltk.tokenize import word_tokenize
    from nltk.corpus import stopwords
    NLTK_AVAILABLE = True
except:
    # Fallback if NLTK download fails
    NLTK_AVAILABLE = False
    print("NLTK data not available, using fallback methods")

class SymptomAnalyzer:
    def __init__(self):
        self.symptoms_db = {}
        self.load_symptoms()
        
        if NLTK_AVAILABLE:
            self.stop_words = set(stopwords.words('english'))
        else:
            self.stop_words = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must'])
        
    def load_symptoms(self):
        try:
            with open('knowledge_base/symptoms.json', 'r') as f:
                self.symptoms_db = json.load(f)
        except:
            # Fallback data if file not found
            self.symptoms_db = {
                "headache": {
                    "description": "Pain or discomfort in the head or face area",
                    "common_causes": ["Stress", "Tension", "Dehydration", "Eye strain"],
                    "self_care_tips": ["Rest in quiet room", "Apply cold compress", "Stay hydrated", "Manage stress"],
                    "is_emergency": False
                },
                "fever": {
                    "description": "Elevated body temperature, usually above 100.4°F (38°C)",
                    "common_causes": ["Infection", "Inflammation", "Heat exhaustion"],
                    "self_care_tips": ["Rest", "Stay hydrated", "Use fever-reducing medication if appropriate", "Cool compress"],
                    "is_emergency": False
                },
                "chest_pain": {
                    "description": "Pain or discomfort in the chest area",
                    "common_causes": ["Heartburn", "Muscle strain", "Anxiety"],
                    "self_care_tips": ["Sit still and rest", "Loosen tight clothing"],
                    "is_emergency": True,
                    "emergency_action": "Call emergency services immediately"
                }
            }
    
    def extract_symptoms(self, text):
        """Extract symptoms from text"""
        text_lower = text.lower()
        found_symptoms = []
        
        # Simple keyword matching (works without NLTK)
        for symptom in self.symptoms_db.keys():
            symptom_words = symptom.replace('_', ' ').split()
            for word in symptom_words:
                if word in text_lower:
                    found_symptoms.append(symptom)
                    break
        
        # Also check for common symptom mentions
        common_symptoms = {
            'headache': ['headache', 'head pain', 'migraine'],
            'fever': ['fever', 'temperature', 'hot'],
            'cough': ['cough', 'coughing'],
            'nausea': ['nausea', 'sick to stomach', 'queasy'],
            'fatigue': ['fatigue', 'tired', 'exhausted'],
            'chest_pain': ['chest pain', 'chest discomfort', 'heart pain'],
            'dizziness': ['dizziness', 'lightheaded', 'vertigo']
        }
        
        for symptom_key, keywords in common_symptoms.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found_symptoms.append(symptom_key)
                    break
        
        return list(set(found_symptoms))
    
    def analyze_symptoms(self, symptoms):
        """Analyze extracted symptoms"""
        analysis = {
            "found_symptoms": [],
            "general_info": "",
            "self_care_tips": [],
            "doctor_recommendation": "",
            "is_emergency": False
        }
        
        for symptom in symptoms:
            if symptom in self.symptoms_db:
                data = self.symptoms_db[symptom]
                analysis["found_symptoms"].append({
                    "name": symptom,
                    "description": data.get("description", ""),
                    "common_causes": data.get("common_causes", [])
                })
                analysis["self_care_tips"].extend(data.get("self_care_tips", []))
                
                if data.get("is_emergency", False):
                    analysis["is_emergency"] = True
                    analysis["doctor_recommendation"] = "SEEK IMMEDIATE MEDICAL ATTENTION!"
        
        return analysis