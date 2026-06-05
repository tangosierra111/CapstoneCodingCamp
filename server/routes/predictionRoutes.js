// Prediction Routes
const express = require('express');
const { body } = require('express-validator');
const PredictionController = require('../controllers/predictionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Make prediction - POST /api/predict
router.post('/', [
  body('age').isInt({ min: 14, max: 24 }).withMessage('Age must be between 14 and 24'),
  body('gradeLevel').isIn([0, 1, 2]).withMessage('Invalid grade level'),
  body('studyHoursPerDay').isFloat({ min: 0.5, max: 6.0 }).withMessage('Study hours must be between 0.5 and 6.0'),
  body('sleepHours').isFloat({ min: 4.0, max: 9.0 }).withMessage('Sleep hours must be between 4.0 and 9.0'),
  body('socialMediaHours').isFloat({ min: 0, max: 6 }).withMessage('Social media hours must be between 0 and 6'),
  body('tutoringHours').isFloat({ min: 0, max: 5 }).withMessage('Tutoring hours must be between 0 and 5'),
  body('attendancePercentage').isFloat({ min: 40, max: 100 }).withMessage('Attendance must be between 40% and 100%'),
  body('classParticipationScore').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
  body('studyConsistencyIndex').isFloat({ min: 1, max: 10 }).withMessage('Index must be between 1 and 10'),
  body('improvementRate').isFloat({ min: -20, max: 40 }).withMessage('Improvement rate must be between -20 and 40'),
  body('lastExamScore').isInt({ min: 20, max: 99 }).withMessage('Exam score must be between 20 and 99'),
  body('assignmentScoresAvg').isFloat({ min: 30, max: 100 }).withMessage('Average must be between 30 and 100'),
  body('conceptUnderstandingScore').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
  body('usesAi').isIn([0, 1]).withMessage('usesAi must be 0 or 1'),
  body('aiUsageTimeMinutes').isInt({ min: 0, max: 179 }).withMessage('Usage time must be between 0 and 179 minutes'),
  body('aiDependencyScore').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
  body('aiGeneratedContentPercentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100'),
  body('aiPromptsPerWeek').isInt({ min: 0, max: 119 }).withMessage('Prompts must be between 0 and 119'),
  body('aiEthicsScore').isInt({ min: 1, max: 10 }).withMessage('Score must be between 1 and 10'),
  body('aiToolsUsedChatGpt').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiToolsUsedClaude').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiToolsUsedCopilot').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiToolsUsedGemini').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiUsagePurposeCoding').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiUsagePurposeDoubtSolving').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiUsagePurposeExamPrep').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiUsagePurposeHomework').isIn([0, 1]).withMessage('Must be 0 or 1'),
  body('aiUsagePurposeNotes').isIn([0, 1]).withMessage('Must be 0 or 1')
], PredictionController.predict);

// Get prediction history - GET /api/predict/history
router.get('/history', PredictionController.getHistory);

// Get prediction detail - GET /api/predict/history/:id
router.get('/history/:id', PredictionController.getHistoryDetail);

module.exports = router;
