import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import predictionService from '../services/predictionService';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Inbox, ChevronRight, X, BarChart3, BookOpen, BrainCircuit, Calendar, TrendingUp } from 'lucide-react';
import './HistoryPage.css';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await predictionService.getHistory();
      setHistory(response.data.history || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceBadge = (category) => {
    switch (category) {
      case 'Low':
        return 'badge-danger';
      case 'Medium':
        return 'badge-warning';
      case 'High':
        return 'badge-success';
      default:
        return 'badge-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="history-page">
        <Header />
        <div className="container">
          <div className="loading" style={{ height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your prediction history...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div 
          className="history-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1><History className="inline-icon" size={36} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Prediction History</h1>
          <p>Track your past predictions and monitor your performance trends</p>
        </motion.div>

        {error && (
          <motion.div className="alert alert-danger" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {error}
          </motion.div>
        )}

        {history.length === 0 && !error ? (
          <motion.div 
            className="empty-state"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="empty-icon"><Inbox size={40} /></div>
            <h2>No predictions yet</h2>
            <p>You haven't made any predictions yet. Start by getting your first personalized insight!</p>
            <a href="/predict" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Make Your First Prediction</a>
          </motion.div>
        ) : (
          <motion.div 
            className="history-table-wrapper"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 24 }}
          >
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px', textAlign: 'center' }}>#</th>
                    <th>Date & Time</th>
                    <th>Performance Result</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <motion.tr 
                      key={item.datasetId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={16} className="text-secondary" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getPerformanceBadge(item.performanceCategory)}`}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                          {item.performanceCategory}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-action"
                          onClick={() => setSelectedDetail(item.datasetId)}
                        >
                          Details <ChevronRight size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedDetail && (
            <DetailModal
              datasetId={selectedDetail}
              onClose={() => setSelectedDetail(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function DetailModal({ datasetId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [datasetId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await predictionService.getHistoryDetail(datasetId);
      setDetail(response.data.detail);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="modal-content glass" 
        onClick={(e) => e.stopPropagation()}
        variants={modalVariants}
      >
        <div className="modal-header">
          <h2><BarChart3 className="text-primary" size={24} /> Prediction Details</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading" style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : detail ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className={`performance-result ${detail.performanceCategory.toLowerCase()}`}>
                <span className="result-label">Predicted Performance</span>
                {detail.performanceCategory}
              </div>

              <div className="recommendation-text" style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {detail.performanceCategory === 'Low' && "Performa belajarmu saat ini berada di tingkat rendah. Jangan menyerah! Cobalah untuk membuat jadwal belajar yang lebih konsisten, kurangi distraksi dari media sosial, dan jangan ragu untuk bertanya pada guru atau teman jika ada materi yang kurang dipahami."}
                {detail.performanceCategory === 'Medium' && "Kerja bagus, kamu sudah berada di jalur yang benar! Untuk meningkatkan performamu menjadi lebih tinggi, cobalah untuk lebih fokus saat sesi belajar, berpartisipasi aktif di kelas, dan manfaatkan AI sebagai alat bantu belajar dengan lebih bijak."}
                {detail.performanceCategory === 'High' && "Luar biasa! Kebiasaan belajar dan partisipasi akademikmu saat ini sangat efektif. Terus pertahankan konsistensimu dan jaga keseimbangan yang baik antara waktu belajar, istirahat yang cukup, serta penggunaan AI pendukung."}
              </div>

              <div className="detail-section">
                <h3><TrendingUp size={20} className="text-secondary" /> Academic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Last Exam Score</label>
                    <span>{detail.lastExamScore}</span>
                  </div>
                  <div className="detail-item">
                    <label>Assignment Average</label>
                    <span>{detail.assignmentScoresAvg.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Attendance</label>
                    <span>{detail.attendancePercentage}%</span>
                  </div>
                  <div className="detail-item">
                    <label>Concept Understanding</label>
                    <span>{detail.conceptUnderstandingScore}/10</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><BookOpen size={20} className="text-secondary" /> Study Patterns</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Study Time / Day</label>
                    <span>{detail.studyHoursPerDay} hrs</span>
                  </div>
                  <div className="detail-item">
                    <label>Sleep Duration</label>
                    <span>{detail.sleepHours} hrs</span>
                  </div>
                  <div className="detail-item">
                    <label>Social Media</label>
                    <span>{detail.socialMediaHours} hrs/day</span>
                  </div>
                  <div className="detail-item">
                    <label>Consistency Index</label>
                    <span>{detail.studyConsistencyIndex}/10</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><BrainCircuit size={20} className="text-secondary" /> AI Usage Overview</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Uses AI Tools</label>
                    <span>{detail.usesAi === 1 ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Daily AI Time</label>
                    <span>{detail.aiUsageTimeMinutes} mins</span>
                  </div>
                  <div className="detail-item">
                    <label>AI Dependency</label>
                    <span>{detail.aiDependencyScore}/10</span>
                  </div>
                  <div className="detail-item">
                    <label>Ethics Score</label>
                    <span>{detail.aiEthicsScore}/10</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Prediction made on {new Date(detail.createdAt).toLocaleString('id-ID')}
              </div>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}
