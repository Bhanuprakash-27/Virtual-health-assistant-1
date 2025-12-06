from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from api.routes import api_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Register API blueprint
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({
        "message": "Virtual Health Assistant API",
        "status": "running",
        "endpoints": [
            "POST /api/chat",
            "POST /api/summarize-record",
            "POST /api/check-symptoms",
            "GET /api/drug-info/<drug_name>",
            "POST /api/emergency-check"
        ]
    })

if __name__ == '__main__':
    # Disable debug/reload to avoid permission issues
    app.run(debug=False, port=5000, host='0.0.0.0')