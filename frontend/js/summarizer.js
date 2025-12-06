const API_URL = 'http://localhost:5000/api';

// Summarize medical records
async function summarizeRecords() {
    const medicalText = document.getElementById('medicalText').value.trim();
    
    if (!medicalText) {
        alert('Please paste medical records text');
        return;
    }
    
    const outputDiv = document.getElementById('summaryOutput');
    outputDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Processing medical records...</div>';
    
    try {
        const response = await fetch(`${API_URL}/summarize-record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                medical_text: medicalText
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            outputDiv.innerHTML = `<div class="error">Error: ${data.error}</div>`;
            return;
        }
        
        displaySummary(data);
        
    } catch (error) {
        outputDiv.innerHTML = `<div class="error">Connection error: ${error.message}. Make sure backend is running.</div>`;
    }
}

// Display summary in formatted way
function displaySummary(data) {
    const outputDiv = document.getElementById('summaryOutput');
    const extracted = data.extracted_data;
    
    let html = `<h3><i class="fas fa-file-medical-alt"></i> Medical Summary</h3>`;
    
    // Display summary text
    html += `<div class="summary-text">${formatResponse(data.summary)}</div>`;
    
    // Display structured data
    html += `<div class="structured-data">`;
    
    if (extracted.allergies && extracted.allergies.length > 0) {
        html += `<div class="summary-item">
            <h4><i class="fas fa-allergies" style="color: #dc3545;"></i> Allergies</h4>
            <div class="summary-content alert-highlight">
                ${extracted.allergies.map(a => `<span class="badge">${a}</span>`).join(' ')}
            </div>
        </div>`;
    }
    
    if (extracted.medications && extracted.medications.length > 0) {
        html += `<div class="summary-item">
            <h4><i class="fas fa-pills" style="color: #17a2b8;"></i> Medications</h4>
            <div class="summary-content">
                <ul>${extracted.medications.map(m => `<li>${m}</li>`).join('')}</ul>
            </div>
        </div>`;
    }
    
    if (extracted.conditions && extracted.conditions.length > 0) {
        html += `<div class="summary-item">
            <h4><i class="fas fa-heartbeat" style="color: #28a745;"></i> Conditions</h4>
            <div class="summary-content">
                ${extracted.conditions.map(c => `<span class="condition">${c}</span>`).join(', ')}
            </div>
        </div>`;
    }
    
    if (extracted.surgeries && extracted.surgeries.length > 0) {
        html += `<div class="summary-item">
            <h4><i class="fas fa-procedures" style="color: #6f42c1;"></i> Surgeries</h4>
            <div class="summary-content">
                ${extracted.surgeries.join(', ')}
            </div>
        </div>`;
    }
    
    if (extracted.alerts && extracted.alerts.length > 0) {
        html += `<div class="summary-item">
            <h4><i class="fas fa-exclamation-triangle" style="color: #ffc107;"></i> Medical Alerts</h4>
            <div class="summary-content alert-highlight">
                ${extracted.alerts.join('<br>')}
            </div>
        </div>`;
    }
    
    if (!extracted.allergies?.length && !extracted.medications?.length && 
        !extracted.conditions?.length && !extracted.surgeries?.length) {
        html += `<div class="alert-highlight">
            <i class="fas fa-info-circle"></i> No specific medical information was extracted. Try using terms like "allergies to", "taking medication", "history of".
        </div>`;
    }
    
    html += `</div>`;
    
    outputDiv.innerHTML = html;
}

// Clear text
function clearText() {
    document.getElementById('medicalText').value = '';
    document.getElementById('summaryOutput').innerHTML = `
        <div class="loading">
            <i class="fas fa-clipboard"></i><br>
            Summary will appear here after processing
        </div>
    `;
}

// Load example
function loadExample() {
    const example = `Patient Information:
Name: John Doe
Age: 45
Allergies: Penicillin, Peanuts, Shellfish
Current Medications:
- Metformin 500mg twice daily for Type 2 Diabetes
- Lisinopril 10mg daily for Hypertension
- Atorvastatin 20mg daily for High Cholesterol
Medical Conditions:
- Hypertension (diagnosed 2018)
- Type 2 Diabetes (diagnosed 2020)
- Hyperlipidemia
Previous Surgeries:
- Appendectomy (2005)
- Knee Arthroscopy (2018)
Recent Visits:
- 2024-01-15: Routine checkup, blood pressure 130/85
- 2023-10-20: Follow-up for diabetes management
Lab Results:
- HbA1c: 6.8%
- LDL: 110 mg/dL
Vaccinations:
- COVID-19 (2023 booster)
- Influenza (2023-2024 season)
- Tetanus (2022)`;
    
    document.getElementById('medicalText').value = example;
}

// Export as text
function exportAsText() {
    const summary = document.getElementById('summaryOutput').innerText;
    const medicalText = document.getElementById('medicalText').value;
    
    const exportContent = `VIRTUAL HEALTH ASSISTANT - MEDICAL SUMMARY
Generated: ${new Date().toLocaleString()}

=== ORIGINAL TEXT ===
${medicalText}

=== EXTRACTED SUMMARY ===
${summary}

=== DISCLAIMER ===
This summary is generated automatically for educational purposes. Always verify with original medical records and consult healthcare providers.`;

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medical-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Print summary
function printSummary() {
    const printContent = document.getElementById('summaryOutput').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="color: #1e88e5;">Medical Record Summary</h1>
            <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                <strong>Generated:</strong> ${new Date().toLocaleString()}
            </div>
            <div>${printContent}</div>
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px;">
                <strong>Disclaimer:</strong> This summary is generated automatically for educational purposes. Always verify with original medical records and consult healthcare providers.
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
}

// Format response (same as other files)
function formatResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.split('\n\n').map(para => {
        if (para.startsWith('•') || para.startsWith('⚠️') || para.startsWith('📋')) {
            return `<p class="bullet-list">${para.replace(/\n•/g, '<br>•')}</p>`;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    return text;
}