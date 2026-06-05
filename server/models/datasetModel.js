// Dataset Model - Database queries for dataset table
const pool = require('../config/db');

class DatasetModel {
  static async create(studentId, predictionData) {
    try {
      const {
        age, gradeLevel, studyHoursPerDay, sleepHours, socialMediaHours,
        tutoringHours, attendancePercentage, classParticipationScore,
        studyConsistencyIndex, improvementRate, lastExamScore,
        assignmentScoresAvg, conceptUnderstandingScore, usesAi,
        aiUsageTimeMinutes, aiDependencyScore, aiGeneratedContentPercentage,
        aiPromptsPerWeek, aiEthicsScore, aiUsageHours, aiStudyRatio,
        aiToolsUsedChatGpt, aiToolsUsedClaude, aiToolsUsedCopilot, aiToolsUsedGemini,
        aiUsagePurposeCoding, aiUsagePurposeDoubtSolving, aiUsagePurposeExamPrep,
        aiUsagePurposeHomework, aiUsagePurposeNotes, performanceCategory
      } = predictionData;

      const query = `
        INSERT INTO dataset (
          student_id, age, grade_level, study_hours_per_day, sleep_hours,
          social_media_hours, tutoring_hours, attendance_percentage,
          class_participation_score, study_consistency_index, improvement_rate,
          last_exam_score, assignment_scores_avg, concept_understanding_score,
          uses_ai, ai_usage_time_minutes, ai_dependency_score,
          ai_generated_content_percentage, ai_prompts_per_week, ai_ethics_score,
          ai_usage_hours, ai_study_ratio, ai_tools_used_ChatGPT,
          ai_tools_used_Claude, ai_tools_used_Copilot, ai_tools_used_Gemini,
          ai_usage_purpose_Coding, ai_usage_purpose_Doubt_Solving,
          ai_usage_purpose_Exam_Prep, ai_usage_purpose_Homework,
          ai_usage_purpose_Notes, performance_category
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        studentId, age, gradeLevel, studyHoursPerDay, sleepHours,
        socialMediaHours, tutoringHours, attendancePercentage,
        classParticipationScore, studyConsistencyIndex, improvementRate,
        lastExamScore, assignmentScoresAvg, conceptUnderstandingScore,
        usesAi, aiUsageTimeMinutes, aiDependencyScore,
        aiGeneratedContentPercentage, aiPromptsPerWeek, aiEthicsScore,
        aiUsageHours, aiStudyRatio, aiToolsUsedChatGpt,
        aiToolsUsedClaude, aiToolsUsedCopilot, aiToolsUsedGemini,
        aiUsagePurposeCoding, aiUsagePurposeDoubtSolving,
        aiUsagePurposeExamPrep, aiUsagePurposeHomework,
        aiUsagePurposeNotes, performanceCategory
      ];

      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  }

  static async findByStudentId(studentId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM dataset WHERE student_id = ? ORDER BY created_at DESC',
        [studentId]
      );
      return rows;
    } catch (err) {
      throw err;
    }
  }

  static async findById(datasetId, studentId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM dataset WHERE dataset_id = ? AND student_id = ?',
        [datasetId, studentId]
      );
      return rows[0] || null;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = DatasetModel;
