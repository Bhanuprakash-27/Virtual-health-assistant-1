import re

class MedicalRecordSummarizer:
    def summarize(self, text):
        """Extract key information from medical records"""
        text_lower = text.lower()
        
        summary = {
            "allergies": [],
            "medications": [],
            "conditions": [],
            "surgeries": [],
            "alerts": []
        }
        
        # Extract allergies
        allergy_patterns = [
            r'allerg(y|ies)[:\s]*([^.]+)',
            r'allergic to[:\s]*([^.]+)'
        ]
        for pattern in allergy_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                summary["allergies"].extend([a.strip() for a in match[1].split(',')])
        
        # Extract medications
        med_patterns = [
            r'taking[:\s]*([^.]+)',
            r'medication[s]?[:\s]*([^.]+)',
            r'prescribed[:\s]*([^.]+)'
        ]
        for pattern in med_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                summary["medications"].extend([m.strip() for m in match.split(',')])
        
        # Extract conditions
        condition_keywords = ['hypertension', 'diabetes', 'asthma', 'arthritis', 'cancer']
        for condition in condition_keywords:
            if condition in text_lower:
                summary["conditions"].append(condition)
        
        # Check for alerts
        if summary["allergies"]:
            summary["alerts"].append(f"Allergies: {', '.join(summary['allergies'])}")
        
        return summary