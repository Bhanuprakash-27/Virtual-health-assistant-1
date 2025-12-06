// Global variables
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const symptomModal = document.getElementById('symptomModal');
const medicationModal = document.getElementById('medicationModal');

// Open modal functions
function openSymptomChecker() {
    symptomModal.style.display = 'block';
}

function openMedicationInfo() {
    medicationModal.style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === symptomModal) {
        symptomModal.style.display = 'none';
    }
    if (event.target === medicationModal) {
        medicationModal.style.display = 'none';
    }
}

// Analyze symptoms
async function analyzeSymptoms() {
    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
        .map(cb => cb.value);
    const severity = document.getElementById('severitySelect').value;
    
    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom');
        return;
    }
    
    const resultDiv = document.getElementById('symptomResult');
    resultDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Analyzing symptoms...</div>';
    
    try {
        const response = await fetch(`${API_URL}/check-symptoms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symptoms: selectedSymptoms,
                severity: severity
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
            return;
        }
        
        let html = `<h3><i class="fas fa-clipboard-check"></i> Analysis Results</h3>`;
        
        if (data.analysis.is_emergency) {
            html += `<div class="emergency-alert-small">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>EMERGENCY DETECTED</strong> - Seek immediate medical attention!
            </div>`;
        }
        
        html += `<div class="analysis-content">${formatResponse(data.response)}</div>`;
        
        html += `<div class="recommendation">
            <h4><i class="fas fa-user-md"></i> Recommendation:</h4>
            <p>${data.recommendation}</p>
        </div>`;
        
        resultDiv.innerHTML = html;
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Connection error: ${error.message}</div>`;
    }
}

// Search drug information
async function searchDrug() {
    const drugName = document.getElementById('drugSearch').value.trim();
    
    if (!drugName) {
        alert('Please enter a medication name');
        return;
    }
    
    const resultDiv = document.getElementById('medicationResult');
    resultDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Searching for medication information...</div>';
    
    try {
        const response = await fetch(`${API_URL}/drug-info/${encodeURIComponent(drugName)}`);
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
            return;
        }
        
        let html = `<h3><i class="fas fa-capsules"></i> ${drugName.toUpperCase()} Information</h3>`;
        
        if (!data.found_in_db) {
            html += `<div class="warning">
                <i class="fas fa-exclamation-circle"></i>
                This medication is not in our database.
            </div>`;
        }
        
        html += `<div class="drug-content">${formatResponse(data.information)}</div>`;
        
        resultDiv.innerHTML = html;
        
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">Connection error: ${error.message}</div>`;
    }
}

// Format response text (convert markdown-like formatting)
function formatResponse(text) {
    // Convert **bold** to <strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert newlines to <br> and paragraphs
    text = text.split('\n\n').map(para => {
        if (para.startsWith('•')) {
            return `<p class="bullet-list">${para.replace(/\n•/g, '<br>•')}</p>`;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    
    return text;
}

// Show disclaimer modal
function showDisclaimer() {
    alert(`VIRTUAL HEALTH ASSISTANT - FULL DISCLAIMER

This application is for EDUCATIONAL PURPOSES ONLY and is not a substitute for professional medical advice.

IMPORTANT:
1. This system does NOT provide medical diagnoses
2. Always consult with healthcare professionals for medical decisions
3. In case of emergency, call your local emergency number immediately
4. Never disregard professional medical advice because of information from this system

The developers assume no liability for any outcomes resulting from the use of this application.`);
}

// Show emergency contacts
function showContact() {
    alert(`EMERGENCY CONTACTS:
    
United States: 911
European Union: 112
United Kingdom: 999
India: 108, 112, or 102
Australia: 000
Canada: 911
Japan: 119
South Korea: 119

Poison Control (US): 1-800-222-1222
Suicide Prevention (US): 988

Save these numbers in your phone!`);
}

// Show privacy information
function showPrivacy() {
    alert(`PRIVACY INFORMATION:

This application:
- Does not store personal medical information permanently
- Uses temporary session storage for conversations
- Does not share data with third parties
- All processing happens locally or on our secure server

For a real medical application, additional privacy measures (HIPAA compliance, data encryption, user authentication) would be required.`);
}