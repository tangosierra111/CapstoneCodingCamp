"""
EduPerform ML Prediction Module
Handles preprocessing and model prediction
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
from pathlib import Path

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Load model and encoder
MODEL_PATH = PROJECT_ROOT / 'models' / 'LogisticRegressionModel.joblib'
ENCODER_PATH = PROJECT_ROOT / 'models' / 'OneHotEncoder.joblib'

try:
    model = joblib.load(MODEL_PATH)
    encoder = joblib.load(ENCODER_PATH)
    print(f'✅ Model loaded from {MODEL_PATH}')
    print(f'✅ Encoder loaded from {ENCODER_PATH}')
except Exception as e:
    print(f'❌ Error loading model or encoder: {e}')
    model = None
    encoder = None

# Define feature order (must match the order in cleaned dataset)
FEATURE_ORDER = [
    'age',
    'study_hours_per_day',
    'uses_ai',
    'ai_usage_time_minutes',
    'ai_dependency_score',
    'ai_generated_content_percentage',
    'ai_prompts_per_week',
    'ai_ethics_score',
    'last_exam_score',
    'assignment_scores_avg',
    'attendance_percentage',
    'concept_understanding_score',
    'study_consistency_index',
    'improvement_rate',
    'sleep_hours',
    'social_media_hours',
    'tutoring_hours',
    'class_participation_score',
    'ai_usage_hours',
    'ai_study_ratio',
    'ai_tools_used_ChatGPT',
    'ai_tools_used_Claude',
    'ai_tools_used_Copilot',
    'ai_tools_used_Gemini',
    'ai_usage_purpose_Coding',
    'ai_usage_purpose_Doubt Solving',
    'ai_usage_purpose_Exam Prep',
    'ai_usage_purpose_Homework',
    'ai_usage_purpose_Notes',
    'grade_level'
]

def predict_performance(input_data):
    """
    Predict student performance based on input features
    
    Args:
        input_data (dict): Input features from user
        
    Returns:
        dict: Prediction result with success status, prediction, and confidence
    """
    try:
        if model is None or encoder is None:
            return {
                'success': False,
                'message': 'Model or encoder not loaded'
            }
        
        # Preprocess input data
        processed_data = preprocess_input(input_data)
        
        if not processed_data['success']:
            return processed_data
        
        # Extract features
        features = processed_data['features']
        
        # Make prediction
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0]
        
        # Map to labels
        labels = ['Low', 'Medium', 'High']
        predicted_label = labels[prediction]
        
        # Get recommendations based on prediction
        recommendations = get_recommendations(input_data, predicted_label)
        
        return {
            'success': True,
            'prediction': int(prediction),
            'predicted_label': predicted_label,
            'confidence': {
                'low': float(probabilities[0]),
                'medium': float(probabilities[1]),
                'high': float(probabilities[2])
            },
            'recommendations': recommendations
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': 'Prediction error',
            'error': str(e)
        }

def preprocess_input(input_data):
    """
    Preprocess input data for model
    
    Args:
        input_data (dict): Raw input from user
        
    Returns:
        dict: Processed features ready for model
    """
    try:
        # Create a copy to avoid modifying original
        data = dict(input_data)
        
        # Calculate derived features
        ai_usage_hours = data.get('aiUsageTimeMinutes', 0) / 60
        ai_study_ratio = ai_usage_hours / data.get('studyHoursPerDay', 1)
        
        # Prepare features in correct order
        features_dict = {
            'age': data.get('age'),
            'study_hours_per_day': data.get('studyHoursPerDay'),
            'uses_ai': data.get('usesAi'),
            'ai_usage_time_minutes': data.get('aiUsageTimeMinutes'),
            'ai_dependency_score': data.get('aiDependencyScore'),
            'ai_generated_content_percentage': data.get('aiGeneratedContentPercentage'),
            'ai_prompts_per_week': data.get('aiPromptsPerWeek'),
            'ai_ethics_score': data.get('aiEthicsScore'),
            'last_exam_score': data.get('lastExamScore'),
            'assignment_scores_avg': data.get('assignmentScoresAvg'),
            'attendance_percentage': data.get('attendancePercentage'),
            'concept_understanding_score': data.get('conceptUnderstandingScore'),
            'study_consistency_index': data.get('studyConsistencyIndex'),
            'improvement_rate': data.get('improvementRate'),
            'sleep_hours': data.get('sleepHours'),
            'social_media_hours': data.get('socialMediaHours'),
            'tutoring_hours': data.get('tutoringHours'),
            'class_participation_score': data.get('classParticipationScore'),
            'ai_usage_hours': ai_usage_hours,
            'ai_study_ratio': ai_study_ratio,
            'ai_tools_used_ChatGPT': data.get('aiToolsUsedChatGpt', 0),
            'ai_tools_used_Claude': data.get('aiToolsUsedClaude', 0),
            'ai_tools_used_Copilot': data.get('aiToolsUsedCopilot', 0),
            'ai_tools_used_Gemini': data.get('aiToolsUsedGemini', 0),
            'ai_usage_purpose_Coding': data.get('aiUsagePurposeCoding', 0),
            'ai_usage_purpose_Doubt Solving': data.get('aiUsagePurposeDoubtSolving', 0),
            'ai_usage_purpose_Exam Prep': data.get('aiUsagePurposeExamPrep', 0),
            'ai_usage_purpose_Homework': data.get('aiUsagePurposeHomework', 0),
            'ai_usage_purpose_Notes': data.get('aiUsagePurposeNotes', 0),
            'grade_level': data.get('gradeLevel')
        }
        
        # Create DataFrame with features in correct order
        feature_values = [features_dict[key] for key in FEATURE_ORDER]
        features = np.array(feature_values).reshape(1, -1)
        
        return {
            'success': True,
            'features': features
        }
        
    except Exception as e:
        return {
            'success': False,
            'message': 'Preprocessing error',
            'error': str(e)
        }

def get_recommendations(input_data, prediction):
    """
    Generate recommendations based on prediction and input features
    
    Args:
        input_data (dict): Input features
        prediction (str): Predicted performance level
        
    Returns:
        dict: Recommendations for improvement
    """
    recommendations = {
        'areas_to_improve': [],
        'areas_to_maintain': []
    }
    
    try:
        # Analyze study hours
        study_hours = input_data.get('studyHoursPerDay', 0)
        if study_hours < 2:
            recommendations['areas_to_improve'].append({
                'area': 'Study Time',
                'current': f'{study_hours} hours/day',
                'recommendation': 'Increase daily study hours to at least 2-3 hours'
            })
        else:
            recommendations['areas_to_maintain'].append('Consistent study schedule')
        
        # Analyze sleep
        sleep_hours = input_data.get('sleepHours', 0)
        if sleep_hours < 6:
            recommendations['areas_to_improve'].append({
                'area': 'Sleep',
                'current': f'{sleep_hours} hours/day',
                'recommendation': 'Get at least 6-8 hours of sleep daily'
            })
        else:
            recommendations['areas_to_maintain'].append('Adequate sleep schedule')
        
        # Analyze AI usage
        ai_usage_time = input_data.get('aiUsageTimeMinutes', 0)
        if ai_usage_time > 120:
            recommendations['areas_to_improve'].append({
                'area': 'AI Dependency',
                'current': f'{ai_usage_time} minutes/day',
                'recommendation': 'Reduce AI usage time and focus on independent problem-solving'
            })
        
        # Analyze attendance
        attendance = input_data.get('attendancePercentage', 0)
        if attendance < 80:
            recommendations['areas_to_improve'].append({
                'area': 'Class Attendance',
                'current': f'{attendance}%',
                'recommendation': 'Increase class attendance to at least 90%'
            })
        else:
            recommendations['areas_to_maintain'].append('High attendance rate')
        
        # Analyze assignment scores
        assignment_avg = input_data.get('assignmentScoresAvg', 0)
        if assignment_avg < 70:
            recommendations['areas_to_improve'].append({
                'area': 'Assignment Performance',
                'current': f'{assignment_avg}%',
                'recommendation': 'Focus on completing assignments with higher accuracy'
            })
        else:
            recommendations['areas_to_maintain'].append('Strong assignment performance')
        
    except Exception as e:
        print(f'Error generating recommendations: {e}')
    
    return recommendations
