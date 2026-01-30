import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'history'>('profile');
  const [stats, setStats] = useState({
    alertsSent: 0,
    reportsFiled: 0,
    volunteerResponses: 0,
    accountAge: '0 days',
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    // This would come from your backend API
    // For now, we'll set dummy data
    setStats({
      alertsSent: 5,
      reportsFiled: 3,
      volunteerResponses: 12,
      accountAge: '30 days',
    });
  };

  const handleChangePassword = () => {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 6) {
      alert('Password change request sent. Check your email for confirmation.');
    } else if (newPassword) {
      alert('Password must be at least 6 characters long');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion requested. You will receive a confirmation email.');
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="profile-content">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-summary">
            <div className="avatar">
              {userData?.full_name?.charAt(0) || 'U'}
            </div>
            <h3>{userData?.full_name || 'User'}</h3>
            <p className="user-email">{userData?.email}</p>
            <div className={`user-role ${userData?.role?.toLowerCase()}`}>
              {userData?.role || 'USER'}
            </div>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Personal Info
            </button>
            <button 
              className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Account Settings
            </button>
            <button 
              className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📊 Activity History
            </button>
          </nav>

          <div className="quick-stats">
            <h4>Your Safety Stats</h4>
            <div className="stat-item">
              <div className="stat-icon">🚨</div>
              <div className="stat-info">
                <div className="stat-value">{stats.alertsSent}</div>
                <div className="stat-label">Alerts Sent</div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <div className="stat-value">{stats.reportsFiled}</div>
                <div className="stat-label">Reports Filed</div>
              </div>
            </div>
            
            {userData?.role === 'VOLUNTEER' && (
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.volunteerResponses}</div>
                  <div className="stat-label">Responses</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Personal Information</h2>
              
              <div className="info-card">
                <div className="info-section">
                  <h4>Basic Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      <div className="info-value">{userData?.full_name || 'Not set'}</div>
                    </div>
                    
                    <div className="info-item">
                      <label>Email Address</label>
                      <div className="info-value">{userData?.email}</div>
                    </div>
                    
                    <div className="info-item">
                      <label>Account Type</label>
                      <div className="info-value">
                        <span className={`role-badge ${userData?.role?.toLowerCase()}`}>
                          {userData?.role}
                        </span>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <label>Account Status</label>
                      <div className="info-value">
                        <span className={`status-badge ${userData?.is_active ? 'active' : 'inactive'}`}>
                          {userData?.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Emergency Contacts</h4>
                  <p className="section-note">
                    Add emergency contacts to notify them during SOS alerts
                  </p>
                  <button className="add-contact-button">
                    ＋ Add Emergency Contact
                  </button>
                </div>

                <div className="info-section">
                  <h4>Safety Preferences</h4>
                  <div className="preferences">
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Enable auto-location sharing during alerts</span>
                    </label>
                    
                    <label className="preference-item">
                      <input type="checkbox" defaultChecked />
                      <span>Send alerts to emergency contacts</span>
                    </label>
                    
                    <label className="preference-item">
                      <input type="checkbox" />
                      <span>Share anonymous safety reports</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <h2>Account Settings</h2>
              
              <div className="settings-card">
                <div className="settings-section">
                  <h4>Security</h4>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Change Password</h5>
                      <p>Update your account password</p>
                    </div>
                    <button 
                      onClick={handleChangePassword}
                      className="setting-action"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Two-Factor Authentication</h5>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="setting-action">
                      Enable
                    </button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Login Sessions</h5>
                      <p>View and manage active login sessions</p>
                    </div>
                    <button className="setting-action">
                      Manage
                    </button>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Privacy</h4>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Location Privacy</h5>
                      <p>Control how your location data is used</p>
                    </div>
                    <select className="privacy-select" defaultValue="balanced">
                      <option value="strict">Strict</option>
                      <option value="balanced">Balanced</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Data Sharing</h5>
                      <p>Control sharing of anonymous safety data</p>
                    </div>
                    <button className="setting-action">
                      Configure
                    </button>
                  </div>
                </div>

                <div className="settings-section danger-zone">
                  <h4>Danger Zone</h4>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h5>Delete Account</h5>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button 
                      onClick={handleDeleteAccount}
                      className="danger-action"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab">
              <h2>Activity History</h2>
              
              <div className="history-filters">
                <select className="history-filter">
                  <option value="all">All Activities</option>
                  <option value="alerts">Alerts Only</option>
                  <option value="reports">Reports Only</option>
                  <option value="volunteer">Volunteer Actions</option>
                </select>
                
                <input 
                  type="date" 
                  className="date-filter"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="history-list">
                <div className="history-item">
                  <div className="history-icon">🚨</div>
                  <div className="history-details">
                    <h5>SOS Alert Sent</h5>
                    <p>Emergency alert activated from your location</p>
                    <span className="history-time">2 hours ago</span>
                  </div>
                </div>
                
                <div className="history-item">
                  <div className="history-icon">📝</div>
                  <div className="history-details">
                    <h5>Safety Report Filed</h5>
                    <p>Reported poor lighting in Central Park</p>
                    <span className="history-time">1 day ago</span>
                  </div>
                </div>
                
                <div className="history-item">
                  <div className="history-icon">👤</div>
                  <div className="history-details">
                    <h5>Profile Updated</h5>
                    <p>You updated your emergency contact information</p>
                    <span className="history-time">3 days ago</span>
                  </div>
                </div>
                
                {userData?.role === 'VOLUNTEER' && (
                  <div className="history-item">
                    <div className="history-icon">👥</div>
                    <div className="history-details">
                      <h5>Volunteer Response</h5>
                      <p>You responded to an SOS alert in Downtown</p>
                      <span className="history-time">1 week ago</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Quick Access */}
      <div className="emergency-quick-access">
        <button 
          className="quick-sos-button"
          onClick={() => window.location.href = '/dashboard'}
        >
          🚨 Quick SOS
        </button>
        <button 
          className="quick-report-button"
          onClick={() => window.location.href = '/reports'}
        >
          📝 Quick Report
        </button>
      </div>
    </div>
  );
};

export default Profile;