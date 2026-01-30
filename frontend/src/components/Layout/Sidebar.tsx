import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'alerts', label: 'Alerts', icon: '🚨', path: '/alerts' },
    { id: 'reports', label: 'Reports', icon: '📝', path: '/reports' },
    { id: 'heatmap', label: 'Heatmap', icon: '🗺️', path: '/heatmap' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { 
      id: 'volunteer', 
      label: 'Volunteer Portal', 
      icon: '🤝', 
      path: '/volunteer-portal',
      roles: ['VOLUNTEER'] 
    },
    { 
      id: 'admin', 
      label: 'Admin Panel', 
      icon: '⚙️', 
      path: '/admin',
      roles: ['ADMIN'] 
    },
  ];

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="sidebar  glass-depth particle-glass">
      <div className="sidebar-header glass-dynamic">
        <div className="user-info">
          <div className="user-avatar neon-glass">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <h4 className="user-name">{user?.full_name || 'User'}</h4>
            <span className="user-role btn-liquid-glass">{user?.role || 'USER'}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {filteredItems.map(item => (
            <li key={item.id} className="nav-item">
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {isActive(item.path) && <span className="active-indicator"></span>}
              </Link>
            </li>
          ))}
        </ul>

        {/* Emergency Section */}
        <div className="emergency-section ">
          <div className="emergency-header">
            <span className="emergency-icon">⚠️</span>
            <h5>Emergency Quick Actions</h5>
          </div>
          <div className="emergency-actions">
            <button 
              className="emergency-btn sos"
              onClick={() => window.location.href = '/emergency'}
            >
              🚨 Emergency SOS
            </button>
            <button 
              className="emergency-btn quick-report"
              onClick={() => window.location.href = '/reports'}
            >
              📝 Quick Report
            </button>
            <button 
              className="emergency-btn location"
              onClick={() => navigator.geolocation.getCurrentPosition(
                (pos) => alert(`Location: ${pos.coords.latitude}, ${pos.coords.longitude}`)
              )}
            >
              📍 Share Location
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="sidebar-stats">
          <h5>Your Safety Stats</h5>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Alerts Sent</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Reports Filed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Safe Days</div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="quick-settings">
          <h5>Quick Settings</h5>
          <div className="setting-item">
            <span>Location Sharing</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Alert Notifications</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span>Dark Mode</span>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;