import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../store/AuthContext';
import userService from '../services/userService';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, GraduationCap, Lock, AlertTriangle, Shield, Settings, Trash2 } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    educationLevel: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getProfile();
      setProfile(response.data.user);
      setProfileForm({ educationLevel: response.data.user.educationLevel });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await userService.updateProfile(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        null
      );
      setSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleUpdateEducation = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await userService.updateProfile(null, null, profileForm.educationLevel);
      setSuccess('Education level updated successfully!');
      setProfile(prev => ({
        ...prev,
        educationLevel: profileForm.educationLevel
      }));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError(null);
      await userService.deleteAccount();
      setSuccess('Account deleted successfully. Redirecting to login...');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Header />
        <div className="container" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading profile data...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header />
      <div className="container" style={{ maxWidth: '1000px' }}>
        <motion.div 
          className="profile-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 24 }}
        >
          <h1><Settings className="inline-icon" size={32} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary)' }} /> Profile Settings</h1>
          <p>Manage your account information and preferences</p>
        </motion.div>

        {error && (
          <motion.div className="alert alert-danger" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <AlertTriangle size={20} /> {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div className="alert alert-success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Shield size={20} /> {success}
          </motion.div>
        )}

        {profile && (
          <motion.div 
            className="profile-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* User Information Card */}
            <motion.div variants={itemVariants} className="card glass">
              <div className="card-header">
                <h3><User size={22} className="text-primary" /> Account Information</h3>
              </div>
              <div className="card-body">
                <div className="info-list-container">
                  <div className="info-item">
                    <div className="info-label"><User size={16} /> Full Name</div>
                    <div className="info-value">{profile.firstName} {profile.lastName}</div>
                    <div className="info-subtext">Cannot be changed</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label"><Mail size={16} /> Email Address</div>
                    <div className="info-value">{profile.email}</div>
                    <div className="info-subtext">Cannot be changed</div>
                  </div>

                  <div className="info-item">
                    <div className="info-label"><Calendar size={16} /> Member Since</div>
                    <div className="info-value">{new Date(profile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Education Level Card */}
              <motion.div variants={itemVariants} className="card glass">
                <div className="card-header">
                  <h3><GraduationCap size={22} className="text-primary" /> Education Level</h3>
                </div>
                <div className="card-body profile-form">
                  <form onSubmit={handleUpdateEducation}>
                    <div className="form-group">
                      <label>Current Education Level</label>
                      <select
                        name="educationLevel"
                        className="form-control"
                        value={profileForm.educationLevel}
                        onChange={handleProfileChange}
                      >
                        <option value="SMP">SMP (Junior High School)</option>
                        <option value="SMA">SMA (Senior High School)</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Update Education Level
                    </button>
                  </form>
                </div>
              </motion.div>

              {/* Password Card */}
              <motion.div variants={itemVariants} className="card glass">
                <div className="card-header">
                  <h3><Lock size={22} className="text-primary" /> Security</h3>
                </div>
                <div className="card-body profile-form">
                  {!showPasswordForm ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordForm(true)}
                    >
                      Change Password
                    </button>
                  ) : (
                    <motion.form 
                      onSubmit={handleUpdatePassword}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          className="form-control"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          className="form-control"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          minLength="6"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          className="form-control"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          minLength="6"
                          required
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                          Update Password
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowPasswordForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.form>
                  )}
                </div>
              </motion.div>

              {/* Danger Zone Card */}
              <motion.div variants={itemVariants} className="card danger-zone">
                <div className="card-header">
                  <h3><AlertTriangle size={22} /> Danger Zone</h3>
                </div>
                <div className="card-body">
                  <p className="danger-description">
                    Deleting your account is permanent. Your data will be retained for 90 days before permanent deletion, during which you cannot use this email to register again.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 size={18} /> Delete Account
                    </button>
                  ) : (
                    <motion.div 
                      className="delete-confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="confirm-text"><AlertTriangle size={20} /> Are you sure?</div>
                      <p className="danger-warning-text">This action cannot be undone. All your prediction history will be permanently lost.</p>
                      <div className="form-actions">
                        <button
                          className="btn btn-danger"
                          onClick={handleDeleteAccount}
                        >
                          Yes, Delete My Account
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
