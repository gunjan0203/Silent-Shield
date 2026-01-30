import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header glass-dynamic"> {/* ADD glass-dynamic class */}
      <div className="header-container">
        {/* Logo */}
        <div className="logo-section">
          <Link to="/" className="logo neon-glass"> {/* ADD neon-glass class */}
            🛡️ Silent Shield
          </Link>
          {/* <span className="logo-tagline">Your Safety Companion</span> */}
        </div>

        {/* Navigation */}
        <nav className="nav-section">
          <ul className="nav-list">
            <li className="nav-item wave-glass"> {/* ADD wave-glass class */}
              <Link to="/" className="nav-link hover-glow">Home</Link> {/* ADD hover-glow class */}
            </li>
            
            {user ? (
              <>
                <li className="nav-item wave-glass">
                  <Link to="/dashboard" className="nav-link hover-glow">Dashboard</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/alerts" className="nav-link hover-glow">Alerts</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/reports" className="nav-link hover-glow">Reports</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/heatmap" className="nav-link hover-glow">Heatmap</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/profile" className="nav-link hover-glow">
                    👤 {user.full_name?.split(' ')[0] || 'User'}
                  </Link>
                </li>
                <li className="nav-item wave-glass">
                  <button onClick={handleLogout} className="logout-btn btn-liquid-glass"> {/* ADD btn-liquid-glass class */}
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item wave-glass">
                  <Link to="/login" className="nav-link hover-glow">Login</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/signup" className="nav-link hover-glow">Sign Up</Link>
                </li>
                <li className="nav-item wave-glass">
                  <Link to="/volunteer-signup" className="volunteer-btn btn-liquid-glass">
                    🤝 Become Volunteer
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Emergency SOS Button */}
          <button 
            onClick={() => navigate('/emergency')}
            className="sos-nav-btn " 
          >
            🚨 SOS
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn "> 
          <span className="menu-icon">☰</span>
        </button>
      </div>
    </header>
  );
};

export default Header;