import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { Target, History, Settings, Info, TrendingUp, Lightbulb, LineChart, ShieldCheck } from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div className="container">
        <motion.div 
          className="dashboard-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1>Welcome back, <span className="text-gradient">{user?.firstName}</span>! 👋</h1>
          <p>Manage your learning performance with EduPerform</p>
        </motion.div>

        <motion.div 
          className="dashboard-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <Link to="/predict" className="dashboard-card">
              <div className="card-icon-wrapper">
                <Target size={32} />
              </div>
              <h2>Make Prediction</h2>
              <p>Get your personalized learning performance prediction based on your unique study habits</p>
              <button className="btn btn-primary">Start Predicting</button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/history" className="dashboard-card">
              <div className="card-icon-wrapper">
                <History size={32} />
              </div>
              <h2>View History</h2>
              <p>Check your past predictions, track your progress, and see how you've improved over time</p>
              <button className="btn btn-secondary">View History</button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to="/profile" className="dashboard-card">
              <div className="card-icon-wrapper">
                <Settings size={32} />
              </div>
              <h2>Profile Settings</h2>
              <p>Update your account information, change password, or modify your education level</p>
              <button className="btn btn-secondary">Manage Profile</button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="info-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 24 }}
        >
          <div className="card info-card">
            <div className="info-header">
              <div className="info-icon">
                <Info size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>About EduPerform</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>How our prediction system works</p>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              EduPerform uses a highly accurate Logistic Regression Machine Learning model to evaluate 30 different variables
              including your demographic data, study habits, academic performance, and AI usage patterns.
            </p>
            
            <ul className="info-list">
              <li>
                <TrendingUp className="list-icon" size={20} />
                <span><strong>Personalized Insights:</strong> Discover if your learning performance is categorized as Low, Medium, or High based on real data patterns.</span>
              </li>
              <li>
                <Lightbulb className="list-icon" size={20} />
                <span><strong>Actionable Recommendations:</strong> Receive specific, targeted advice on what you should improve and what good habits you should maintain.</span>
              </li>
              <li>
                <LineChart className="list-icon" size={20} />
                <span><strong>Progress Tracking:</strong> All predictions are securely saved so you can track your learning journey across semesters.</span>
              </li>
              <li>
                <ShieldCheck className="list-icon" size={20} />
                <span><strong>Data Privacy:</strong> Your data is securely stored and never shared. We use bcrypt hashing for all passwords and secure JWT for sessions.</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
