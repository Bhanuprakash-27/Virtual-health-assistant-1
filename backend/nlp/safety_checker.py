import re
import json
import os

class SafetyChecker:
    def __init__(self):
        self.emergency_keywords = []
        self.load_emergency_keywords()
        
    def load_emergency_keywords(self):
        try:
            with open('knowledge_base/emergencies.json', 'r') as f:
                data = json.load(f)
                self.emergency_keywords = data.get('emergency_keywords', [])
        except:
            self.emergency_keywords = [
                "chest pain", "heart attack", "difficulty breathing",
                "severe bleeding", "unconscious", "suicidal"
            ]
    
    def check_emergency(self, text):
        """Check if text contains emergency keywords"""
        text_lower = text.lower()
        emergencies_found = []
        
        for keyword in self.emergency_keywords:
            if keyword in text_lower:
                emergencies_found.append(keyword)
        
        return emergencies_found
    
    def is_diagnosis_request(self, text):
        """Detect if user is asking for diagnosis"""
        diagnosis_patterns = [
            r'what.*disease',
            r'what.*illness',
            r'do i have.*\?',
            r'am i having.*\?',
            r'diagnos(e|is)',
            r'what.*wrong with me',
            r'do you think i have'
        ]
        
        text_lower = text.lower()
        for pattern in diagnosis_patterns:
            if re.search(pattern, text_lower):
                return True
        return False
    
    def add_disclaimer(self, response):
        """Add medical disclaimer to response"""
        disclaimer = "\n\n⚠️ **IMPORTANT DISCLAIMER**: This information is for educational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider for medical concerns. In case of emergency, call your local emergency number immediately."
        return response + disclaimer