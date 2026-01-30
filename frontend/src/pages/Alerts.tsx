import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Alert.css';

interface Alert {
  id: number;
  code: string;
  message?: string;
  panic_level: string;
  latitude: number;
  longitude: number;
  user_id?: number;
  created_at: string;
}

const Alerts: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // Note: You need to create an endpoint for fetching all alerts
      // For now, we'll simulate with empty array
      setAlerts([]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const alertData = {
            code: 'TEST',
            message: 'Test alert from dashboard',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          await api.post('/alerts/', alertData);
          alert('Test alert sent successfully!');
          fetchAlerts();
        } catch (error) {
          console.error('Error sending test alert:', error);
          alert('Failed to send test alert');
        }
      });
    }
  };

  const sendGuestAlert = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const alertData = {
            code: 'SOS',
            message: 'Emergency SOS from guest',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          await api.post('/alerts/guest', alertData);
          alert('Emergency alert sent! Help is on the way.');
        } catch (error) {
          console.error('Error sending guest alert:', error);
          alert('Failed to send emergency alert');
        }
      });
    }
  };

  const getPanicColor = (panicLevel: string) => {
    switch (panicLevel?.toUpperCase()) {
      case 'HIGH':
        return 'high-panic';
      case 'MEDIUM':
        return 'medium-panic';
      case 'LOW':
        return 'low-panic';
      default:
        return '';
    }
  };

  const getAlertIcon = (code: string) => {
    switch (code) {
      case 'SOS':
        return '🚨';
      case 'MEDICAL':
        return '🏥';
      case 'FIRE':
        return '🔥';
      case 'POLICE':
        return '🚔';
      case 'TEST':
        return '🔧';
      default:
        return '⚠️';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'ALL') return true;
    if (filter === 'MY_ALERTS') return alert.user_id === user?.id;
    if (filter === 'SOS') return alert.code === 'SOS';
    return alert.panic_level === filter;
  });

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h1>Emergency Alerts</h1>
        <p>View and manage all emergency alerts in your area</p>
      </div>

      <div className="alerts-actions">
        <div className="alert-buttons">
          <button onClick={sendTestAlert} className="alert-button test">
            🔧 Send Test Alert
          </button>
          <button onClick={sendGuestAlert} className="alert-button emergency">
            🚨 Send SOS (Guest)
          </button>
          <button onClick={() => window.location.href = '/dashboard'} className="alert-button dashboard">
            📊 Go to Dashboard
          </button>
        </div>

        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Alerts</option>
            <option value="MY_ALERTS">My Alerts</option>
            <option value="SOS">SOS Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-alerts">
          <p>Loading alerts...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="alerts-grid">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-header">
                <div className="alert-code">
                  {getAlertIcon(alert.code)} {alert.code}
                </div>
                <div className={`alert-panic ${getPanicColor(alert.panic_level)}`}>
                  {alert.panic_level}
                </div>
              </div>
              
              {alert.message && (
                <p className="alert-message">{alert.message}</p>
              )}
              
              <div className="alert-details">
                <div className="alert-location">
                  <strong>📍 Location:</strong> 
                  {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </div>
                
                <div className="alert-time">
                  <strong>🕐 Time:</strong> 
                  {new Date(alert.created_at).toLocaleString()}
                </div>
                
                {alert.user_id && (
                  <div className="alert-user">
                    <strong>👤 User ID:</strong> {alert.user_id}
                  </div>
                )}
              </div>
              
              <div className="alert-actions">
                <button className="action-button view">View on Map</button>
                {user?.role === 'VOLUNTEER' && (
                  <button className="action-button respond">Respond</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-alerts">
          <div className="no-alerts-icon">📭</div>
          <h3>No Alerts Found</h3>
          <p>There are no alerts to display. Try changing your filters or check back later.</p>
          
          <div className="alert-types-info">
            <h4>Alert Types:</h4>
            <ul>
              <li><strong>🚨 SOS</strong> - Emergency distress signal</li>
              <li><strong>🏥 MEDICAL</strong> - Medical emergency</li>
              <li><strong>🔥 FIRE</strong> - Fire emergency</li>
              <li><strong>🚔 POLICE</strong> - Police assistance needed</li>
            </ul>
          </div>
        </div>
      )}

      {/* Alert Statistics */}
      <div className="alert-stats">
        <div className="stat-card">
          <div className="stat-value">{alerts.length}</div>
          <div className="stat-label">Total Alerts</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {alerts.filter(a => a.code === 'SOS').length}
          </div>
          <div className="stat-label">SOS Alerts</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {alerts.filter(a => a.panic_level === 'HIGH').length}
          </div>
          <div className="stat-label">High Priority</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {alerts.filter(a => a.user_id === user?.id).length}
          </div>
          <div className="stat-label">My Alerts</div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;