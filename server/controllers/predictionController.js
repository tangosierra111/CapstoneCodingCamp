// Prediction Controller - Handles prediction and history
const axios = require('axios');
const { validationResult } = require('express-validator');
const DatasetModel = require('../models/datasetModel');

class PredictionController {
  // Send prediction request
  static async predict(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { studentId } = req;
      const inputData = req.body;

      // Call ML service to get prediction
      try {
        const mlResponse = await axios.post(
          `${process.env.ML_SERVICE_URL}/predict`,
          inputData,
          { timeout: 10000 }
        );

        const prediction = mlResponse.data.prediction; // 0, 1, or 2
        const performanceCategory = ['Low', 'Medium', 'High'][prediction];

        // Calculate derived features
        const aiUsageHours = inputData.aiUsageTimeMinutes / 60;
        const aiStudyRatio = aiUsageHours / inputData.studyHoursPerDay;

        // Prepare data for storage
        const predictionData = {
          ...inputData,
          aiUsageHours,
          aiStudyRatio,
          performanceCategory
        };

        // Save to database
        const datasetId = await DatasetModel.create(studentId, predictionData);

        res.json({
          success: true,
          message: 'Prediction successful',
          datasetId,
          prediction: performanceCategory,
          details: {
            low: mlResponse.data.confidence?.low || 0,
            medium: mlResponse.data.confidence?.medium || 0,
            high: mlResponse.data.confidence?.high || 0
          }
        });
      } catch (mlErr) {
        console.error('ML Service error:', mlErr.message);
        res.status(503).json({
          success: false,
          message: 'ML Service temporarily unavailable',
          error: mlErr.message
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Prediction failed',
        error: err.message
      });
    }
  }

  // Get prediction history
  static async getHistory(req, res) {
    try {
      const { studentId } = req;

      const history = await DatasetModel.findByStudentId(studentId);

      res.json({
        success: true,
        count: history.length,
        history: history.map(item => ({
          datasetId: item.dataset_id,
          performanceCategory: item.performance_category,
          createdAt: item.created_at
        }))
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch history',
        error: err.message
      });
    }
  }

  // Get single prediction detail
  static async getHistoryDetail(req, res) {
    try {
      const { id } = req.params;
      const { studentId } = req;

      const detail = await DatasetModel.findById(id, studentId);
      if (!detail) {
        return res.status(404).json({
          success: false,
          message: 'Prediction not found'
        });
      }

      res.json({
        success: true,
        detail: {
          datasetId: detail.dataset_id,
          age: detail.age,
          gradeLevel: detail.grade_level,
          studyHoursPerDay: detail.study_hours_per_day,
          sleepHours: detail.sleep_hours,
          socialMediaHours: detail.social_media_hours,
          tutoringHours: detail.tutoring_hours,
          attendancePercentage: detail.attendance_percentage,
          classParticipationScore: detail.class_participation_score,
          studyConsistencyIndex: detail.study_consistency_index,
          improvementRate: detail.improvement_rate,
          lastExamScore: detail.last_exam_score,
          assignmentScoresAvg: detail.assignment_scores_avg,
          conceptUnderstandingScore: detail.concept_understanding_score,
          usesAi: detail.uses_ai,
          aiUsageTimeMinutes: detail.ai_usage_time_minutes,
          aiDependencyScore: detail.ai_dependency_score,
          aiGeneratedContentPercentage: detail.ai_generated_content_percentage,
          aiPromptsPerWeek: detail.ai_prompts_per_week,
          aiEthicsScore: detail.ai_ethics_score,
          performanceCategory: detail.performance_category,
          createdAt: detail.created_at
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch prediction detail',
        error: err.message
      });
    }
  }
}

module.exports = PredictionController;
