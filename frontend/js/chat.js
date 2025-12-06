const API_URL = 'http://localhost:5000/api';
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
let sessionId = 'session_' + Date.now();

// Initialize with welcome message
window.onload = function() {
    // Welcome message already in HTML
};

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    // Add user message to chat
    addMessage(message, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                session_id: sessionId
            })
        });
        
        removeTypingIndicator();
        
        const data = await response.json();
        
        if (data.error) {
            addMessage(`Error: ${data.error}`, 'assistant');
            return;
        }
        
        // Add assistant response
        addMessage(data.response, 'assistant', data.is_emergency);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        removeTypingIndicator();
        addMessage(`Connection error: Please make sure the backend server is running.`, 'assistant');
    }
}

// Send quick reply
function sendQuickReply(text) {
    messageInput.value = text;
    sendMessage();
}

// Add message to chat
function addMessage(text, sender, isEmergency = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isEmergency ? 'emergency-message' : ''}`;
    
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0');
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span>${sender === 'user' ? 'You' : 'Health Assistant'}</span>
            <span>${timeString}</span>
        </div>
        <div>${formatResponse(text)}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-header">
            <span>Health Assistant</span>
            <span>typing...</span>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Check for Enter key
function checkEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Format response text (same as in main.js)
function formatResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.split('\n\n').map(para => {
        if (para.startsWith('•') || para.startsWith('🚨')) {
            return `<p class="bullet-list">${para.replace(/\n•/g, '<br>•')}</p>`;
        }
        return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    return text;
}