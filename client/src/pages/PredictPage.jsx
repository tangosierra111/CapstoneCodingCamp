import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import predictionService from '../services/predictionService';
import { motion } from 'framer-motion';
import { Target, User, BookOpen, TrendingUp, Cpu, HelpCircle, CheckCircle2 } from 'lucide-react';
import './PredictPage.css';

export default function PredictPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    age: 17,
    gradeLevel: 0,
    studyHoursPerDay: 2.5,
    sleepHours: 7,
    socialMediaHours: 2,
    tutoringHours: 1,
    attendancePercentage: 85,
    classParticipationScore: 7,
    studyConsistencyIndex: 6.5,
    improvementRate: 5,
    lastExamScore: 75,
    assignmentScoresAvg: 80,
    conceptUnderstandingScore: 7,
    usesAi: 1,
    aiUsageTimeMinutes: 90,
    aiDependencyScore: 6,
    aiGeneratedContentPercentage: 30,
    aiPromptsPerWeek: 40,
    aiEthicsScore: 7,
    aiToolsUsedChatGpt: 1,
    aiToolsUsedClaude: 0,
    aiToolsUsedCopilot: 0,
    aiToolsUsedGemini: 0,
    aiUsagePurposeCoding: 1,
    aiUsagePurposeDoubtSolving: 0,
    aiUsagePurposeExamPrep: 0,
    aiUsagePurposeHomework: 0,
    aiUsagePurposeNotes: 0
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : parseInt(value)
    }));
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await predictionService.predict(formData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const sectionVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="predict-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div 
          className="predict-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1><Target className="inline-icon" size={36} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Performance Prediction</h1>
          <p>Fill in the information about your learning habits to get a personalized prediction</p>
        </motion.div>

        {error && (
          <motion.div className="alert alert-danger" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div className="alert alert-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 size={20} /> Prediction submitted successfully! Redirecting to your history...
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="predict-form glass"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Demographic Section */}
          <motion.div className="form-section" variants={sectionVariants}>
            <h2><User size={24} className="text-primary" /> Demographic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Age
                  <HelpCircle size={14} className="helper-icon" title="Your current age (14-24 years)" />
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="age"
                    value={formData.age}
                    onChange={handleRangeChange}
                    min="14"
                    max="24"
                    step="1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.age}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Grade Level</label>
                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value={0}>10th / 1st Year</option>
                  <option value={1}>11th / 2nd Year</option>
                  <option value={2}>12th / 3rd Year</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Study Habits Section */}
          <motion.div className="form-section" variants={sectionVariants}>
            <h2><BookOpen size={24} className="text-primary" /> Study Habits</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Study Hours Per Day
                  <HelpCircle size={14} className="helper-icon" title="Average study hours per day" />
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="studyHoursPerDay"
                    value={formData.studyHoursPerDay}
                    onChange={handleRangeChange}
                    min="0.5"
                    max="6.0"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.studyHoursPerDay}h</span>
                </div>
              </div>

              <div className="form-group">
                <label>Sleep Hours Per Night</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="sleepHours"
                    value={formData.sleepHours}
                    onChange={handleRangeChange}
                    min="4.0"
                    max="9.0"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.sleepHours}h</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Social Media Hours / Day</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="socialMediaHours"
                    value={formData.socialMediaHours}
                    onChange={handleRangeChange}
                    min="0"
                    max="6"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.socialMediaHours}h</span>
                </div>
              </div>

              <div className="form-group">
                <label>Tutoring Hours / Week</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="tutoringHours"
                    value={formData.tutoringHours}
                    onChange={handleRangeChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.tutoringHours}h</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Academic Performance Section */}
          <motion.div className="form-section" variants={sectionVariants}>
            <h2><TrendingUp size={24} className="text-primary" /> Academic Performance</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Attendance Percentage</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="attendancePercentage"
                    value={formData.attendancePercentage}
                    onChange={handleRangeChange}
                    min="40"
                    max="100"
                    step="1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.attendancePercentage}%</span>
                </div>
              </div>

              <div className="form-group">
                <label>Class Participation Score (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="classParticipationScore"
                    value={formData.classParticipationScore}
                    onChange={handleRangeChange}
                    min="1"
                    max="10"
                    step="1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.classParticipationScore}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Study Consistency Index (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="studyConsistencyIndex"
                    value={formData.studyConsistencyIndex}
                    onChange={handleRangeChange}
                    min="1"
                    max="10"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.studyConsistencyIndex}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Improvement Rate (-20 to 40)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="improvementRate"
                    value={formData.improvementRate}
                    onChange={handleRangeChange}
                    min="-20"
                    max="40"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.improvementRate}</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Last Exam Score</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="lastExamScore"
                    value={formData.lastExamScore}
                    onChange={handleRangeChange}
                    min="20"
                    max="99"
                    step="1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.lastExamScore}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Assignment Scores Avg</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="assignmentScoresAvg"
                    value={formData.assignmentScoresAvg}
                    onChange={handleRangeChange}
                    min="30"
                    max="100"
                    step="0.1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.assignmentScoresAvg}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Concept Understanding (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input
                    type="range"
                    name="conceptUnderstandingScore"
                    value={formData.conceptUnderstandingScore}
                    onChange={handleRangeChange}
                    min="1"
                    max="10"
                    step="1"
                  />
                  <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.conceptUnderstandingScore}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Usage Section */}
          <motion.div className="form-section" variants={sectionVariants}>
            <h2><Cpu size={24} className="text-primary" /> AI Usage Patterns</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Do you use AI Tools?</label>
                <select
                  name="usesAi"
                  value={formData.usesAi}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>Yes, I use AI tools</option>
                  <option value={0}>No, I don't use AI tools</option>
                </select>
              </div>

              {formData.usesAi === 1 && (
                <div className="form-group">
                  <label>AI Usage Time / Day (mins)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input
                      type="range"
                      name="aiUsageTimeMinutes"
                      value={formData.aiUsageTimeMinutes}
                      onChange={handleRangeChange}
                      min="0"
                      max="179"
                      step="1"
                    />
                    <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.aiUsageTimeMinutes}m</span>
                  </div>
                </div>
              )}
            </div>

            {formData.usesAi === 1 && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>AI Dependency Score (1-10)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        name="aiDependencyScore"
                        value={formData.aiDependencyScore}
                        onChange={handleRangeChange}
                        min="1"
                        max="10"
                        step="1"
                      />
                      <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.aiDependencyScore}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>AI-Generated Content %</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        name="aiGeneratedContentPercentage"
                        value={formData.aiGeneratedContentPercentage}
                        onChange={handleRangeChange}
                        min="0"
                        max="100"
                        step="1"
                      />
                      <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.aiGeneratedContentPercentage}%</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>AI Prompts Per Week</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        name="aiPromptsPerWeek"
                        value={formData.aiPromptsPerWeek}
                        onChange={handleRangeChange}
                        min="0"
                        max="119"
                        step="1"
                      />
                      <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.aiPromptsPerWeek}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>AI Ethics Score (1-10)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        name="aiEthicsScore"
                        value={formData.aiEthicsScore}
                        onChange={handleRangeChange}
                        min="1"
                        max="10"
                        step="1"
                      />
                      <span style={{ fontWeight: '600', minWidth: '40px', textAlign: 'right' }}>{formData.aiEthicsScore}</span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Which AI Tools Do You Use?</label>
                  <div className="checkbox-group">
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="aiToolsUsedChatGpt"
                        checked={formData.aiToolsUsedChatGpt === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, aiToolsUsedChatGpt: e.target.checked ? 1 : 0 }))}
                      />
                      <span>ChatGPT</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="aiToolsUsedClaude"
                        checked={formData.aiToolsUsedClaude === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, aiToolsUsedClaude: e.target.checked ? 1 : 0 }))}
                      />
                      <span>Claude</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="aiToolsUsedCopilot"
                        checked={formData.aiToolsUsedCopilot === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, aiToolsUsedCopilot: e.target.checked ? 1 : 0 }))}
                      />
                      <span>Copilot</span>
                    </label>
                    <label className="checkbox-item">
                      <input
                        type="checkbox"
                        name="aiToolsUsedGemini"
                        checked={formData.aiToolsUsedGemini === 1}
                        onChange={(e) => setFormData(prev => ({ ...prev, aiToolsUsedGemini: e.target.checked ? 1 : 0 }))}
                      />
                      <span>Gemini</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Primary AI Usage Purpose</label>
                  <div className="radio-group">
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="aiUsagePurpose"
                        checked={formData.aiUsagePurposeCoding === 1}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          aiUsagePurposeCoding: 1,
                          aiUsagePurposeDoubtSolving: 0,
                          aiUsagePurposeExamPrep: 0,
                          aiUsagePurposeHomework: 0,
                          aiUsagePurposeNotes: 0
                        }))}
                      />
                      <span>Coding</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="aiUsagePurpose"
                        checked={formData.aiUsagePurposeDoubtSolving === 1}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          aiUsagePurposeCoding: 0,
                          aiUsagePurposeDoubtSolving: 1,
                          aiUsagePurposeExamPrep: 0,
                          aiUsagePurposeHomework: 0,
                          aiUsagePurposeNotes: 0
                        }))}
                      />
                      <span>Doubt Solving</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="aiUsagePurpose"
                        checked={formData.aiUsagePurposeExamPrep === 1}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          aiUsagePurposeCoding: 0,
                          aiUsagePurposeDoubtSolving: 0,
                          aiUsagePurposeExamPrep: 1,
                          aiUsagePurposeHomework: 0,
                          aiUsagePurposeNotes: 0
                        }))}
                      />
                      <span>Exam Prep</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="aiUsagePurpose"
                        checked={formData.aiUsagePurposeHomework === 1}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          aiUsagePurposeCoding: 0,
                          aiUsagePurposeDoubtSolving: 0,
                          aiUsagePurposeExamPrep: 0,
                          aiUsagePurposeHomework: 1,
                          aiUsagePurposeNotes: 0
                        }))}
                      />
                      <span>Homework</span>
                    </label>
                    <label className="radio-item">
                      <input
                        type="radio"
                        name="aiUsagePurpose"
                        checked={formData.aiUsagePurposeNotes === 1}
                        onChange={() => setFormData(prev => ({
                          ...prev,
                          aiUsagePurposeCoding: 0,
                          aiUsagePurposeDoubtSolving: 0,
                          aiUsagePurposeExamPrep: 0,
                          aiUsagePurposeHomework: 0,
                          aiUsagePurposeNotes: 1
                        }))}
                      />
                      <span>Notes</span>
                    </label>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          <motion.div className="form-actions" variants={sectionVariants}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '1rem 3rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {loading ? (
                <><span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', margin: 0 }}></span> Processing Data...</>
              ) : (
                <><Target size={24} /> Get My Prediction</>
              )}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}
