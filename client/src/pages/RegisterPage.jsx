import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, GraduationCap, Eye, EyeOff } from 'lucide-react';
import './Auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    educationLevel: 'SMA'
  });
  
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.educationLevel
      );
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="auth-container" style={{ maxWidth: '500px' }}>
        <motion.div 
          className="auth-card glass"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 24 }}
        >
          <div className="auth-header">
            <div className="auth-header-icon">
              <UserPlus size={28} />
            </div>
            <h1>Create an Account</h1>
            <p className="auth-subtitle">Join EduPerform to track your performance</p>
          </div>
          
          {(error || localError) && (
            <motion.div 
              className="alert alert-danger"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error || localError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>First Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    style={{ paddingLeft: '40px' }}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  style={{ paddingLeft: '40px' }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  style={{ paddingLeft: '40px', paddingRight: '40px' }}
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Education Level</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <GraduationCap size={18} />
                </div>
                <select
                  name="educationLevel"
                  className="form-control"
                  style={{ paddingLeft: '40px', appearance: 'none' }}
                  value={formData.educationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="SMP">SMP (Junior High)</option>
                  <option value="SMA">SMA (Senior High)</option>
                </select>
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)' }}>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', margin: 0 }}></span> Registering...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
