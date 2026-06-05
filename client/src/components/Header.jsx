import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../store/AuthContext';
import { GraduationCap, LayoutDashboard, Target, History, User, LogOut } from 'lucide-react';
import './Header.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`header glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon-wrapper">
            <GraduationCap size={28} className="logo-icon" />
          </div>
          <span className="logo-text">EduPerform</span>
        </Link>
        
        {user && (
          <nav className="nav-links">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/predict" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <Target size={18} />
              <span>Predict</span>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <History size={18} />
              <span>History</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <User size={18} />
              <span>Profile</span>
            </NavLink>
            
            <div className="divider"></div>
            
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
