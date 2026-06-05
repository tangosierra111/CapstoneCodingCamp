"""
EduPerform ML Service - Flask/FastAPI Server
Provides REST API endpoint for ML model predictions
"""

from flask import Flask, request, jsonify
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from predict import predict_performance

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'ML Service is running'
    }), 200

@app.route('/predict', methods=['POST'])
def predict():
    """
    Prediction endpoint
    Accepts JSON with input features and returns performance prediction
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Call prediction function
        result = predict_performance(data)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Prediction error',
            'error': str(e)
        }), 500

@app.route('/info', methods=['GET'])
def info():
    """Get model information"""
    return jsonify({
        'service': 'EduPerform ML Service',
        'version': '1.0.0',
        'model': 'Logistic Regression',
        'input_features': 30,
        'output_classes': ['Low', 'Medium', 'High'],
        'endpoints': {
            'health': 'GET /health',
            'predict': 'POST /predict',
            'info': 'GET /info'
        }
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('ML_PORT', 5001))
    debug = os.getenv('ML_DEBUG', 'False') == 'True'
    
    print(f'🚀 EduPerform ML Service running on port {port} (localhost)')
    app.run(host='127.0.0.1', port=port, debug=debug)
