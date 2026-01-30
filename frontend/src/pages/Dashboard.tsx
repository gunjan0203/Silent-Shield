import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Layout } from '../components';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Fetch user alerts
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // Note: You need to create an endpoint for fetching user alerts
      // const response = await api.get('/alerts/my-alerts');
      // setAlerts(response.data);
      setAlerts([]); // Temporary empty array
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendSOS = async () => {
    if (!userLocation) {
      alert('Please enable location services');
      return;
    }

    try {
      const sosData = {
        code: 'SOS',
        message: 'Emergency SOS activated',
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      };

      await api.post('/alerts/', sosData);
      alert('SOS alert sent successfully!');
    } catch (error) {
      console.error('Error sending SOS:', error);
      alert('Failed to send SOS');
    }
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <h1>Welcome, {user?.full_name}</h1>

        <div className="dashboard-grid">
          {/* SOS Button Section */}
          <div className="dashboard-card sos-section glass-effect hover-glow">
            <h2>Emergency SOS</h2>
            <p>Click the button below to send an immediate emergency alert</p>
            <button onClick={sendSOS} className="sos-button morph-glass-btn">
              🚨 EMERGENCY SOS
            </button>
            <p className="location-info">
              Location:{' '}
              {userLocation
                ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : 'Fetching...'}
            </p>
          </div>

          Quick Actions
          <div className="dashboard-card quick-actions glass-effect">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-button morph-glass-btn" onClick={() => window.location.href = '/reports'}>
                📝 File Report
              </button>
              <button className="action-button morph-glass-btn" onClick={() => window.location.href = '/alerts'}>
                🔔 View Alerts
              </button>
              <button className="action-button morph-glass-btn" onClick={() => window.location.href = '/heatmap'}>
                🗺️ View Heatmap
              </button>
              <button className="action-button morph-glass-btn" onClick={() => window.location.href = '/profile'}>
                👤 My Profile
              </button>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="dashboard-card alerts-section ">
            <h2>Recent Alerts</h2>
            {loading ? (
              <p>Loading alerts...</p>
            ) : alerts.length > 0 ? (
              <ul className="alerts-list">
                {alerts.map((alert) => (
                  <li key={alert.id} className="alert-item hover-glow">
                    <span className="alert-code">{alert.code}</span>
                    <span className={`alert-panic ${alert.panic_level?.toLowerCase()}`}>
                      {alert.panic_level}
                    </span>
                    <span className="alert-time">{new Date(alert.created_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No alerts yet. Stay safe!</p>
            )}
          </div>

          {/* User Info */}
          <div className="dashboard-card user-info glass-effect">
            <h2>Account Information</h2>
            <div className="user-details">
              <p><strong>Name:</strong> {user?.full_name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;