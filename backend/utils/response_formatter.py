class ResponseFormatter:
    @staticmethod
    def format_symptom_response(analysis):
        """Format symptom analysis into user-friendly response"""
        response = ""
        
        if analysis.get("is_emergency"):
            response += "🚨 **EMERGENCY ALERT** 🚨\n"
            response += "Based on your symptoms, this may be a medical emergency.\n"
            response += "**Please call emergency services (911/112/108) immediately!**\n\n"
        
        if analysis["found_symptoms"]:
            response += "**Symptoms mentioned:**\n"
            for symptom in analysis["found_symptoms"]:
                response += f"• {symptom['name'].replace('_', ' ').title()}: {symptom['description']}\n"
            
            response += "\n**Possible common causes (NOT diagnosis):**\n"
            for symptom in analysis["found_symptoms"]:
                causes = symptom.get('common_causes', [])
                if causes:
                    response += f"• {symptom['name'].replace('_', ' ').title()}: {', '.join(causes[:3])}\n"
        
        if analysis["self_care_tips"]:
            response += "\n**General self-care tips:**\n"
            for tip in list(set(analysis["self_care_tips"]))[:5]:
                response += f"• {tip}\n"
        
        response += "\n**When to see a doctor:**\n"
        if analysis.get("is_emergency"):
            response += "• IMMEDIATELY - Call emergency services\n"
        else:
            response += "• If symptoms persist for more than 2-3 days\n"
            response += "• If symptoms worsen\n"
            response += "• If you develop new symptoms\n"
        
        return response
    
    @staticmethod
    def format_summary_response(summary):
        """Format medical summary"""
        response = "📋 **Medical Record Summary**\n\n"
        
        if summary["allergies"]:
            response += f"⚠️ **Allergies:** {', '.join(summary['allergies'])}\n\n"
        
        if summary["medications"]:
            response += f"💊 **Medications:** {', '.join(summary['medications'])}\n\n"
        
        if summary["conditions"]:
            response += f"🏥 **Conditions:** {', '.join(summary['conditions'])}\n\n"
        
        if summary["surgeries"]:
            response += f"🔪 **Surgeries:** {', '.join(summary['surgeries'])}\n\n"
        
        if not any([summary["allergies"], summary["medications"], summary["conditions"], summary["surgeries"]]):
            response += "No specific medical information extracted. Please ensure records mention allergies, medications, or conditions.\n"
        
        response += "\n*Note: This is an automated summary. Always consult with healthcare providers.*"
        
        return response